let circles;
let gameStarted;
let nPlayer;
let curNPlayer;
let nRound;
let playersRef;
let gameInfoRef;
// 0: individual; 1: chording;
let gameMode;

const MAX_CIRCLE_SIZE = 200;
const MIN_CIRCLE_SIZE = 50;
const BORDER = 100;

const config = {
  apiKey: "AIzaSyBA13OXODNAyVcLKIVY84cJRZbjz49vJEI",
  authDomain: "roy-musical-landscape.firebaseapp.com",
  databaseURL: "https://roy-musical-landscape.firebaseio.com",
  storageBucket: "roy-musical-landscape.appspot.com",
  messagingSenderId: "110353238694"
};

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(0);
  // reduce frame rate
  frameRate(20);

  circles = new Circles();
}

function draw() {
  // background(0); 

  circles.display();
}

function Circles() {
  this._circles = {};
}

Circles.prototype.get = function(key) {
  if (this._circles[key] == undefined && curNPlayer < nPlayer) {
    curNPlayer ++;
    gameInfoRef.update({ curNPlayer });
    this.add(
      key,
      createVector(
        Math.min(Math.max(BORDER, Math.random() * windowWidth), windowWidth - BORDER),
        Math.min(Math.max(BORDER, Math.random() * windowHeight), windowHeight - BORDER)
      )
    );
  }
  return this._circles[key];
};

Circles.prototype.add = function(key, position) {
  this._circles[key] = new Circle(position);
};

Circles.prototype.display = function() {
  for (let circleKey in this._circles) {
    this._circles[circleKey].display();
  }
};

function Circle(position) {
  this.position = createVector(position.x, position.y);
  this.hue = 0;
  this.sat = 0;
  this.size = 0;
  this.isHit = false;
  this.alpha = 0;
  this.xDirection = 1;
  this.yDirection = 1;
}

Circle.prototype.update = function(color, size, isHit) {
  this.isHit = isHit;
  if (gameMode === 0) {
    this.hue = color.h;
    this.sat = color.s;
    this.size = size;
    this.alpha = Math.max(1 - (this.size - MIN_CIRCLE_SIZE) / (MAX_CIRCLE_SIZE - MIN_CIRCLE_SIZE), 0.5);
  } else if (gameMode === 1) {
    this.hue = color.h;
    this.alpha = 0.3 + 0.2 * Math.random();
    this.size = 15 * Math.random();
    this.position.x += 25 * this.xDirection * Math.random();
    this.position.y += 25 * this.yDirection * Math.random();
    if (this.position.x > windowWidth && this.xDirection === 1) {
      this.xDirection = -1;
    } else if (this.position.x < 0 && this.xDirection === -1) {
      this.xDirection = 1;
    }
    if (this.position.y > windowHeight && this.yDirection === 1) {
      this.yDirection = -1;
    } else if (this.position.y < 0 && this.yDirection === -1) {
      this.yDirection = 1;
    }
  }
};

Circle.prototype.display = function() {
  colorMode(HSB);
  // if is a hit, display a bright ring
  if (this.isHit) {
    strokeWeight(4);
    stroke(color(this.hue, 20, 100, 0.5));
    fill(color(0,0,0,0));
    ellipse(this.position.x, this.position.y, this.size, this.size);
    strokeWeight(1);
    stroke(color(this.hue, 10, 100, 0.8));
    fill(color(0,0,0,0));
    ellipse(this.position.x, this.position.y, this.size, this.size);
  } else {
    noStroke();
    fill(color(this.hue, this.sat, 80, this.alpha));
    ellipse(this.position.x, this.position.y, this.size, this.size);
  }
};

const updateCircle = (playerKey, pitch, amplitude, isHit) => {
  const circle = circles.get(playerKey);
  circle.update(
    // TODO: map pitch correctly to color
    pitch2color(pitch),
    map(amplitude, 0, 0.3, MIN_CIRCLE_SIZE, MAX_CIRCLE_SIZE),
    isHit
  );
};

$(document).ready(() => {
  firebase.initializeApp(config);
  const database = firebase.database();
  gameStarted = false;
  curNPlayer = 0;
  nRound = 0;

  // Refresh the shared screen will cause all data to be wiped
  playersRef = database.ref('players/');
  gameInfoRef = database.ref('gameInfo/');
  playersRef.remove();
  gameInfoRef.remove();
  gameInfoRef.set({mode: -1, nPlayer: 0});

  playersRef.on('value', (snapshot) => {
    console.log('Players Info: ');

    snapshot.forEach((playerSnap) => {
      const playerKey = playerSnap.key;
      const playerData = playerSnap.val();
      console.log('Player ' + playerKey + ' Info: ', playerData);

      if (playerData.rolledColor) {
        const $rowTitle = $(`#player-info-title-r`).length === 0 ?
          $(`<div class="player-info-r" id="player-info-title-r" />`).appendTo($('#players-info')) :
          $(`#player-info-title-r`);
        $rowTitle.empty();
        const $row = $(`#${playerKey}`).length === 0 ?
          $(`<div class="player-info-r" id=${playerKey} />`).appendTo($('#players-info')) :
          $(`#${playerKey}`);
        $row.empty();
        for (var i = 0; i < playerData.rolledColor.length; i ++) {
          const $pT = $('<div class="player-info-title" />')
            .text('Round ' + (i+1))
            .appendTo($rowTitle);
        }
        for (var i = 0; i < playerData.rolledColor.length - 1; i ++) {
          const c = playerData.rolledColor[i];
          const $p = $('<div class="player-info" />')
            .css('backgroundColor', c)
            .appendTo($row);
        }
        const c = playerData.rolledColor[playerData.rolledColor.length - 1];
        const $p = $('<div class="player-info player-info--pulsate" />')
          .css('backgroundColor', c)
          .appendTo($row);
        $('#players-info').append()
      }

      // If any player starts to sing, the game is considered started.
      if (playerData.amplitude > 0.005) {
        if (!gameStarted) {
          gameStarted = true;
          gameMode = 0;
          // Lock down player number, mark game started
          nPlayer = Object.keys(snapshot.val()).length;
          gameInfoRef.update({ nPlayer, mode: 0 });
        }
        updateCircle(playerKey + '__' + nRound, playerData.pitch, playerData.amplitude, playerData.isHit);
        // TODO: see if all player is singing, rather than just treat chording as finished
        if (gameMode == 1 && curNPlayer === 0) {
          curNPlayer = nPlayer;
          gameInfoRef.update({ curNPlayer });
        }
      }
    });
  });

  gameInfoRef.on('value', (snapshot) => {
    const mode = snapshot.val().mode;
    console.log('Game Info: ', snapshot.val());
    // if switching from chording to individual, a new round
    if (gameMode == 1 && mode == 0) {
      background('rgba(0,0,0,.15)')
      nRound ++;
      curNPlayer = 0;
      gameInfoRef.update({ curNPlayer });
    // if switching from individual to chording
    } else if (gameMode == 0 && mode == 1) {
      curNPlayer = 0;
      gameInfoRef.update({ curNPlayer });
    }
    gameMode = mode;
  });

  $('#btn-refresh').click(function() {
    location.reload();
  });

  $('#btn-save').click(function() {
    saveCanvas(canvas,'demo','jpg');
  });
});
