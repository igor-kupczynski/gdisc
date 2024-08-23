import { Config } from './Config';
import { ExampleComponent } from './components/ExampleComponent';

export class App {
    private config: Config;
    private exampleComponent: ExampleComponent;

    constructor() {
        this.config = new Config();
        this.exampleComponent = new ExampleComponent('User');
    }

    public start(): void {
        console.log('GDisc application started');
        console.log(`Environment: ${this.config.environment}`);
        
        const appDiv = document.getElementById('app');
        if (appDiv) {
            appDiv.innerHTML = `
                <h1>Welcome to GDisc</h1>
                <p>${this.exampleComponent.greet()}</p>
                <p>Environment: ${this.config.environment}</p>
            `;
        }
    }
}
