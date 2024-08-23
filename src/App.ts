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
                <h1>GDisc: Keep score of your disc golf games</h1>
                <div id="grid-container"></div>
                <button id="reset-button">Reset Game</button>
            `;
            this.grid.render('grid-container');
            
            const resetButton = document.getElementById('reset-button');
            if (resetButton) {
                resetButton.addEventListener('click', () => this.confirmReset());
            }
        }
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
}
