
var text = "Swimming back alone to the bathing rock, head under, he reaches out to grasp the familiar ledge, a fold in the rose-tinged granite just above the surface of the waist-deep water at its edge, by the stone which he can see clearly though unfocused through the lake water. But he has not reached it yet. His expectant hand breaks the surface, down through ‘empty’ water and his knuckles graze the rock. His face will not rise up, dripping and gasping, out of the water. Instead, it ‘falls’ forward and, momentarily, down, into the shallows, stumbles, breathes a choking mouthful, which he expected to be air. He finds his feet, the ledge, a moment later. A child learning to swim, back to this same rock. From tip-toe six yards out, then anxious half-flailing dog-paddle back to the sandy shallows. Missing the ledge and choking. Comforted after her first swim. His hand hovers over smooth forbidden flesh. Imagined ochres. To touch them is assured disaster, waking nightmare, inevitable misunderstanding and, finally, betrayal. Bare island flesh. To reach this shore. To come beside. Islanded. Neurath’s sailor on the moving island, watching its wake — the turbulence of physical knowledge — and wondering (in pictures), ‘Why is it that language wishes me here? On an island of stone and hemlock, of pine and green moss, floor of the woods, light lacing the shallows? Why here?’ Words drifting under the moon, on the Sea of Textuality. Letters lacing the surface of its waters, like that light, misspelt landings, tracing hidden texts in other languages for other islanders. But my grandfather’s boat is sinking, and I cannot reach that body anymore, those selves. And my grandmother’s boat is sinking and I cannot reach that island anymore, those selves of ours. Or the cushion-shaped stone I asked for, or the sloping rock where another father cast for small-mouth bass and other happy fish — trailing a silent line. The sigh of the waters pulled back by the paddle in the only island ‘I’ can move. Swimming back (alone?) to the bathing rock each night, head under, he reaches out to grasp the familiar ledge, a fold in the rose-tinged flesh just below the surface of her waist, but still somehow near her face which he sees clearly through the dark water. But he has not reached her yet. His expectant hand breaks the surface, down through ‘dry’ water and his knuckles graze the rock. His face will not rise up, dripping and gasping, out of the water. Instead, he ‘falls’ forward and, momentarily, down, into the shallows, stumbles, breathes a choking mouthful, which he expected to be sweet, delicious darkness. He finds his sleep, slides off the ledge, a moment later. Neurath’s pilgrim, 1620, on the moving island, leaving the old world and sailing to the new. Unaccountably on deck ‘in a mightie storm’ when the ship pitched, he was thrown into the sea, but caught hold of a top-sail halyard which hung overboard and ‘rane out at length’. He kept his hold ‘though he was sundrie fadomes under water’ until he was hauled back to the surface, then dragged on board with a boat hook. The body is lost, given over to a clock that gives a new name to every separate moment. The body is given over to entropy, the sea. You cannot reach that shore, with seagulls circling. Turning and turning, the island turns in the water and your hand slips off, another bloated corpse.";
var words = text.split(' '), lineW = 0, spaceW, arrowSpeed = -1, shift;
var numLines = 7, displayW = 495, displayX = 113, leading = 40;
var lerpValue = 0, speed = 0.1, dragging, mouseDownX;
var numLinesBelow = 3, lines = [], showBorder = false;
var font, textWidths, margin = 35;

function preload() {
  font = loadFont("Baskerville.ttf");
}

function setup() {

  createCanvas(200, 200);
  frameRate(50);
  windowResized();
}

function draw() {

  background(255);
  noStroke();

  if (abs(lerpValue) > 1 && !dragging) {
    let aval = abs(lerp(lerpValue * speed, 0, 10));
    lerpValue = Math.sign(lerpValue) * aval;
  }
  shift = lerpValue;

  // draw the bottom 4 lines of text
  var yOff = height / 2 + 5;
  textLine(words, lines[numLinesBelow], yOff);
  for (var i = numLinesBelow + 1; i < numLines; i++) {
    textLine(words, lines[i], (yOff += leading));
  }

  // draw the top 3 lines of text
  yOff = height / 2 + 5;
  for (var i = numLinesBelow - 1; i >= 0; i--) {
    textLine(words, lines[i], (yOff -= leading));
  }

  // but use arrows if specified
  if (arrowSpeed != 0) shift = arrowSpeed;

  // and keep a minimum speed
  if (abs(shift) < 1) shift = shift < 0 ? -1 : 1;

  for (var i = 0; i < numLines; i++) {
    shiftLine(i, shift);
  }

  drawBorders();
}

