let canvasHolder;
let gameCanvas;

let Width;
let Height;

let w;
let h;

let offset = 60;

let wSP;
let hSP;

let rects = new Array(16);
let selectedRects = new Array(16);

let designSelect;

let selectedColor;
let colorPicker;
let button;

let start = false;

function setup() {
  canvasHolder = document.getElementById("canvasHolder");
  w = canvasHolder.offsetWidth;
  h = canvasHolder.offsetHeight;
  gameCanvas = createCanvas(w, h);
  gameCanvas.parent(canvasHolder);
  textAlign(CENTER, CENTER);
  ellipseMode(CENTER);
  rectMode(CENTER);
  angleMode(DEGREES);
  frameRate(60);
  windowResized();
  document.addEventListener("contextmenu", event => event.preventDefault());
  colorPicker = createColorPicker("#ff0000");
  colorPicker.input(newColor);
  button = createButton("Save Design");
  button.position(colorPicker.x + 65, colorPicker.y);
  designSelect = createSelect();
  designSelect.position(10, 10);
  designSelect.changed(designChanged);
  button.mousePressed(saveDesign);
  CONNECT();
  for (let i = 0; i < 16; i++) {
    rects[i] = new Array(16);
    for (let j = 0; j < 16; j++) {
      rects[i][j] = 0;
    }
  }
  designSelect.option("Submitted Designs");
}

function LOAD() {
  newColor();
  designs.forEach(design => {
    designSelect.option(design.ip);
  });
  start = true;
}

function windowResized() {
  w = canvasHolder.offsetWidth;
  h = canvasHolder.offsetHeight;
  wSP = Math.round((w - offset) / 16);
  hSP = Math.round((h - offset) / 16);
  resizeCanvas(w, h);
}

function saveDesign() {
  SAVE(selectedRects);
}

function designChanged() {
  designs.forEach(design => {
    if (designSelect.value() == "Submitted Designs") {
      return;
    } else if (design.ip == designSelect.value()) {
      CLEAR();
      selectedRects = design.data;
      DRAW(selectedRects);
      console.log("Loaded Desing");
      return;
    }
  });
}

function newColor() {
  let pickedColor = colorPicker.color().levels;
  selectedColor =
    pickedColor[0].toString(16) +
    pickedColor[1].toString(16) +
    pickedColor[2].toString(16);
}

function draw() {
  if (!start) return;
  background(0);
  drawFrame();
}

function mousePressed() {
  let x = mouseX;
  let y = mouseY;
  for (var i = 0; i < 16; i++) {
    for (var j = 0; j < 16; j++) {
      let pos = rects[i][j];
      if (
        x > Math.abs(wSP / 2 - pos.x) &&
        x < wSP / 2 + pos.x &&
        y > Math.abs(hSP / 2 - pos.y) &&
        y < hSP / 2 + pos.y
      ) {
        if (mouseButton == LEFT) {
          selectedRects[i][j] = selectedColor;
          WRITE(j, i, selectedColor);
          return;
        } else {
          selectedRects[i][j] = "000000";
          WRITE(j, i, selectedRects[i][j]);
        }
      }
    }
  }
}

function drawFrame() {
  strokeWeight(1);
  stroke(255);
  for (var i = 0; i < 16; i++) {
    for (var j = 0; j < 16; j++) {
      let x = wSP * j + offset;
      let y = hSP * i + offset;
      let color = Color.StringToRGB(selectedRects[i][j]);
      fill(color.r, color.g, color.b);
      rect(wSP * j + offset, hSP * i + offset, wSP, hSP);
      rects[i][j] = { x: x, y: y };
    }
  }
}
