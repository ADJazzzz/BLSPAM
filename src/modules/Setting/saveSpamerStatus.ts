import BaseModule from '../BaseModule'

class SaveSpamerStatus extends BaseModule {
    config = this.moduleStore.moduleConfig.setting.saveSpamerStatus

    public async run() {
        if (this.config.enable) {
            this.logger.log('将恢复上次独轮车开关状态')
            setTimeout(() => {
                const modules = ['TextSpam', 'EmotionSpam', 'TextGroupSpam']
                for (const module of modules) {
                    if ((this.moduleStore.moduleConfig as any)[module].enable) {
                        ;(this.moduleStore.emitter.emit as any)(module, { module })
                        break
                    }
                }
            }, 200)
        } else {
            this.moduleStore.moduleConfig.TextSpam.enable = false
            this.moduleStore.moduleConfig.EmotionSpam.enable = false
            this.moduleStore.moduleConfig.TextGroupSpam.enable = false
        }
    }
}

export default SaveSpamerStatus
