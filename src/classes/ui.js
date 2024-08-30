export default class ui {  // Make sure the class name is UI with uppercase
    constructor(scene) {
        this.scene = scene;
    }

    createButton(key, x, y, width, height, text, callback, buttonStyle = {}, textStyle = {}, hoverStyle = {}, clickStyle = {}) {
        const buttonContainer = this.scene.add.container(x, y);
        const buttonBg = this.scene.add.rectangle(0, 0, width, height, buttonStyle.color || 0x000000, buttonStyle.alpha || 1);
        buttonBg.setInteractive({ useHandCursor: true });
        const buttonText = this.scene.add.text(0, 0, text, { ...textStyle }).setOrigin(0.5);

        buttonContainer.add([buttonBg, buttonText]);

        buttonBg.on('pointerover', () => {
            this.scene.tweens.add({
                targets: buttonBg,
                scaleX: hoverStyle.scaleX || 1.1,
                scaleY: hoverStyle.scaleY || 1.1,
                duration: 200,
                ease: 'Power2'
            });
            buttonBg.setFillStyle(hoverStyle.color || 0x555555);
        });

        buttonBg.on('pointerout', () => {
            this.scene.tweens.add({
                targets: buttonBg,
                scaleX: 1,
                scaleY: 1,
                duration: 200,
                ease: 'Power2'
            });
            buttonBg.setFillStyle(buttonStyle.color || 0x000000);
        });

        buttonBg.on('pointerdown', () => {
            buttonBg.setFillStyle(clickStyle.color || 0xaaaaaa);
            this.scene.tweens.add({
                targets: buttonContainer,
                scaleX: 0.9,
                scaleY: 0.9,
                duration: 100,
                ease: 'Power2',
                yoyo: true,  // Make the button bounce back
                onComplete: callback // Trigger the callback function
            });
        });

        return buttonContainer;
    }

    createText(key, x, y, text, textStyle = {}) {
        const uiText = this.scene.add.text(x, y, text, { ...textStyle });
        return uiText;
    }

    // New method to create a progress bar
    createProgressBar() {
        this.fuelBar = this.scene.add.graphics();  // Use this.scene.add instead of this.add
        this.fuelBar.fillStyle(0x00ff00, 1);  // Green color for the fuel bar
        this.fuelBar.fillRect(20, 20, 200, 20);  // Initial position and size of the fuel bar
        this.fuelBar.maxWidth = 200;  // Store the max width for later use
    
        this.remainingFuel = 200;  // Initial fuel level
    
        // Step 1: Add the text object for displaying the fuel percentage
        this.fuelText = this.scene.add.text(
            20 + 200 / 2, // Horizontally center the text within the first part of the bar
            20 + 20 / 2, // Vertically center the text within the bar
            '100%', {
                fontSize: '16px',
                fill: '#ffffff',  // White text color
                stroke: '#000000',  // Black outline
                strokeThickness: 3,  // Thickness of the outline
                fontFamily: 'Arial',
            }
        ).setOrigin(0.5);
    }
    
    

    // New method to update the progress bar
    updateProgressBar(amount) {
        this.remainingFuel -= amount;  // Decrease the fuel by a specified amount
        this.fuelBar.clear();
        this.fuelBar.fillStyle(0x00ff00, 1);
    
        if (this.remainingFuel <= 0) {
            this.remainingFuel = 0;
            this.fuelText.setText('0%');
            return false;  // Indicate that fuel is depleted
        }
    
        const fuelPercent = (this.remainingFuel / this.fuelBar.maxWidth) * 100;  // Calculate the fuel percentage
        this.fuelText.setText(`${Math.round(fuelPercent)}%`);  // Step 2: Update the text
    
        this.fuelBar.fillRect(20, 20, this.remainingFuel, 20);  // Update the fuel bar width
        return true;  // Fuel is still available
    }    
}
