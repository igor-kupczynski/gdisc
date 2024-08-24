import { Config } from './Config';
import { Grid } from './components/Grid';

export class App {
    private config: Config;
    private grid: Grid;

    constructor() {
        this.config = new Config();
        this.grid = new Grid();
    }

    public start(): void {
        console.log('GDisc application started');
        console.log(`Environment: ${this.config.environment}`);
        
        const appDiv = document.getElementById('app');
        if (appDiv) {
            appDiv.innerHTML = `
                <input id="title-input" type="text" value="${this.grid.getTitle()}" style="width: 100%; font-size: 1.5em; text-align: center; margin-bottom: 10px;">
                <div id="grid-container"></div>
                <div id="time-info-container"></div>
                <div class="button-container">
                <button id="reset-score-button" class="game-button">Reset Score</button>    
                <button id="reset-button" class="game-button">New Game</button>    
                </div>
            `;
            this.grid.render('grid-container');
            this.grid.renderTimeInfo('time-info-container');
            
            const resetButton = document.getElementById('reset-button');
            if (resetButton) {
                resetButton.addEventListener('click', () => this.confirmReset());
            }
            
            const resetScoreButton = document.getElementById('reset-score-button');
            if (resetScoreButton) {
                resetScoreButton.addEventListener('click', () => this.confirmResetScore());
            }

            const titleInput = document.getElementById('title-input') as HTMLInputElement;
            if (titleInput) {
                titleInput.addEventListener('input', (e) => this.updateTitle((e.target as HTMLInputElement).value));
            }
        }
    }

    private updateTitle(newTitle: string): void {
        this.grid.updateTitle(newTitle);
        this.grid.renderTimeInfo('time-info-container');
    }

    private confirmReset(): void {
        if (confirm('Are you sure you want to reset the game? This action cannot be undone.')) {
            this.resetGame();
        }
    }

    private resetGame(): void {
        this.grid.reset();
        this.grid.render('grid-container');
        this.grid.renderTimeInfo('time-info-container');
    }

    private confirmResetScore(): void {
        if (confirm('Are you sure you want to reset the score? This action cannot be undone.')) {
            this.resetScore();
        }
    }

    private resetScore(): void {
        this.grid.resetScore();
        this.grid.render('grid-container');
        this.grid.renderTimeInfo('time-info-container');
    }

    private handleCellUpdate(rowIndex: number, cellIndex: number, value: string): void {
        this.grid.updateCellValue(rowIndex, cellIndex, value);
    }

    private handleNameUpdate(rowIndex: number, value: string): void {
        this.grid.updatePlayerName(rowIndex, value);
    }
}