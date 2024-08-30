export default class ui {
    constructor(scene) {
        this.scene = scene;
    }

    createButton(key, x, y, width, height, text, callback, buttonStyle = {}, textStyle = {}, hoverStyle = {}, clickStyle = {}) {
        // Create a container for the button
        const buttonContainer = this.scene.add.container(x, y);

        // Create the button background
        const buttonBg = this.scene.add.rectangle(0, 0, width, height, buttonStyle.color || 0x000000, buttonStyle.alpha || 1);
        buttonBg.setInteractive({ useHandCursor: true });

        // Create the button text
        const buttonText = this.scene.add.text(0, 0, text, { ...textStyle }).setOrigin(0.5);

        // Add background and text to the container
        buttonContainer.add([buttonBg, buttonText]);

        // Add hover effect
        buttonBg.on('pointerover', () => {
            this.scene.tweens.add({
                targets: buttonBg,
                scaleX: hoverStyle.scaleX || 1.1,
                scaleY: hoverStyle.scaleY || 1.1,
                duration: 200,
                ease: 'Power2'
            });
            buttonBg.setFillStyle(hoverStyle.color || 0x555555);
            // Add sound or other effects here if needed
        });

        // Remove hover effect
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

        // Add click effect
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

        // Optionally, return the container if you want to manipulate it later
        return buttonContainer;
    }

    createText(key, x, y, text, textStyle = {}) {
        // Create and return the text object
        const uiText = this.scene.add.text(x, y, text, { ...textStyle });
        return uiText;
    }
}
