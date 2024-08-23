export class Grid {
    private data: string[][];
    private readonly storageKey = 'gDiscGridData';

    constructor() {
        this.data = this.loadFromStorage() || this.getInitialData();
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

        this.data.forEach((row, rowIndex) => {
            const tr = document.createElement('tr');
            row.forEach((cell, cellIndex) => {
                const td = document.createElement('td');
                if (rowIndex === 0 || cellIndex === row.length - 1) {
                    td.textContent = cell;
                    td.className = 'header-cell';
                } else if (cellIndex === 0) {
                    const input = document.createElement('input');
                    input.type = 'text';
                    input.value = cell;
                    input.addEventListener('input', (e) => this.updateName(rowIndex, (e.target as HTMLInputElement).value));
                    td.appendChild(input);
                } else {
                    const input = document.createElement('input');
                    input.type = 'number';
                    input.min = '0';
                    input.value = cell;
                    input.addEventListener('input', (e) => this.updateCell(rowIndex, cellIndex, (e.target as HTMLInputElement).value));
                    td.appendChild(input);
                }
                tr.appendChild(td);
            });
            table.appendChild(tr);
        });

        container.appendChild(table);
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
        const totalCell = document.querySelector(`.editable-grid tr:nth-child(${rowIndex + 1}) td:last-child`);
        if (totalCell) {
            totalCell.textContent = total.toString();
        }
    }

    private saveToStorage(): void {
        localStorage.setItem(this.storageKey, JSON.stringify(this.data));
    }

    private loadFromStorage(): string[][] | null {
        const storedData = localStorage.getItem(this.storageKey);
        return storedData ? JSON.parse(storedData) : null;
    }

    public reset(): void {
        this.data = this.getInitialData();
        this.saveToStorage();
    }
}
