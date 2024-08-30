import BootScene from './scenes/BootScene.js';
import InstructionScene from './scenes/InstructionScene.js';
import GameScene from './scenes/GameScene.js';


var config = {
    width: 960,
    height: 540,
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
