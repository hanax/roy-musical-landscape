let rolledIdx;
let isRolling = false;
let isRecording = false;
let bgItv;

function startRecording() {
  isRecording = true;
  $('.mic').addClass('button-pulsate');
  bgItv = setInterval(function() {
    var c = pitch2color(pitch);
    if (c !== null) {
      $('body').css('background-color', HSV2RGB(c.h, c.s, c.v));      
    }
  }, 100);
}

function endRecording() {
  isRecording = false;
  $('.mic').removeClass('button-pulsate');
  clearInterval(bgItv);
}

$(document).ready(() => {
  initAudio();
  window.pitch = pitch;
  $('#dice').click(() => {
    $('#dice').removeClass('dice-roll');
    $('#dice').addClass('dice-blue');
    $('body').css('background-color', '#301AC8');      
  });

  $('.mic-touch').bind('mousedown touchstart', (e) => {
    e.preventDefault();
    startRecording();
  });

  $(document).bind('mouseup touchend', () => {
    endRecording();
  });
});
