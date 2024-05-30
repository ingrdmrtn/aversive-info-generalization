class InstructionScene extends Phaser.Scene {
    constructor() {
        super("InstructionScene");
    }
    preload() {
        this.load.image('soilPatch', 'assets/glimSoil.png');
        this.load.image('popupImage', 'assets/blankReport.png'); // Load your pop-up image
    }
    

    
    create() {
        const startX = 20; // Starting X position of the grid
        const startY = 20; // Starting Y position of the grid
        const rows = 10;
        const cols = 5;
        const spacing = 0; // Adjust as needed
        const spriteScale = 0.06; // Sprites will be half their original size
    
        const spriteWidth = this.textures.get('soilPatch').get(0).width * spriteScale;
        const spriteHeight = this.textures.get('soilPatch').get(0).height * spriteScale;

        
    
        for (let y = 0; y < rows; y++) {
            for (let x = 0; x < cols; x++) {
                let posX = startX + (x * (spriteWidth + spacing)) + spriteWidth / 2;
                let posY = startY + (y * (spriteHeight + spacing)) + spriteHeight / 2;
    
                let sprite = this.add.sprite(posX, posY, 'soilPatch').setInteractive();
                sprite.setScale(spriteScale);
                // Scale factor for pop out effect
                const scaleFactor = 0.07;
                
                // Add pointerover event
                sprite.on('pointerover', function () {
                    this.scene.tweens.add({
                        targets: this,
                        scaleX: scaleFactor,
                        scaleY: scaleFactor,
                        duration: 200,
                        ease: 'Power1'
                    });
                });

                sprite.on('pointerout', function () {
                    this.scene.tweens.add({
                        targets: this,
                        scaleX: spriteScale ,
                        scaleY: spriteScale ,
                        duration: 200,
                        ease: 'Power1'
                    });
                });

                // Create the pop-up box, initially not visible
                let popUpBox = this.add.image(350, 350, 'popupImage');
                popUpBox.setVisible(false);
                // Add text to the pop-up box
                let popUpText1 = this.add.text(280, 370, 'predicted crop:', { fontSize: '16px', fill: '#fff' });
                popUpText1.setVisible(false);

                // Create a close button for the pop-up box (just an example, you can use a sprite or graphics)
                let closeButton = this.add.text(320, 470, 'close', { fontSize: '18px', fill: '#fff' }).setInteractive();
                closeButton.setVisible(false);

                // Adjust the size of the pop-up image
                popUpBox.setScale(0.15); // Adjust this value as needed


                let popUpDepth = 100;
                popUpBox.setDepth(popUpDepth);
                popUpText1.setDepth(popUpDepth);
                closeButton.setDepth(popUpDepth);

                // Click event for the sprite
                sprite.on('pointerdown', () => {
                popUpBox.setVisible(true);
                popUpText1.setVisible(true);
                closeButton.setVisible(true);
                });

                // Click event for the close button
                closeButton.on('pointerdown', () => {
                popUpBox.setVisible(false);
                popUpText1.setVisible(false);
                closeButton.setVisible(false);
                });
            }
        }
    }
}
