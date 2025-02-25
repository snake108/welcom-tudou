function setup() {
  createCanvas(400, 400);
}

function draw() {
  background(220);
}

// #WCCChallenge "Wind"
// Also GENUARY 18 (yes, it's January 12) - "What does wind look like?"

// Collaboration with Dave Pagurek https://openprocessing.org/user/67809/
// Dave's base sketch https://editor.p5js.org/davepagurek/sketches/5OttNqPmo
// Birb's Nest Special Edition sketch: https://editor.p5js.org/jordanne/sketches/HMVxNbNQB

// Graphics buffer for the text display
let graphicsArray = [];
let tubeMen = [];

const palette = [
  "rgb(242, 91, 153)",
  "rgb(255, 196, 22)",
  "rgb(255, 227, 143)",
  "rgb(0, 116, 217)",
  "rgb(9, 163, 236)",
  "rgb(18, 209, 255)",
  "rgb(14, 228, 70)",
];


function setup() {
  createCanvas(700, 500);

  // Calculate total TubeMen count
  const rowInfo = [
    { count: 4, heightFactor: 0.55, scale: 0.5, spacing: "even" },
    { count: 5, heightFactor: 0.75, scale: 0.65, spacing: "space-between" },
    { count: 3, heightFactor: 0.95, scale: 1, spacing: "even" }
  ];
  const totalTubeMen = rowInfo.reduce((sum, row) => sum + row.count, 0);

  // Create a shuffled colour array matching the total number of TubeMen
  const extendedPalette = extendAndShuffleArray(palette, totalTubeMen);

  // Create TubeMen for each row
  let colourIndex = 0;
  rowInfo.forEach(rowData => {
    for (let i = 0; i < rowData.count; i++) {
      let x1;
      if (rowData.spacing === "space-between") {
        x1 = width * 0.1 + i * (width * 0.8 / (rowData.count - 1));
      } else {
        x1 = width / (rowData.count + 1) * (i + 1);
      }
      let y1 = height * rowData.heightFactor + random(-10, 10);
      createTubeMan(x1, y1, rowData.scale, extendedPalette[colourIndex]);
      colourIndex++;
    }
  });
}

function draw() {
  background(200);
  tubeMen.forEach(tubeMan => tubeMan.draw());
}

// Helper to create a TubeMan
function createTubeMan(x1, y1, s1, baseColour) {
  let text;
  let h;

  if (random(1) < 0.1) {
    text = 'HAIL SATAN';
    h = random(220, 300); // Ensure height is at least 220 for 'HAIL SATAN'
  } else {
    text = random(['SALE', 'WOWZA', 'WOW']);
    h = random(150, 300);
  }

  tubeMen.push(new WackyTubeMan(x1, y1, h, baseColour, text, s1));
}

// Function to shuffle and extend an array to a given length
function extendAndShuffleArray(array, length) {
  let extendedArray = [];
  while (extendedArray.length < length) {
    extendedArray = extendedArray.concat(array);
  }
  extendedArray = extendedArray.slice(0, length);
  shuffleArray(extendedArray);
  return extendedArray;
}

