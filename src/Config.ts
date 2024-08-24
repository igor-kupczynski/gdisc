export class Config {
    public readonly environment: string;

    constructor() {
        this.environment = this.getEnvironment();
    }

    private getEnvironment(): string {
        // Check if we're in a browser environment
        if (typeof window !== 'undefined') {
            // Assume your build process injects this global variable
            return (window as any).__ENV__ || 'development';
        }
        // Fallback for non-browser environments (like tests)
        return 'development';
    }
}
