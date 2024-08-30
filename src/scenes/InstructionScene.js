import ui from '../classes/ui.js';

class InstructionScene extends Phaser.Scene {
    constructor() {
        super('InstructionScene');
    }

    create() {
        // Initialize the ui
        this.ui = new ui(this);

        // Create a button
        this.ui.createButton('nextButton', 400, 300, 100, 50, 'Next', () => {
            this.scene.start('GameScene');
        }, { color: 0x001325 }, { fontSize: '20px', fill: '#ffffff' });

        // Create some instruction text
        this.ui.createText('instructions', 100, 120, 
            'Instructions for the task and attention checks here :)', 
            { fontSize: '14px', fill: '#ffffff' });
    }
}

export default InstructionScene;