// Function to shuffle an array
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = floor(random(i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function draw() {
  background("rgb(188, 245, 255)")
  noStroke();
  fill(50, 90, 100);
  rect(0, height * 0.5, width, height);
  tubeMen.forEach(tubeMan => tubeMan.draw());
}

// ─── WACKY TUBE MAN CLASS ─── //
class WackyTubeMan {
  constructor(x, y, height, baseColour, text, scale) {
    this.x = x;
    this.y = y;
    this.height = height;
    this.baseColour = baseColour;
    this.text = text || ' ';
    this.speed = random(0.01, 0.03);
    this.offset = random(0, 1000);
    this.initTextBuffer();
    this.wackyNum = graphicsArray.length - 1; // Index to reference the graphicsArray
    this.scale = scale || 1;
  }

  initTextBuffer() {
    let tex = createGraphics(100, this.height);
    tex.textStyle(BOLD);
    tex.textSize(18);
    tex.fill(255);
    tex.textAlign(CENTER, TOP);
    let y = 50;
    for (const letter of this.text.split('')) {
      tex.text(letter, tex.width / 2, y);
      y += textLeading();
    }
    graphicsArray.push(tex);
  }


  // Draw a single bending segment
  drawBentLine(off, straighten) {
    const ms = millis() + off + this.offset;
    const t = ms % 1000;
    const len = map(sin(t / 1000 * TWO_PI), -1, 1, 0, this.height);
    const remaining = this.height - len;

    rotate(PI * this.speed * sin(ms / 2000 * TWO_PI));
    line(0, 0, 0, -len);
    translate(0, -len);

    rotate(
      PI * 0.5 * cos(-0.2 + ms / 2000 * TWO_PI) *
      (straighten ? (1 - sin(ms / 2000 * TWO_PI) ** 4) : 1)
    );

    push();
    noStroke();
    fill(this.baseColour);
    circle(0, 0, 40);
    pop();

    line(0, 0, 0, -remaining - 30);
    return remaining;
  }

  drawFace() {
    // FACE
    push();
    fill(255);
    noStroke();
    let eyeSize = 15;
    let eyeX = 10;

    ellipse(eyeX, 0, eyeSize, 23);
    ellipse(-eyeX, 0, eyeSize, 23);

    fill(0);
    ellipse(eyeX, 0, 10, 12);
    ellipse(-eyeX, 0, 10, 12);

    noFill();
    stroke(255);
    strokeWeight(2);
    arc(0, 10, 10, -10, 0, PI);

    pop();
  }

  // Draw the full tube man
  draw() {
    stroke(this.baseColour);
    strokeWeight(40);

    // BODY
    push();
    translate(this.x, this.y);
    scale(this.scale);
    rotate(sin(millis() * 0.005) * PI * 0.1);

    push();
    strokeCap(SQUARE);
    const remaining = this.drawBentLine(0, true);
    const len = this.height - remaining;
    translate(0, -remaining);

    // ARMS
    push();
    rotate(PI * -0.2 * cos(-0.2 + millis() / 2000 * TWO_PI));
    for (const side of [0, 1]) {
      push();
      scale(0.35);
      if (side === 1) {
        translate(-40, 0);
        scale(-1, 1);
      } else {
        translate(40, 0);
      }
      rotate(PI * 0.2);
      this.drawBentLine(500, true);
      pop();
    }
    pop();

    // HAIR
    push();
    translate(0, -30);
    rotate(PI * 0.1 * cos(-0.2 + millis() / 2000 * TWO_PI));
    for (const side of [0, 0.33, 0.66, 1]) {
      push();
      scale(0.15);
      rotate(PI * -0.2 + side * PI * 0.4);
      this.drawBentLine(100 + side * 20, false);
      pop();
    }
    pop();

    this.drawFace();

    pop(); // End BODY logic

    // TEXT
    push();
    rotate(PI * this.speed * sin((millis() + this.offset) / 2000 * TWO_PI));
    const numSlices = this.height / 40; // arbitrary slice number based on height uhhh
    for (let slice = 0; slice < numSlices; slice++) {
      const startY = map(slice, 0, numSlices, 0, graphicsArray[this.wackyNum].height);
      const endY = map(slice + 1, 0, numSlices, 0, graphicsArray[this.wackyNum].height);

      if (graphicsArray[this.wackyNum].height - startY < len + 30) {
        image(
          graphicsArray[this.wackyNum],
          -graphicsArray[this.wackyNum].width / 2,
          -graphicsArray[this.wackyNum].height + startY,
          graphicsArray[this.wackyNum].width,
          endY - startY,
          0,
          startY,
          graphicsArray[this.wackyNum].width,
          endY - startY
        );
      } else {
        push();
        translate(0, -len);
        rotate(
          PI * 0.5 * cos(-0.2 + (millis() + this.offset) / 2000 * TWO_PI) *
          (1 - sin((millis() + this.offset) / 2000 * TWO_PI) ** 4)
        );
        translate(0, len);
        image(
          graphicsArray[this.wackyNum],
          -graphicsArray[this.wackyNum].width / 2,
          -graphicsArray[this.wackyNum].height + startY,
          graphicsArray[this.wackyNum].width,
          endY - startY,
          0,
          startY,
          graphicsArray[this.wackyNum].width,
          endY - startY
        );
        pop();
      }
    }
    pop(); // End TEXT logic

    pop(); // End entire TubeMan

    // BASE
    push();
    translate(this.x, this.y);
    scale(this.scale);
    fill(0);
    noStroke();
    rect(- 30, - 10, 60, 40, 15, 15, 5, 5);
    pop();
  }
}