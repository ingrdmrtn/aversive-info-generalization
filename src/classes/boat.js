export default class Sub {
    constructor(scene, x, y, cellSize) {
        this.scene = scene;
        this.cellSize = cellSize;

        // Create the submarine sprite using the loaded image
        this.sprite = this.scene.add.sprite(x, y, 'Sub');

        // Calculate submarine size as 80% of the grid cell size
        const subSize = this.cellSize * 0.8;

        // Set the display size of the sprite
        this.sprite.setDisplaySize(subSize, subSize);

        // Set the origin of the sprite to its center
        this.sprite.setOrigin(0.5);

        // Center the submarine within the grid square
        this.centerSub(x, y);
    }

    // Method to center the submarine in the grid square
    centerSub(x, y) {
        const centerX = x + this.cellSize / 2;
        const centerY = y + this.cellSize / 2;
        this.sprite.setPosition(centerX, centerY);
    }

    // Optional: Method to destroy the submarine if needed
    destroy() {
        this.sprite.destroy();
    }
}
