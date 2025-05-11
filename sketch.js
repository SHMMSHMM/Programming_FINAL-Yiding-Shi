let flowParticles = [];
let speedMultiplier = 0.3;
let defaultSpeed = 0.3;
let fft, audio, fileInput;
let playingAudio = false;
let flashScreen = false;
let flashAlpha = 0;
let tailLength = 10;
let aPressed = false;
let dPressed = false;
let particlesInitialized = false;

var mode = 0; 

function setup() {
  createCanvas(windowWidth, windowHeight);
  splash = new Splash();
  colorMode(HSB, 360, 100, 100, 255);
  //background(0);
  noStroke();
}

function draw() {
    if (mouseIsPressed == true && splash.update() == true) {
    mode = 1;
  }
  if (mode == 1) {
    background(0, tailLength)
    splash.hide();
  
    ;

  if (!particlesInitialized) {
    fill(200);
    textSize(24);
    textAlign(CENTER, CENTER);
    text("Click to start", width / 2, height / 2);
    return;  
  }

  if (flashScreen) {
    fill(325, 90, 10, flashAlpha);
    rect(0, 0, width, height);
    flashAlpha -= 1;
    if (flashAlpha <= 0) flashScreen = false;
  }

  let lowEnergy = 0;
  let highEnergy = 0;

  if (playingAudio) {
    fft.analyze();
    lowEnergy = fft.getEnergy(20, 400);
    highEnergy = fft.getEnergy(5000, 16000);
    adjustColorsByLowEnergy(lowEnergy);
  }

  if (aPressed) speedMultiplier = max(0.3, speedMultiplier - 0.2);
  if (dPressed) speedMultiplier = min(40, speedMultiplier + 0.2);

  for (let p of flowParticles) {
    p.setAudioEnergy(lowEnergy);
    if (mouseIsPressed && mouseButton === LEFT) p.attract(mouseX, mouseY);
    if (p.exploding) p.explode();
    p.follow(mouseX, mouseY);
    p.expand();
    p.update();
    p.show();
  }

  drawSpeedBar();
}
}

function mousePressed() {
  if (!particlesInitialized) {
    for (let i = 0; i < 9999; i++) {
      flowParticles.push(new FlowParticle(random(width), random(height)));
    }
    fileInput = createFileInput(handleFile);
    fileInput.position(10, 10);
    fft = new p5.FFT();
    particlesInitialized = true;
  }
}

function keyPressed() {
  if (key === 'W' || key === 'w') {
    speedMultiplier = 15;
    for (let p of flowParticles) p.triggerExplosion(mouseX, mouseY);
    flashScreen = true;
    flashAlpha = 30;
  }
  if (key === 'S' || key === 's') paused = true;
  if (key === ' ') tailLength = 2.5;
  if (key === 'A' || key === 'a') aPressed = true;
  if (key === 'D' || key === 'd') dPressed = true;
  if (key === 'E' || key === 'e') speedMultiplier = defaultSpeed;
}

function keyReleased() {
  if (key === 'W' || key === 'w') speedMultiplier = 0.5;
  if (key === 'S' || key === 's') paused = false;
  if (key === ' ') tailLength = 10;
  if (key === 'A' || key === 'a') aPressed = false;
  if (key === 'D' || key === 'd') dPressed = false;
}

function handleFile(file) {
  if (file.type === 'audio') {
    if (audio) audio.stop();
    audio = loadSound(file.data, () => {
      audio.loop();
      playingAudio = true;
    });
  }
}

function adjustColorsByLowEnergy(energy) {
  let shift = map(energy, 0, 255, 0, 150);
  for (let p of flowParticles) {
    if (p.colorChoice < 0.5) {
      p.hue = constrain(270 - shift, 0, 360);
    } else {
      p.hue = constrain(240 - shift / 1.5, 0, 360);
    }
  }
}

function drawSpeedBar() {
  fill(255);
  textSize(14);
  textAlign(LEFT, BOTTOM);
  text('Speed', 10, height - 10);
  fill(200);
  rect(100, height - 25, 200, 10);
  fill(50, 200, 200);
  let pos = map(speedMultiplier, 0.4, 40, 100, 300);
  rect(pos, height - 25, 5, 10);
}

class FlowParticle {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.vel = createVector(0, 0);
    this.acc = createVector(0, 0);
    this.colorChoice = random(1);
    this.hue = this.colorChoice < 0.5 ? random(240, 270) : random(190, 240);
    this.alpha = random(40, 100);
    this.size = random(1, 2.5);
    this.exploding = false;
    this.audioEnergy = 0;
  }

  setAudioEnergy(energy) { this.audioEnergy = energy; }
  follow(mx, my) {
    let influenceX = map(mx, 0, width, 0.0005, 0.002);
    let influenceY = map(my, 0, height, 0.0005, 0.002);
    let angle = noise(this.pos.x * influenceX, this.pos.y * influenceY, frameCount * 0.001) * TWO_PI * 4;
    let force = p5.Vector.fromAngle(angle);
    force.mult(0.05);
    this.applyForce(force);
  }
  attract(mx, my) {
    let mouseVec = createVector(mx, my);
    let dir = p5.Vector.sub(mouseVec, this.pos);
    let distance = constrain(dir.mag(), 10, 200);
    dir.normalize();
    let strength = map(distance, 10, 200, 0.5, 0.1);
    dir.mult(strength);
    this.applyForce(dir);
  }
  triggerExplosion(mx, my) {
    let mouseVec = createVector(mx, my);
    let dir = p5.Vector.sub(this.pos, mouseVec);
    dir.normalize();
    dir.mult(random(30, 90));
    this.vel.add(dir);
    this.exploding = true;
  }
  explode() {
    this.vel.mult(0.98);
    this.vel.add(p5.Vector.random2D().mult(0.1));
    if (this.vel.mag() < 1) this.exploding = false;
  }
  expand() { this.applyForce(p5.Vector.random2D().mult(0.01)); }
  applyForce(f) { this.acc.add(f); }
  update() {
    this.vel.add(this.acc);
    this.vel.limit(2 * speedMultiplier);
    this.pos.add(this.vel);
    this.acc.mult(0);
    if (this.pos.x > width || this.pos.x < 0) this.vel.x *= -1;
    if (this.pos.y > height || this.pos.y < 0) this.vel.y *= -1;
  }
  show() {
    let dynamicHue = this.hue;
    let flashAlpha = 0;
    if (this.audioEnergy > 150) {
      dynamicHue += random(-30, 30);
      flashAlpha = map(this.audioEnergy, 150, 255, 0, 255);
    }
    fill(dynamicHue, 40, 60, this.alpha);
    ellipse(this.pos.x, this.pos.y, this.size);
    if (flashAlpha > 0) {
      fill(dynamicHue + 180, 80, 80, flashAlpha / 4);
      ellipse(this.pos.x, this.pos.y, this.size * 2);
    } else {
      fill(this.hue, 20, 60, this.alpha / 4);
      ellipse(this.pos.x, this.pos.y, this.size * 2);
    }
  }
}