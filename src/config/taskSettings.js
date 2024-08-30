const taskSettings = {
    grid: {
        rows: 10,
        cols: 10,
        cellSize: 50,
        startPositionRange: 2,
        endPositionRange: 2,
        enableBlocking: true,
        blockedType: 'group',
        numberOfBlockedSquares: 5,
    },
    inputMode: 'keyboard', // Options: 'keyboard' or 'click'
    revealValues: {
        enabled: true, // Whether to reveal some values or not
        revealType: 'cluster', // Options: 'cluster' or 'random'
        numberOfReveals: 4 // Number of values to reveal if 'random' is selected
    }
};

export default taskSettings;
