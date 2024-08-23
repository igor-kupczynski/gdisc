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
                <h1>Welcome to GDisc</h1>
                <div id="grid-container"></div>
            `;
            this.grid.render('grid-container');
        }
    }
}
