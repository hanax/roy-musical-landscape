const KEYS = ['C', 'D',  'E', 'F',  'G',  'A',  'B'];
const HUES = [0,   34,   59,   97,  176,  248,  269];
const RED = HUES[0];
const ORA = HUES[1];
const YEL = HUES[2];
const GRE = HUES[3];
const BLU = HUES[4];
const IND = HUES[5];
const VIO = HUES[6];
const COLOR_PALETTE = ['#FF0000','#FF9100','#FFFB00','#62FF00','#00FFEE','#2200FF','#7B00FF'];
const COLOR_PALETTE_NAME = ['red','orange','yellow','green','blue','indigo','violet'];

const myMap = function(v, s1, s2, d1, d2) {
  if (s2 === 0) return 0;
  return ((v - s1) / (s2 - s1)) * (d2 - d1) + d1;
}

const pitch2color = function(p) {

  let hue, sat, satRaw;
  if (p < 130) {
    return null;
  } else if (p < 146) {
    hue = myMap(p, 130, 146, RED, ORA);
    sat = Math.abs(myMap(p, 130, 146, -100, 100));
    satRaw = myMap(p, 130, 146, 0, 100);
  } else if (p < 164) {
    hue = myMap(p, 146, 164, ORA, YEL);
    sat = Math.abs(myMap(p, 146, 164, -100, 100));
    satRaw = myMap(p, 146, 164, 0, 100);
  } else if (p < 174) {
    hue = myMap(p, 164, 174, YEL, GRE);
    sat = Math.abs(myMap(p, 164, 174, -100, 100));
    satRaw = myMap(p, 164, 174, 0, 100);
  } else if (p < 196) {
    hue = myMap(p, 174, 196, GRE, BLU);
    sat = Math.abs(myMap(p, 174, 196, -100, 100));
    satRaw = myMap(p, 174, 196, 0, 100);
  } else if (p < 220) {
    hue = myMap(p, 196, 220, BLU, IND);
    sat = Math.abs(myMap(p, 196, 220, -100, 100));
    satRaw = myMap(p, 196, 220, 0, 100);
  } else if (p < 246) {
    hue = myMap(p, 220, 246, IND, VIO);
    sat = Math.abs(myMap(p, 220, 246, -100, 100));
    satRaw = myMap(p, 220, 246, 0, 100);
  } else if (p < 261) {
    hue = myMap(p, 246, 261, VIO, RED);
    sat = Math.abs(myMap(p, 246, 261, -100, 100));
    satRaw = myMap(p, 246, 261, 0, 100);
  } else if (p < 293) {
    hue = myMap(p, 261, 293, RED, ORA);
    sat = Math.abs(myMap(p, 261, 293, -100, 100));
    satRaw = myMap(p, 261, 293, 0, 100);
  } else if (p < 329) {
    hue = myMap(p, 261, 329, ORA, YEL);
    sat = Math.abs(myMap(p, 261, 329, -100, 100));
    satRaw = myMap(p, 261, 329, 0, 100);
  } else if (p < 349) {
    hue = myMap(p, 329, 349, YEL, GRE);
    sat = Math.abs(myMap(p, 329, 349, -100, 100));
    satRaw = myMap(p, 329, 349, 0, 100);
  } else if (p < 392) {
    hue = myMap(p, 349, 392, GRE, BLU);
    sat = Math.abs(myMap(p, 349, 392, -100, 100));
    satRaw = myMap(p, 349, 392, 0, 100);
  } else if (p < 440) {
    hue = myMap(p, 392, 440, BLU, IND);
    sat = Math.abs(myMap(p, 392, 440, -100, 100));
    satRaw = myMap(p, 392, 440, 0, 100);
  } else if (p < 493) {
    hue = myMap(p, 440, 493, IND, VIO);
    sat = Math.abs(myMap(p, 440, 493, -100, 100));
    satRaw = myMap(p, 440, 493, 0, 100);
  } else if (p < 523) {
    hue = myMap(p, 493, 523, VIO, RED);
    sat = Math.abs(myMap(p, 493, 523, -100, 100));
    satRaw = myMap(p, 493, 523, 0, 100);
  } else if (p < 587) {
    hue = myMap(p, 523, 587, RED, ORA);
    sat = Math.abs(myMap(p, 523, 587, -100, 100));
    satRaw = myMap(p, 523, 587, 0, 100);
  } else if (p < 659) {
    hue = myMap(p, 587, 659, ORA, YEL);
    sat = Math.abs(myMap(p, 587, 659, -100, 100));
    satRaw = myMap(p, 587, 659, 0, 100);
  } else if (p < 698) {
    hue = myMap(p, 659, 698, YEL, GRE);
    sat = Math.abs(myMap(p, 659, 698, -100, 100));
    satRaw = myMap(p, 659, 698, 0, 100);
  } else if (p < 783) {
    hue = myMap(p, 698, 783, GRE, BLU);
    sat = Math.abs(myMap(p, 698, 783, -100, 100));
    satRaw = myMap(p, 698, 783, 0, 100);
  } else if (p < 880) {
    hue = myMap(p, 783, 880, BLU, IND);
    sat = Math.abs(myMap(p, 783, 880, -100, 100));
    satRaw = myMap(p, 783, 880, 0, 100);
  } else if (p < 987) {
    hue = myMap(p, 880, 987, IND, VIO);
    sat = Math.abs(myMap(p, 880, 987, -100, 100));
    satRaw = myMap(p, 880, 987, 0, 100);
  } else if (p < 1046) {
    hue = myMap(p, 987, 1046, VIO, RED);
    sat = Math.abs(myMap(p, 987, 1046, -100, 100));
    satRaw = myMap(p, 987, 1046, 0, 100);
  } else if (p < 1174) {
    hue = myMap(p, 1046, 1174, RED, ORA);
    sat = Math.abs(myMap(p, 1046, 1174, -100, 100));
    satRaw = myMap(p, 1046, 1174, 0, 100);
  } else if (p < 1318) {
    hue = myMap(p, 1174, 1318, ORA, YEL);
    sat = Math.abs(myMap(p, 1174, 1318, -100, 100));
    satRaw = myMap(p, 1174, 1318, 0, 100);
  } else if (p < 1396) {
    hue = myMap(p, 1318, 1396, YEL, GRE);
    sat = Math.abs(myMap(p, 1318, 1396, -100, 100));
    satRaw = myMap(p, 1318, 1396, 0, 100);
  } else {
    return null;
  }

  return {
    h: hue,
    s: sat,
    v: 80,
    sR: satRaw
  };
};

const HSV2RGB = function(h, s, v) {
  h = myMap(h, 0, 360, 0, 1);
  s = myMap(s, 0, 100, 0, 1);
  v = myMap(v, 0, 100, 0, 1);
  var r, g, b, i, f, p, q, t;
  if (arguments.length === 1) {
      s = h.s, v = h.v, h = h.h;
  }
  i = Math.floor(h * 6);
  f = h * 6 - i;
  p = v * (1 - s);
  q = v * (1 - f * s);
  t = v * (1 - (1 - f) * s);
  switch (i % 6) {
    case 0: r = v, g = t, b = p; break;
    case 1: r = q, g = v, b = p; break;
    case 2: r = p, g = v, b = t; break;
    case 3: r = p, g = q, b = v; break;
    case 4: r = t, g = p, b = v; break;
    case 5: r = v, g = p, b = q; break;
  }
  return "rgb(" + Math.round(r * 255) + "," + Math.round(g * 255) + "," + Math.round(b * 255) + ")";
  // return {
  //   r: Math.round(r * 255),
  //   g: Math.round(g * 255),
  //   b: Math.round(b * 255)
  // };
}