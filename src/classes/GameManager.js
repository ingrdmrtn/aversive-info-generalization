import Grid from './Grid.js';
import Sub from './boat.js';
import taskSettings from '../config/taskSettings.js';


export default class GameManager {
    constructor(scene, rows, cols, cellSize, startPositionRange, endPositionRange, enableBlocking, blockedType, numberOfBlockedSquares, inputMode, values) {
        this.scene = scene;
        this.cellSize = cellSize;
        this.inputMode = inputMode;

        this.rows = rows;
        this.cols = cols;
        this.startPositionRange = startPositionRange;
        this.endPositionRange = endPositionRange;
        this.enableBlocking = enableBlocking;
        this.blockedType = blockedType;
        this.numberOfBlockedSquares = numberOfBlockedSquares;
        this.values = values;  // Store the values array

        this.revealSettings = taskSettings.revealValues; // Store the reveal settings

        this.initializeTrial();
    }

    initializeTrial() {
        this.Grid = new Grid(
            this.scene, 
            this.rows, 
            this.cols, 
            this.cellSize, 
            this.startPositionRange, 
            this.endPositionRange, 
            this.enableBlocking, 
            this.blockedType, 
            this.numberOfBlockedSquares, 
            10, 
            this.values  // Pass values to the Grid
        );

        const startX = this.Grid.x + this.Grid.start.col * this.cellSize;
        const startY = this.Grid.y + this.Grid.start.row * this.cellSize;

        if (this.Sub) {
            this.Sub.destroy();
        }
        this.Sub = new Sub(this.scene, startX, startY, this.cellSize);

        // Reveal values based on the task settings
        if (this.revealSettings.enabled) {
            if (this.revealSettings.revealType === 'cluster') {
                this.revealCluster();
            } else if (this.revealSettings.revealType === 'random') {
                this.revealRandomValues(this.revealSettings.numberOfReveals);
            }
        }

        if (this.inputMode === 'click') {
            this.enableClickMovement();
        }
    }

    revealCluster() {
        // Choose a random starting point for the cluster
        const startRow = Phaser.Math.Between(0, this.rows - 1);
        const startCol = Phaser.Math.Between(0, this.cols - 1);

        // Reveal a small cluster of cells around the starting point
        for (let rowOffset = -1; rowOffset <= 1; rowOffset++) {
            for (let colOffset = -1; colOffset <= 1; colOffset++) {
                const row = Phaser.Math.Clamp(startRow + rowOffset, 0, this.rows - 1);
                const col = Phaser.Math.Clamp(startCol + colOffset, 0, this.cols - 1);
                this.revealValue(row, col);
            }
        }
    }

    revealRandomValues(numberOfReveals) {
        const revealed = [];

        while (revealed.length < numberOfReveals) {
            const row = Phaser.Math.Between(0, this.rows - 1);
            const col = Phaser.Math.Between(0, this.cols - 1);

            if (!revealed.some(cell => cell.row === row && cell.col === col)) {
                this.revealValue(row, col);
                revealed.push({ row, col });
            }
        }
    }

    revealValue(row, col) {
        const value = this.Grid.getCellValue(row, col);
        console.log(`Revealing value at (${row}, ${col}): ${value}`);
    
        // Optionally, visually represent the revealed value on the grid
        const cell = this.Grid.gridGroup.getChildren().find(cell => cell.getData('row') === row && cell.getData('col') === col);
        if (cell && value !== undefined) {
            const textStyle = {
                fontSize: '18px',          // Set the font size
                fontFamily: 'Arial',       // Set the font family
                color: '#ffffff',          // Set the text color
                align: 'center',           // Align the text to the center
                fontStyle: 'bold',         // Make the text bold
                stroke: '#000000',         // Add a stroke to the text
                strokeThickness: 3,        // Set the stroke thickness
                padding: {                 // Add padding around the text
                    x: 10,
                    y: 5
                }
                // No backgroundColor property here
            };
    
            const text = this.scene.add.text(cell.x + this.cellSize / 2, cell.y + this.cellSize / 2, value, textStyle)
                .setOrigin(0.5);  // Center the text within the cell
    
            // Store the text object on the cell for later removal if needed
            cell.setData('revealedText', text);
        }
    }
    
    

    canMoveTo(newX, newY) {
        const targetCol = Math.floor((newX - this.Grid.x) / this.cellSize);
        const targetRow = Math.floor((newY - this.Grid.y) / this.cellSize);

        return (
            targetRow >= 0 && targetRow < this.Grid.rows &&
            targetCol >= 0 && targetCol < this.Grid.cols &&
            !this.Grid.isBlocked(targetRow, targetCol)
        );
    }

    checkCollisionWithEnd(newX, newY) {
        const targetCol = Math.floor((newX - this.Grid.x) / this.cellSize);
        const targetRow = Math.floor((newY - this.Grid.y) / this.cellSize);

        return (
            targetRow === this.Grid.end.row &&
            targetCol === this.Grid.end.col
        );
    }

    // Inside your GameManager class...

moveSub(direction) {
    let newX = this.Sub.sprite.x;
    let newY = this.Sub.sprite.y;

    switch (direction) {
        case 'left':
            newX -= this.cellSize;
            break;
        case 'right':
            newX += this.cellSize;
            break;
        case 'up':
            newY -= this.cellSize;
            break;
        case 'down':
            newY += this.cellSize;
            break;
    }

    if (this.canMoveTo(newX - this.cellSize / 2, newY - this.cellSize / 2)) {
        this.Sub.centerSub(newX - this.cellSize / 2, newY - this.cellSize / 2);

        const row = Math.floor((newY - this.Grid.y) / this.cellSize);
        const col = Math.floor((newX - this.Grid.x) / this.cellSize);
        const value = this.Grid.getCellValue(row, col);
        console.log(`Sub moved to cell (${row}, ${col}) with hidden value: ${value}`);

        if (this.checkCollisionWithEnd(newX - this.cellSize / 2, newY - this.cellSize / 2)) {
            this.scene.handleTrialSuccess();  // Call the trial success handler
        }
    }
}

    

    enableClickMovement() {
        this.Grid.gridGroup.getChildren().forEach(cell => {
            cell.setInteractive().on('pointerdown', () => {
                const targetX = cell.x;
                const targetY = cell.y;

                if (this.canMoveTo(targetX, targetY)) {
                    this.Sub.centerSub(targetX, targetY);

                    if (this.checkCollisionWithEnd(targetX, targetY)) {
                        this.startNewTrial();
                    }
                }
            });
        });
    }

    startNewTrial() {
        console.log("Sub reached the end! Starting a new trial...");
        this.initializeTrial();  // Reset the grid and sub for a new trial
    }
}
