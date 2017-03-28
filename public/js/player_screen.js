let rawAmplitude;
let playerRef;
let gameInfoRef;
let rolledColor = [];
let rolledNote;
let curMode;

let isRolling = false;
let isRecording = false;

const config = {
  apiKey: "AIzaSyBA13OXODNAyVcLKIVY84cJRZbjz49vJEI",
  authDomain: "roy-musical-landscape.firebaseapp.com",
  databaseURL: "https://roy-musical-landscape.firebaseio.com",
  storageBucket: "roy-musical-landscape.appspot.com",
  messagingSenderId: "110353238694"
};

function setup() {
  mic = new p5.AudioIn();
  mic.start();
  rawAmplitude = new p5.Amplitude();
  rawAmplitude.setInput(mic);
  frameRate(20);
}

function draw() {
  const amplitude = rawAmplitude.getLevel();
  const curNote = noteStrings[noteFromPitch(pitch)%12];
  // const convertedPitch = Math.max(noteFromPitch(pitch), 0);
  if (isRecording) {
    playerRef.update({
      amplitude,
      pitch: pitch,
      // if singing correctly, treat as a hit
      isHit: curNote === rolledNote
    });
    const c = pitch2color(pitch);
    if (c !== null) {
      $('body').css('background-color', HSV2RGB(c.h, c.s, c.v));
      const markerPos = c.h/360 * windowWidth + (c.sR/100) * (windowWidth/7);
      $('#marker').css('left', markerPos + 'px');
    }
  }
}

function startRecording() {
  isRecording = true;
  $('#mic').addClass('button-pulsate');
}

function endRecording() {
  isRecording = false;
  $('#mic').removeClass('button-pulsate');
}

$(document).ready(() => {
  initAudio();
  window.pitch = pitch;
  window.noteFromPitch = noteFromPitch;

  firebase.initializeApp(config);
  const database = firebase.database();
  playerRef = database.ref('players/').push();
  gameInfoRef = database.ref('gameInfo/');

  gameInfoRef.on('value', (snapshot) => {
    const nPlayer = snapshot.val().nPlayer;
    const curNPlayer = snapshot.val().curNPlayer;
    newMode = snapshot.val().mode;

    if (newMode == -1) {
      location.reload();
      gameInfoRef.update({ mode: -2 });
    } 

    $('#next').hide();
    if (newMode == 1) {
      $('#hint').text('Hold the mic and sing together.');
    }

    // each individual has found their note (individual mode), or player has finished chording
    if (nPlayer == curNPlayer) {
      if (curMode == 0) {
        $('#hint').html('Are all players ready? <br/> Let\'s sing together.');
      } else if (curMode == 1) {
        $('#hint').text('Take us to the next round!');
      }
      $('#next').fadeIn();
    }

    // switching from chording to individual: a new round
    if (newMode == 0 && curMode == 1) {
      $('#mic').fadeOut();
      $('#dice').fadeIn();
      $('#hint').text('Roll the dice.');
    }
    curMode = newMode;
  });

  $('#hint').text('Roll the dice.');
  $('#mic').hide();
  $('#next').hide();

  $('#next').click(() => {
    // toggle mode
    const newMode = 1 - curMode;
    gameInfoRef.update({mode: newMode});
  });

  $('#dice').click(() => {
    if (!isRolling) {
      isRolling = true;
      // $('body').addClass('bgcolor-animated');
      $('#dice').addClass('dice-roll');
    } else {
      var rolledIdx = parseInt(Math.random() * COLOR_PALETTE.length);
      rolledColor.push(COLOR_PALETTE[rolledIdx]);
      rolledNote = KEYS[rolledIdx];
      playerRef.set({
        rolledColor,
        amplitude: 0,
        pitch: 0,
        isHit: false,
      });

      $('#hint').html('Once everyone has rolled, click and hold the mic to find the color <b>' + COLOR_PALETTE_NAME[rolledIdx] + '</b>!');

      $('body').removeClass('bgcolor-animated');
      $('#dice').removeClass('dice-roll');
      isRolling = false;
      $('body').css("background-color", rolledColor[rolledColor.length - 1]);
      $('#dice').fadeOut();
      $('#mic').fadeIn();
    }
  });

  $('#mic').bind('mousedown touchstart', () => {
    startRecording();
  });

  $(document).bind('mouseup touchend', () => {
    endRecording();
  });

  $(document).keydown((e) => {
    if (e.which == 32 /* space */ && !isRecording && $('#mic').css('display') === 'block') {
      e.preventDefault();
      startRecording();
    }
  });

  $(document).keyup((e) => {
    if (e.which == 32 /* space */ && isRecording && $('#mic').css('display') === 'block') {
      e.preventDefault();
      endRecording();
    }
  });
});
