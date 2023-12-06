import Logger from '../utils/logger'
import { useModuleStore } from '../stores/useModuleStore'

class BaseModule {
    public moduleName: string

    protected logger: Logger

    constructor(moduleName: string) {
        this.moduleName = moduleName
        this.logger = new Logger(this.moduleName)
    }

    protected moduleStore = useModuleStore()

    public run(): void | Promise<void> {
        throw new Error('Method not implemented.')
    }
}

export default BaseModule
