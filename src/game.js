import BootScene from './scenes/BootScene.js';
import InstructionScene from './scenes/InstructionScene.js';
import GameScene from './scenes/GameScene.js';


var config = {
    width: 2880,
    height: 1620,
    // mipmapFilter: "LINEAR_MIPMAP_LINEAR",
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        min: {
            width: 960,
            height: 540
        },
        max: {
            width: 1920,
            height: 1080
        },
    },
    resolution: window.devicePixelRatio,
    backgroundColor: "#4d7e9f",
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    scene: [BootScene, InstructionScene, GameScene]
};

var game = new Phaser.Game(config);
