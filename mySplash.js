class Splash {

 constructor() {
   
  this.splashBorder = 100;
  fill(255);
  stroke(255, 0, 0)
  rect(this.splashBorder, this.splashBorder, windowWidth-this.splashBorder*2, windowHeight-this.splashBorder*2);
  // draw a rectangle like this in a 3D enviornment
  // rect(this.splashBorder-(windowWidth/2), this.splashBorder-(windowHeight/2), windowWidth-this.splashBorder*2, windowHeight-this.splashBorder*2);
  fill(0, 0, 222);
  strokeWeight(3)
   
  line(windowWidth-this.splashBorder-40, this.splashBorder+20,windowWidth-this.splashBorder-20, this.splashBorder+40)
   line(windowWidth-this.splashBorder-20, this.splashBorder+20,windowWidth-this.splashBorder-40, this.splashBorder+40)
   
this.title = createDiv("Build your own Sonic Nebula");
  this.title.style('color:#673AB7');
  this.title.style('font-family: Arial, Helvetica, sans-serif');
  this.title.position(this.splashBorder+20, this.splashBorder+20);
  
  this.name = createDiv("Syd(Yiding Shi)");
   this. name.style('color:#4CAF50');
  this.name.position(this.splashBorder+20, this.splashBorder+60);
  
  this.info = createDiv("I’ve been working hard on this project, and I’m excited to share how it works. It’s a p5.js particle system with 9999 particles that react to audio, mouse, and keyboard input. The particles flow, attract, explode, and shift colors based on sound, creating an immersive, interactive experience. You can even use your own music and paint the video visuals you want with this system. The controls use the A, W, S, D keys, the spacebar, and the mouse for interaction. It’s been such a joy to code this, and I’m grateful to Bryan Jacobs for being such an inspiring Professor! <p> <a href=https://editor.p5js.org/shmm/sketches/U1BTYZIJF>view code</a>");
   this.info.style('color:#00BCD4');
  
  this.info.position(this.splashBorder+20, this.splashBorder+100);
  this.info.size(windowWidth-this.splashBorder*2-50, windowHeight-this.splashBorder*2-50)
   

  
}
  
  update(){
       if(mouseX > windowWidth-this.splashBorder-40 && 
          mouseX < windowWidth-this.splashBorder-20 
          && mouseY < this.splashBorder+40 
          && mouseY > this.splashBorder+20
     ){
     return true
   }
  }
 
  hide(){
    this.title.remove()
    this.name.remove()
    this.info.remove()
  }
}



