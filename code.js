var LEADING = 40,
    NUM_LINES_ABOVE = 3,
    NUM_LINES_BELOW = 3;

var DISPLAY_WIDTH = 480,
    DISPLAY_X = 133;

var words, lineW = 0, spaceW,
    arrowSpeed = -1,
    shift;

var totalLines, lines = [];

var font;

var dbug = false,
    defaultFont = false;

//Lerp
var lerpValue = 0,
    speed = .1,
    dragging, mouseDownX;

function preload() {

    if (!defaultFont) font = loadFont('Baskerville.ttf');
    words = loadStrings("../src/data/misspeltLandings.txt");

}

function setup() {

    createCanvas(727, 387);
    background(255);
    frameRate(50);

    //STYLES
    fill(0);
    if (!defaultFont) textFont(font);
    textSize(36);
    words = words[0].split(" ");
    spaceW = textWidth(" ");
    for (var i = 0; i < words.length; i++){
      lineW += textWidth(words[i]) + (i === 0 ? 0: spaceW);
    }

    totalLines = NUM_LINES_ABOVE + NUM_LINES_ABOVE + 1;

    console.log("Line width:", lineW);
    console.log("Space width:", spaceW);

    doInitialLayout();
}

function draw() {


    background(255);
    if (abs(lerpValue) > 1 && !dragging) lerpValue = Math.sign(lerpValue) * abs(lerp((lerpValue) * speed, 0, 10));
    shift = lerpValue;

    //draw 7 lines
    var yOff = height / 2 + 5;
    textLine(words, lines[NUM_LINES_BELOW], yOff);
    for (var i = NUM_LINES_BELOW + 1; i < totalLines; i++) {
        textLine(words, lines[i], yOff += LEADING);
    }
    yOff = height / 2 + 5;
    for (var i = NUM_LINES_BELOW - 1; i >= 0; i--) {
        textLine(words, lines[i], yOff -= LEADING);
    }

    // but use arrows if specified
    if (arrowSpeed != 0)
        shift = arrowSpeed;

    // and keep a minimum speed
    if (abs(shift) < 1)
        shift = shift < 0 ? -1 : 1;

    for (var i = 0; i < totalLines; i++)
        shiftLine(i, shift);

    verticalLines();
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

function textLine(words, x, y) {
    var log = "";
    var cursor = x;
    for (var i = 0; i < words.length; i++) {
        var word = words[i];

        if (i != 0) {
            var lastWord = words[i - 1],
                offSet = textWidth(lastWord) + spaceW;
            cursor += offSet;
        }
        var currentX = cursor;

        //text loop
        if (!offScreenRight(lineEnd(x)) && !offScreenRight(cursor + lineW)) {
            currentX += lineW + spaceW;
        } else if (!offScreenLeft(x) && !offScreenLeft(cursor - lineW + textWidth(word))) {
            currentX -= lineW + spaceW;
        }
        //only draw text if it is onScreen
        drawVisibleText(word, currentX, y);

        log += cursor + " ";

    }
    if (dbug) console.log(log);
}

function drawVisibleText(word, x, y) {
    if (!offScreen(x, textWidth(word))) {
        // console.log(word,x,y);
        text(word, x, y);
    }
}

function verticalLines() {
    var x = [ DISPLAY_X, DISPLAY_WIDTH + DISPLAY_X ];
    stroke(200, 0, 0);
    for (var i = 0; i < x.length; i++)
        line(x[i], 0, x[i], height);
}

function doInitialLayout() {
    //init lines
    lines = new Array(totalLines);
    for (var i = 0; i < lines.length; i++) {
        lines[i] = DISPLAY_X;
    }

    // align rows so middle row is at start left
    for (var i = 0; i < totalLines; i++) {
        var offset = (DISPLAY_WIDTH * -(i - floor(totalLines / 2)));
        if (offset > 0)
            offset = -1 * (lineW + spaceW - offset);
        lines[i] += offset;
    }


}

function offScreen(c, l) {
    return offScreenRight(c) || offScreenLeft(c + l);
}

function offScreenRight(c) {
    return c > (DISPLAY_X + DISPLAY_WIDTH);
}

function offScreenLeft(c) {
    return c < DISPLAY_X;
}

function lineEnd(lineStart) {
    return lineStart + lineW;
}

function keyPressed() {
    switch (keyCode) {
        case RIGHT_ARROW:
            arrowSpeed = (arrowSpeed > 0) ? arrowSpeed + 1 : 1;
            break;
        case LEFT_ARROW:
            arrowSpeed = (arrowSpeed < 0) ? arrowSpeed - 1 : -1;
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
