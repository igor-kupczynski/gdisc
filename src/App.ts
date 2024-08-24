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
                <div class="button-container">
                <button id="new-game-button" class="game-button">New Game (Same Players)</button>    
                <button id="reset-button" class="game-button">New Game</button>    
                </div>
            `;
            this.grid.render('grid-container');
            
            const resetButton = document.getElementById('reset-button');
            if (resetButton) {
                resetButton.addEventListener('click', () => this.confirmReset());
            }
            
            const newGameButton = document.getElementById('new-game-button');
            if (newGameButton) {
                newGameButton.addEventListener('click', () => this.confirmNewGame());
            }

            const titleInput = document.getElementById('title-input') as HTMLInputElement;
            if (titleInput) {
                titleInput.addEventListener('input', (e) => this.updateTitle((e.target as HTMLInputElement).value));
            }
        }
    }

    private updateTitle(newTitle: string): void {
        this.grid.updateTitle(newTitle);
    }

    private confirmReset(): void {
        if (confirm('Are you sure you want to reset the game? This action cannot be undone.')) {
            this.resetGame();
        }
    }

    private resetGame(): void {
        this.grid.reset();
        this.grid.render('grid-container');
    }

    private confirmNewGame(): void {
        if (confirm('Are you sure you want to start a new game with the same players? This action cannot be undone.')) {
            this.startNewGame();
        }
    }

    private startNewGame(): void {
        this.grid.startNewGame();
        this.grid.render('grid-container');
    }
}