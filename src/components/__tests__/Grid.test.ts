import { Grid } from '../Grid';

describe('Grid', () => {
    let grid: Grid;

    beforeEach(() => {
        const localStorageMock = (() => {
            let store: { [key: string]: string } = {};
            return {
                getItem: (key: string) => store[key] || null,
                setItem: (key: string, value: string) => store[key] = value,
                clear: () => store = {}
            };
        })();
        Object.defineProperty(window, 'localStorage', { value: localStorageMock });

        grid = new Grid();
    });

    it('should initialize with default data', () => {
        expect(grid['data']).toEqual([
            ['Name', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'Total'],
            ['Player #1', '', '', '', '', '', '', '', '', '', '0'],
            ['Player #2', '', '', '', '', '', '', '', '', '', '0'],
            ['Player #3', '', '', '', '', '', '', '', '', '', '0'],
            ['Player #4', '', '', '', '', '', '', '', '', '', '0']
        ]);
    });

    it('should save and load data from localStorage', () => {
        grid['data'][1][1] = '10';
        grid['saveToStorage']();
        const storedData = JSON.parse(localStorage.getItem(grid['storageKey'])!);
        expect(storedData.data[1][1]).toBe('10');

        const newGrid = new Grid();
        expect(newGrid['data'][1][1]).toBe('10');
    });

    it('should render the grid correctly', () => {
        document.body.innerHTML = '<div id="grid-container"></div>';
        grid.render('grid-container');
        const container = document.getElementById('grid-container');
        expect(container).not.toBeNull();
        expect(container!.querySelectorAll('table.editable-grid').length).toBe(1);
        expect(container!.querySelectorAll('tr').length).toBe(5); // 1 header + 4 rows
    });

    it('should update name correctly', () => {
        grid['updateName'](1, 'New Player');
        expect(grid['data'][1][0]).toBe('New Player');
    });

    it('should update cell and total correctly', () => {
        grid['updateCell'](1, 1, '5');
        expect(grid['data'][1][1]).toBe('5');
        expect(grid['data'][1][10]).toBe('5'); // Total column
    });

    it('should reset the grid', () => {
        grid['data'][1][1] = '10';
        grid.reset();
        expect(grid['data'][1][1]).toBe('');
        expect(grid['data'][1][10]).toBe('0');
    });

    it('should start a new game with the same players', () => {
        grid['data'][1][0] = 'Alice';
        grid['data'][2][0] = 'Bob';
        grid['data'][1][1] = '5';
        grid['data'][2][1] = '4';

        grid.startNewGame();

        expect(grid['data'][1][0]).toBe('Alice');
        expect(grid['data'][2][0]).toBe('Bob');

        expect(grid['data'][1][1]).toBe('');
        expect(grid['data'][2][1]).toBe('');
        expect(grid['data'][1][10]).toBe('0');
        expect(grid['data'][2][10]).toBe('0');

        const newStartTime = new Date(JSON.parse(localStorage.getItem(grid['storageKey'])!).startTime);
        expect(newStartTime.getTime()).toBeGreaterThanOrEqual(grid['gameStartTime'].getTime());
    });

    it('should update localStorage when starting a new game', () => {
        grid['data'][1][0] = 'Alice';
        grid['data'][1][1] = '5';
        grid.startNewGame();

        const storedData = JSON.parse(localStorage.getItem(grid['storageKey'])!);
        expect(storedData.data[1][0]).toBe('Alice');
        expect(storedData.data[1][1]).toBe('');
        expect(storedData.data[1][10]).toBe('0');
    });
});
