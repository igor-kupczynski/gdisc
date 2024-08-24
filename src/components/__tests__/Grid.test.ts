import { Grid } from '../Grid';

describe('Grid', () => {
    let grid: Grid;
    let mockLocalStorage: { [key: string]: string };

    beforeEach(() => {
        mockLocalStorage = {};
        Object.defineProperty(window, 'localStorage', {
            value: {
                getItem: jest.fn((key) => mockLocalStorage[key]),
                setItem: jest.fn((key, value) => {
                    mockLocalStorage[key] = value.toString();
                }),
            },
            writable: true
        });
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
        grid.updateTitle('Custom Title');
        grid.startNewGame();

        const storedData = JSON.parse(localStorage.getItem(grid['storageKey'])!);
        expect(storedData.data[1][0]).toBe('Alice');
        expect(storedData.data[1][1]).toBe('');
        expect(storedData.data[1][10]).toBe('0');
        expect(storedData.title).toBe('Custom Title');
    });

    test('should initialize with default title', () => {
        expect(grid.getTitle()).toBe('GDisc: Keep score of your disc golf games');
    });

    test('should update title', () => {
        const newTitle = 'My Disc Golf Game';
        grid.updateTitle(newTitle);
        expect(grid.getTitle()).toBe(newTitle);
    });

    test('should save title to localStorage', () => {
        const newTitle = 'Saved Game Title';
        grid.updateTitle(newTitle);
        const savedData = JSON.parse(mockLocalStorage['gDiscGridData']);
        expect(savedData.title).toBe(newTitle);
    });

    test('should load title from localStorage', () => {
        const savedTitle = 'Loaded Game Title';
        mockLocalStorage['gDiscGridData'] = JSON.stringify({
            data: grid['data'],
            startTime: new Date().toISOString(),
            title: savedTitle
        });
        const newGrid = new Grid();
        expect(newGrid.getTitle()).toBe(savedTitle);
    });

    test('should use default title if not present in localStorage', () => {
        mockLocalStorage['gDiscGridData'] = JSON.stringify({
            data: grid['data'],
            startTime: new Date().toISOString()
        });
        const newGrid = new Grid();
        expect(newGrid.getTitle()).toBe('GDisc: Keep score of your disc golf games');
    });

    test('should initialize gameLastUpdatedTime', () => {
        expect(grid.getLastUpdatedTime()).toBeInstanceOf(Date);
    });

    test('should update gameLastUpdatedTime when updating cell', () => {
        const initialTime = grid.getLastUpdatedTime();
        jest.advanceTimersByTime(1000); // Advance time by 1 second
        grid['updateCell'](1, 1, '3');
        expect(grid.getLastUpdatedTime().getTime()).toBeGreaterThan(initialTime.getTime());
    });

    test('should update gameLastUpdatedTime when updating name', () => {
        const initialTime = grid.getLastUpdatedTime();
        jest.advanceTimersByTime(1000); // Advance time by 1 second
        grid['updateName'](1, 'New Player');
        expect(grid.getLastUpdatedTime().getTime()).toBeGreaterThan(initialTime.getTime());
    });

    test('should update gameLastUpdatedTime when updating title', () => {
        const initialTime = grid.getLastUpdatedTime();
        jest.advanceTimersByTime(1000); // Advance time by 1 second
        grid.updateTitle('New Title');
        expect(grid.getLastUpdatedTime().getTime()).toBeGreaterThan(initialTime.getTime());
    });

    test('should save gameLastUpdatedTime to localStorage', () => {
        grid['updateCell'](1, 1, '3');
        const savedData = JSON.parse(mockLocalStorage['gDiscGridData']);
        expect(savedData.lastUpdatedTime).toBeDefined();
    });

    test('should load gameLastUpdatedTime from localStorage', () => {
        const savedLastUpdatedTime = new Date();
        mockLocalStorage['gDiscGridData'] = JSON.stringify({
            data: grid['data'],
            startTime: new Date().toISOString(),
            lastUpdatedTime: savedLastUpdatedTime.toISOString(),
            title: 'Test Title'
        });
        const newGrid = new Grid();
        expect(newGrid.getLastUpdatedTime().getTime()).toBe(savedLastUpdatedTime.getTime());
    });

    test('should reset title when starting a new game', () => {
        const customTitle = 'Custom Game Title';
        grid.updateTitle(customTitle);
        expect(grid.getTitle()).toBe(customTitle);

        grid.reset();
        expect(grid.getTitle()).toBe('GDisc: Keep score of your disc golf games');
    });
});