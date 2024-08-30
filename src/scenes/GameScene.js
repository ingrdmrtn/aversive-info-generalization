import GameManager from '../classes/GameManager.js';
import taskSettings from '../config/taskSettings.js';

class GameScene extends Phaser.Scene {
    constructor() {
        super('GameScene');
    }

    preload() {
        this.load.image('Sub', 'assets/submarine.png');
        this.load.json('gridValues', 'src/grids/example_grid.json');
    }

    create() {
        const values = this.cache.json.get('gridValues').values;
        console.log('Loaded values:', values);
    
        const { rows, cols, cellSize, startPositionRange, endPositionRange, enableBlocking, blockedType, numberOfBlockedSquares } = taskSettings.grid;
        const inputMode = taskSettings.inputMode;
    
        this.gameManager = new GameManager(
            this, rows, cols, cellSize, startPositionRange, endPositionRange, enableBlocking, blockedType, numberOfBlockedSquares, inputMode, values
        );

        if (inputMode === 'keyboard') {
            this.input.keyboard.on('keydown-LEFT', () => {
                this.gameManager.moveSub('left');
            });
            this.input.keyboard.on('keydown-RIGHT', () => {
                this.gameManager.moveSub('right');
            });
            this.input.keyboard.on('keydown-UP', () => {
                this.gameManager.moveSub('up');
            });
            this.input.keyboard.on('keydown-DOWN', () => {
                this.gameManager.moveSub('down');
            });
        }
    }
}

export default GameScene;
