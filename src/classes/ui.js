export default class ui {
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
    createProgressBar(x, y, width, height, initialFuel) {
        this.fuelBar = this.scene.add.graphics();
        this.fuelBar.fillStyle(0x00ff00, 1);  // Green color
        this.fuelBar.fillRect(x, y, width, height);  // Position and size
        this.fuelBar.maxWidth = width;  // Store the max width for later use

        this.remainingFuel = initialFuel;  // Initial fuel level
    }

    // New method to update the progress bar
    updateProgressBar(amount) {
        this.remainingFuel -= amount;  // Decrease the fuel by a specified amount
        this.fuelBar.clear();
        this.fuelBar.fillStyle(0x00ff00, 1);

        if (this.remainingFuel <= 0) {
            this.remainingFuel = 0;
            return false;  // Indicate that fuel is depleted
        }

        this.fuelBar.fillRect(20, 20, this.remainingFuel, 20);
        return true;  // Fuel is still available
    }
}
