export default class Grid {
    constructor(scene, rows, cols, cellSize, startRange = 2, endRange = 2, enableBlocking = true, blockedType = 'group', numberOfBlockedSquares = 5, margin = 10, values = []) {
        this.scene = scene;
        this.rows = rows;
        this.cols = cols;
        this.cellSize = cellSize;
        this.startRange = startRange;
        this.endRange = endRange;
        this.enableBlocking = enableBlocking;
        this.blockedType = blockedType;
        this.numberOfBlockedSquares = numberOfBlockedSquares;
        this.margin = margin;
        this.values = values;  // Store the values from the JSON

        // Randomly assign start and end positions in different corners of the grid
        this.assignRandomStartEndPositions();

        // Generate blocked squares based on the specified type
        this.blockedCells = this.enableBlocking ? this.generateBlockedSquares() : [];

        // Calculate the grid's position so that it's not cut off
        const { x, y } = this.calculateGridPosition();
        this.x = x;
        this.y = y;

        this.gridGroup = this.scene.add.group();  // Group to hold all grid cells

        this.createGrid();
    }

    assignRandomStartEndPositions() {
        const corners = [
            { row: 0, col: 0 },                             // Top-left corner
            { row: 0, col: this.cols - 1 },                 // Top-right corner
            { row: this.rows - 1, col: 0 },                 // Bottom-left corner
            { row: this.rows - 1, col: this.cols - 1 }      // Bottom-right corner
        ];

        // Randomly select different corners for start and end positions
        const startCornerIndex = Phaser.Math.Between(0, corners.length - 1);
        let endCornerIndex;
        do {
            endCornerIndex = Phaser.Math.Between(0, corners.length - 1);
        } while (endCornerIndex === startCornerIndex);

        this.start = this.getRandomPosition(corners[startCornerIndex].row, corners[startCornerIndex].col, this.startRange);
        this.end = this.getRandomPosition(corners[endCornerIndex].row, corners[endCornerIndex].col, this.endRange);
    }

    getRandomPosition(baseRow, baseCol, range) {
        const row = Phaser.Math.Clamp(baseRow + Phaser.Math.Between(-range, range), 0, this.rows - 1);
        const col = Phaser.Math.Clamp(baseCol + Phaser.Math.Between(-range, range), 0, this.cols - 1);
        return { row, col };
    }

