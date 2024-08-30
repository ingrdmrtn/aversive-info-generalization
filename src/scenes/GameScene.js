import GameManager from '../classes/GameManager.js';
import taskSettings from '../config/taskSettings.js';
import ui from '../classes/ui.js';

class GameScene extends Phaser.Scene {
    constructor() {
        super('GameScene');
        this.gameOver = false;  // Initialize the gameOver flag
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

        this.ui = new ui(this);
        this.ui.createProgressBar(20, 20, 200, 20, 200);  // Initialize the progress bar

        this.initializeTrial(rows, cols, cellSize, startPositionRange, endPositionRange, enableBlocking, blockedType, numberOfBlockedSquares, inputMode, values);

        if (inputMode === 'keyboard') {
            this.input.keyboard.on('keydown-LEFT', () => {
                if (!this.gameOver) {
                    this.gameManager.moveSub('left');
                    this.handleProgress();
                }
            });
            this.input.keyboard.on('keydown-RIGHT', () => {
                if (!this.gameOver) {
                    this.gameManager.moveSub('right');
                    this.handleProgress();
                }
            });
            this.input.keyboard.on('keydown-UP', () => {
                if (!this.gameOver) {
                    this.gameManager.moveSub('up');
                    this.handleProgress();
                }
            });
            this.input.keyboard.on('keydown-DOWN', () => {
                if (!this.gameOver) {
                    this.gameManager.moveSub('down');
                    this.handleProgress();
                }
            });
        }
    }

    initializeTrial(rows, cols, cellSize, startPositionRange, endPositionRange, enableBlocking, blockedType, numberOfBlockedSquares, inputMode, values) {
        this.resetProgressBar();  // Reset the progress bar and gameOver flag
        this.gameManager = new GameManager(
            this, rows, cols, cellSize, startPositionRange, endPositionRange, enableBlocking, blockedType, numberOfBlockedSquares, inputMode, values
        );
    }

    resetProgressBar() {
        this.ui.remainingFuel = 200;  // Reset fuel level to the initial value
        this.ui.fuelBar.clear();  // Clear the current bar
        this.ui.fuelBar.fillStyle(0x00ff00, 1);  // Refill the bar with the initial color and dimensions
        this.ui.fuelBar.fillRect(20, 20, this.ui.fuelBar.maxWidth, 20);  // Reset the bar to full width
        this.gameOver = false;  // Reset the gameOver flag when a new trial starts
    }

    handleProgress() {
        const fuelRemaining = this.ui.updateProgressBar(10);
        if (!fuelRemaining) {
            this.handleOutOfFuel();  // Handle game over when fuel is depleted
        }
    }

    handleOutOfFuel() {
        console.log("Out of fuel! Game over.");
        this.gameOver = true;  // Set the gameOver flag to true when the fuel runs out
        
        // Display "Trial Over" message
        const trialOverText = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY, 'Ran out of Fuel! Press R to move on', {
            fontSize: '30px',
            color: '#ff0000',
            fontFamily: 'Arial',
            fontStyle: 'bold'
        }).setOrigin(0.5);


        // Listen for the "R" key to restart the trial
        this.input.keyboard.on('keydown-R', () => {
            this.scene.restart();  // Restart the GameScene
        });
    }

    handleTrialSuccess() {
        console.log("You reached the end! Starting new trial...");
        this.startNewTrial();
    }

    startNewTrial() {
        const { rows, cols, cellSize, startPositionRange, endPositionRange, enableBlocking, blockedType, numberOfBlockedSquares } = taskSettings.grid;
        const inputMode = taskSettings.inputMode;
        const values = this.cache.json.get('gridValues').values;

        this.initializeTrial(rows, cols, cellSize, startPositionRange, endPositionRange, enableBlocking, blockedType, numberOfBlockedSquares, inputMode, values);
    }
}

export default GameScene;
