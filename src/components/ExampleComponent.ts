export class ExampleComponent {
    private name: string;

    constructor(name: string) {
        this.name = name;
    }

    public greet(): string {
        return `Welcome to GDisc, ${this.name}!`;
    }
}