    generateBlockedSquares() {
        const blockedCells = [];
        const availableCells = [];
    
        // Populate available cells (excluding start and end positions)
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                if (!(row === this.start.row && col === this.start.col) && !(row === this.end.row && col === this.end.col)) {
                    availableCells.push({ row, col });
                }
            }
        }
    
        if (this.blockedType === 'line') {
            const lineDirections = [
                { dRow: 0, dCol: 1 },  // Horizontal
                { dRow: 1, dCol: 0 },  // Vertical
                { dRow: 1, dCol: 1 },  // Diagonal down-right
                { dRow: 1, dCol: -1 }  // Diagonal down-left
            ];
    
            const startCell = Phaser.Utils.Array.RemoveRandomElement(availableCells);
            blockedCells.push(startCell);
    
            const direction = Phaser.Utils.Array.GetRandom(lineDirections);
    
            // Extend in the chosen direction
            for (let i = 1; i < this.numberOfBlockedSquares; i++) {
                const newRow = startCell.row + i * direction.dRow;
                const newCol = startCell.col + i * direction.dCol;
    
                if (newRow >= 0 && newRow < this.rows && newCol >= 0 && newCol < this.cols) {
                    const nextCell = { row: newRow, col: newCol };
                    if (!blockedCells.some(cell => cell.row === nextCell.row && cell.col === nextCell.col)) {
                        blockedCells.push(nextCell);
                    }
                } else {
                    break;  // Stop if we hit the boundary
                }
            }
    
            // Reverse direction to extend if necessary
            for (let i = 1; blockedCells.length < this.numberOfBlockedSquares; i++) {
                const reverseRow = startCell.row - i * direction.dRow;
                const reverseCol = startCell.col - i * direction.dCol;
    
                if (reverseRow >= 0 && reverseRow < this.rows && reverseCol >= 0 && reverseCol < this.cols) {
                    const reverseCell = { row: reverseRow, col: reverseCol };
                    if (!blockedCells.some(cell => cell.row === reverseCell.row && cell.col === reverseCell.col)) {
                        blockedCells.push(reverseCell);
                    }
                } else {
                    break;  // Stop if we hit the boundary in the reverse direction
                }
            }
    
            // If still not enough, try filling with random cells
            while (blockedCells.length < this.numberOfBlockedSquares && availableCells.length > 0) {
                const randomCell = Phaser.Utils.Array.RemoveRandomElement(availableCells);
                blockedCells.push(randomCell);
            }
    
        } else if (this.blockedType === 'group') {
            const startCell = Phaser.Utils.Array.RemoveRandomElement(availableCells);
            blockedCells.push(startCell);
    
            for (let i = 1; i < this.numberOfBlockedSquares; i++) {
                let nextCell;
                let attempts = 0;
    
                do {
                    const nextRow = Phaser.Math.Clamp(startCell.row + Phaser.Math.Between(-1, 1), 0, this.rows - 1);
                    const nextCol = Phaser.Math.Clamp(startCell.col + Phaser.Math.Between(-1, 1), 0, this.cols - 1);
                    nextCell = { row: nextRow, col: nextCol };
                    attempts++;
                } while (
                    attempts < 10 &&
                    (blockedCells.some(cell => cell.row === nextCell.row && cell.col === nextCell.col) || 
                    nextCell.row === this.start.row && nextCell.col === this.start.col ||
                    nextCell.row === this.end.row && nextCell.col === this.end.col)
                );
    
                if (!blockedCells.some(cell => cell.row === nextCell.row && cell.col === nextCell.col)) {
                    blockedCells.push(nextCell);
                }
            }
        } else {
            // Default: random blocked cells
            for (let i = 0; i < this.numberOfBlockedSquares; i++) {
                const cell = Phaser.Utils.Array.RemoveRandomElement(availableCells);
                blockedCells.push(cell);
            }
        }
    
        return blockedCells;
    }
    
    
    

    calculateGridPosition() {
        const gridWidth = this.cols * this.cellSize;
        const gridHeight = this.rows * this.cellSize;

        // Center the grid within the game window with the specified margin
        const x = (this.scene.sys.game.config.width - gridWidth) / 2;
        const y = (this.scene.sys.game.config.height - gridHeight) / 2;

        // Ensure there's a margin from the edges of the window
        return {
            x: Math.max(this.margin, x),
            y: Math.max(this.margin, y)
        };
    }

    createGrid() {
    for (let row = 0; row < this.rows; row++) {
        for (let col = 0; col < this.cols; col++) {
            const cellX = this.x + col * this.cellSize;
            const cellY = this.y + row * this.cellSize;

            // Determine cell type
            const isBlocked = this.blockedCells.some(blocked => blocked.row === row && blocked.col === col);
            const isStart = this.start.row === row && this.start.col === col;
            const isEnd = this.end.row === row && this.end.col === col;

            let cellColor;
            if (isStart) {
                cellColor = 0xFFFF00; // Yellow for start
            } else if (isEnd) {
                cellColor = 0xFF0000; // Red for end
            } else if (isBlocked) {
                cellColor = 0x555555; // Grey for blocked
            } else {
                cellColor = 0xFFFFFF; // White for regular cells
            }

            const cell = this.scene.add.rectangle(cellX, cellY, this.cellSize, this.cellSize, cellColor)
                .setOrigin(0)
                .setStrokeStyle(1, 0x000000);

            // Store the hidden value from the values array
            const value = this.values[row * this.cols + col]; 
            cell.setData({ row, col, value });

            this.gridGroup.add(cell);
        }
    }
}


    // Method to check if a specific cell is blocked
     isBlocked(row, col) {
        return this.blockedCells.some(blocked => blocked.row === row && blocked.col === col);
    }

    // Method to clear the grid if needed
    clearGrid() {
        this.gridGroup.clear(true, true);
    }

    // Method to update the grid dynamically
    updateGrid(rows, cols, startRange, endRange, enableBlocking, blockedType, numberOfBlockedSquares) {
        this.rows = rows;
        this.cols = cols;
        this.startRange = startRange;
        this.endRange = endRange;
        this.enableBlocking = enableBlocking;
        this.blockedType = blockedType;
        this.numberOfBlockedSquares = numberOfBlockedSquares;

        // Randomly reassign start and end positions
        this.start = this.getRandomPosition(0, 0, this.startRange);
        this.end = this.getRandomPosition(this.rows - 1, this.cols - 1, this.endRange);

        // Generate blocked squares if blocking is enabled
        this.blockedCells = this.enableBlocking ? this.generateBlockedSquares() : [];

        // Recalculate the grid position based on the new size
        const { x, y } = this.calculateGridPosition();
        this.x = x;
        this.y = y;

        this.clearGrid();
        this.createGrid();


    }

    getCellValue(row, col) {
        const index = row * this.cols + col;
        return this.values[index];
    }
    
}
