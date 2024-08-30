
class BootScene extends Phaser.Scene {
    constructor() {
        super("BootScene");
    }

    create() {
        // After loading assets or performing setup, start InstructionScene
        this.scene.start('InstructionScene');
    }
}

export default BootScene;