function windowResized() {

  let w = windowWidth - margin;
  let h = 387 / 727 * windowWidth - margin;
  resizeCanvas(w, h);  

  fill(0);
  textFont(font);
  textSize(width * 36 / 727);
  background(255);

  displayX = width * 113 / 727; 
  displayW = width - (displayX  *2);
  leading = width * 40 / 727;

  textWidths = {};
  lineW = lerpValue = 0;
  spaceW = cTextWidth(' ');
  words.forEach((w, i)=> lineW += cTextWidth(w) 
    + (i === 0 ? 0 : spaceW));

  doInitialLayout();
}

function shiftLine(lineIdx, offset) {

  if (offset != 0) {
    lines[lineIdx] += offset;

    if (offset < 0 && offScreenLeft(lines[lineIdx] + lineW)) {
      lines[lineIdx] += lineW + spaceW;
    } else if (offset > 0 && offScreenRight(lines[lineIdx] - lineW)) {
      lines[lineIdx] -= lineW + spaceW;
    }
  }
}

function cTextWidth(word) {

  textWidths = textWidths || {};
  var result = textWidths[word];
  if (!result) {
    result = textWidth(word);
    textWidths[word] = result;
  }
  return result;
}

function textLine(words, x, y) {
``
  var dbug = 0, log = dbug ? '' : null, cursor = x;

  for (var i = 0; i < words.length; i++) {

    if (i != 0) {
      var lastWord = words[i - 1], offSet = cTextWidth(lastWord) + spaceW;
      cursor += offSet;
    }
    var currentX = cursor;

    // text loop
    if (!offScreenRight(lineEnd(x)) && !offScreenRight(cursor + lineW)) {
      currentX += lineW + spaceW;
    } else if (!offScreenLeft(x) && !offScreenLeft(cursor - lineW + cTextWidth(words[i]))) {
      currentX -= lineW + spaceW;
    }

    // only draw text if it is onScreen
    if (!offScreen(currentX, cTextWidth(words[i]))) {
      text(words[i], currentX, y);
    }

    if (dbug) log += cursor + ' ';
  }

  if (dbug) console.log(log);
}

function drawBorders() {

  var lx = [displayX, displayW + displayX];
  if (showBorder) {
    fill(30);
    noStroke();
    rect(lx[0] + 1, 0, -lx[0] - 2, height);
    rect(lx[1], 0, width - lx[1], height);
  } else {
    stroke(200, 0, 0);
    for (var i = 0; i < lx.length; i++) {
      line(lx[i], 0, lx[i], height);
    }
  }
}

function doInitialLayout() {
  lines = [];
  for (var i = 0; i < numLines; i++) {
    lines[i] = displayX;
  }

  // align rows so middle row is at start left
  for (var i = 0; i < numLines; i++) {
    var offset = displayW * -(i - floor(numLines / 2));
    if (offset > 0) offset = -1 * (lineW + spaceW - offset);
    lines[i] += offset;
  }
}

function offScreen(c, l) {
  return offScreenRight(c) || offScreenLeft(c + l);
}

function offScreenRight(c) {
  return c > displayX + displayW;
}

function offScreenLeft(c) {
  return c < displayX;
}

function lineEnd(lineStart) {
  return lineStart + lineW;
}

function keyPressed() {
  switch (keyCode) {
    case UP_ARROW:
      showBorder = !showBorder;
      break;
    case DOWN_ARROW:
      showBorder = !showBorder;
      break;
    case RIGHT_ARROW:
      arrowSpeed = arrowSpeed > 0 ? arrowSpeed + 1 : 1;
      break;
    case LEFT_ARROW:
      arrowSpeed = arrowSpeed < 0 ? arrowSpeed - 1 : -1;
      break;
  }
}

function mousePressed() {
  mouseDownX = mouseX;
}

function mouseDragged() {
  arrowSpeed = 0;
  dragging = true;
  lerpValue = lerp((mouseX - mouseDownX) * speed, 0, 4);
}

function mouseReleased() {
  dragging = false;
}
