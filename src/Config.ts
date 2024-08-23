export class Config {
    public readonly environment: string;

    constructor() {
        this.environment = process.env.NODE_ENV || 'development';
    }
}
