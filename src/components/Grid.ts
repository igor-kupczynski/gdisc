export class Grid {
    private data: string[][] = this.getInitialData();
    private readonly storageKey = 'gDiscGridData';
    private gameStartTime: Date = new Date();
    private title: string = 'GDisc: Keep score of your disc golf games';

    constructor() {
        const storedData = this.loadFromStorage();
        if (storedData && Array.isArray(storedData.data) && storedData.data.length > 0) {
            this.data = storedData.data;
            this.gameStartTime = new Date(storedData.startTime);
            this.title = storedData.title || this.title;
        } else {
            this.initializeNewGame();
        }
    }

    private initializeNewGame(): void {
        this.data = this.getInitialData();
        this.gameStartTime = new Date();
        this.saveToStorage();
    }

    private getInitialData(): string[][] {
        return [
            ['Name', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'Total'],
            ['Player #1', '', '', '', '', '', '', '', '', '', '0'],
            ['Player #2', '', '', '', '', '', '', '', '', '', '0'],
            ['Player #3', '', '', '', '', '', '', '', '', '', '0'],
            ['Player #4', '', '', '', '', '', '', '', '', '', '0']
        ];
    }

    public render(containerId: string): void {
        const container = document.getElementById(containerId);
        if (!container) return;

        container.innerHTML = ''; // Clear previous content

        const table = document.createElement('table');
        table.className = 'editable-grid';

        const headerRow = document.createElement('tr');
        this.data[0].forEach((cell) => {
            const th = document.createElement('th');
            th.textContent = cell;
            headerRow.appendChild(th);
        });
        table.appendChild(headerRow);

        for (let rowIndex = 1; rowIndex < this.data.length; rowIndex++) {
            const row = this.data[rowIndex];
            const tr = document.createElement('tr');
            row.forEach((cell, cellIndex) => {
                const td = document.createElement('td');
                if (cellIndex === 0) {
                    td.className = 'name-cell';
                } else if (cellIndex === row.length - 1) {
                    td.className = 'total-cell';
                } else {
                    td.className = 'score-cell';
                }

                const input = document.createElement('input');
                input.type = cellIndex === 0 ? 'text' : 'number';
                input.value = cell;
                input.readOnly = cellIndex === row.length - 1;
                
                if (cellIndex === 0) {
                    input.addEventListener('input', (e) => this.updateName(rowIndex, (e.target as HTMLInputElement).value));
                } else if (cellIndex < row.length - 1) {
                    input.min = '0';
                    input.addEventListener('input', (e) => this.updateCell(rowIndex, cellIndex, (e.target as HTMLInputElement).value));
                }

                td.appendChild(input);
                tr.appendChild(td);
            });
            table.appendChild(tr);
        }

        container.appendChild(table);

        const startTimeDiv = document.createElement('div');
        startTimeDiv.id = 'game-start-time';
        startTimeDiv.textContent = `Game started: ${this.formatDate(this.gameStartTime)}`;
        container.appendChild(startTimeDiv);
    }

    private formatDate(date: Date): string {
        return date.toLocaleString();
    }

    private updateName(rowIndex: number, value: string): void {
        this.data[rowIndex][0] = value;
        this.saveToStorage();
    }

    private updateCell(rowIndex: number, cellIndex: number, value: string): void {
        this.data[rowIndex][cellIndex] = value;
        this.updateTotal(rowIndex);
        this.saveToStorage();
    }

    private updateTotal(rowIndex: number): void {
        const row = this.data[rowIndex];
        let total = 0;
        for (let i = 1; i < row.length - 1; i++) {
            const value = parseFloat(row[i]);
            if (!isNaN(value)) {
                total += value;
            }
        }
        this.data[rowIndex][row.length - 1] = total.toString();
        const totalCell = document.querySelector(`.editable-grid tr:nth-child(${rowIndex + 1}) td:last-child input`);
        if (totalCell) {
            (totalCell as HTMLInputElement).value = total.toString();
        }
    }

    private saveToStorage(): void {
        localStorage.setItem(this.storageKey, JSON.stringify({
            data: this.data,
            startTime: this.gameStartTime.toISOString(),
            title: this.title
        }));
    }

    private loadFromStorage(): { data: string[][], startTime: string, title: string } | null {
        const storedData = localStorage.getItem(this.storageKey);
        return storedData ? JSON.parse(storedData) : null;
    }

    public reset(): void {
        this.initializeNewGame();
    }

    public startNewGame(): void {
        const playerNames = this.data.slice(1).map(row => row[0]);
        this.data = this.getInitialData();
        for (let i = 0; i < playerNames.length; i++) {
            this.data[i + 1][0] = playerNames[i];
        }
        this.gameStartTime = new Date();
        this.saveToStorage();
    }

    public getTitle(): string {
        return this.title;
    }

    public updateTitle(newTitle: string): void {
        this.title = newTitle;
        this.saveToStorage();
    }
}