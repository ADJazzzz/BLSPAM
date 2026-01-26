class Logger {
    private readonly NAME: string = 'BLSPAM'
    private readonly module: string

    private get prefix(): string[] {
        const now = new Date()
        const time = `${now.toLocaleDateString()} ${now.toLocaleTimeString()}`
        return [
            `%c${this.NAME}%c[${time}][${this.module}]%c:`,
            'font-weight: bold; color: white; background-color: #23ade5; padding: 1px 4px; border-radius: 4px;',
            'font-weight: bold; color: #0093D3;',
            ''
        ]
    }

    public log(...data: any[]): void {
        console.log(...this.prefix, ...data)
    }

    public info(...data: any[]): void {
        console.info(...this.prefix, ...data)
    }

    public warn(...data: any[]): void {
        console.warn(...this.prefix, ...data)
    }

    public error(...data: any[]): void {
        console.error(...this.prefix, ...data)
    }

    constructor(module: string) {
        this.module = module.split('_').join('][')
    }
}

export default Logger
