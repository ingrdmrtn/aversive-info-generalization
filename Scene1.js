class Scene1 extends Phaser.Scene {
  constructor() {
    super("bootGame");
  }


  preload() {
    this.load.image('background','assets/instructBackground.png')
  }
  create() {

    this.background = this.add.image(0, 0, 'background');
    this.background.setOrigin(0, 0);
  // Create a rectangle background for the text
  let graphics = this.add.graphics();
  graphics.fillStyle(0x001426, 0.7); // Black background with opacity
  graphics.fillRect(90, 90, 800, 100); // Adjust size and position as needed

  // Add text on top of the graphics
  this.instructions = this.add.text(100, 120, 'Help! You’ve been sent to the planet Glimmera Prime to check for \n plant life to bring back to earth.\n To do this you’ve got to make your way through the planet fields the \nalien inhabitants of Glimmera have cultivated. ', {
    fontSize: '14px',
    fill: '#ffffff'
  });

  this.nextButton = this.add.graphics()
  .fillStyle(0x001325, 1) // blue color
  .fillRect(400, 300, 100, 50); // position and size
  this.nextButton.setInteractive(new Phaser.Geom.Rectangle(400, 300, 100, 50), Phaser.Geom.Rectangle.Contains);
  this.buttonText = this.add.text(450, 320, 'Next', {
  fontSize: '20px',
  fill: '#fff'})
  .setOrigin(0.5, 0.5);
  this.nextButton.on('pointerdown', function (pointer) {
  this.scene.start('InstructionScene'); // 
}, this);
}
  
}

