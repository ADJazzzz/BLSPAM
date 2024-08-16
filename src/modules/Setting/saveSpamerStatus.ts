import { createDiscreteApi } from 'naive-ui'
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
                        const { notification } = createDiscreteApi(['notification'])
                        notification.create({
                            content: '将恢复独轮车开关状态，如需关闭请到控制面板关闭并刷新网页',
                            closable: false,
                            duration: 6e3
                        })
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
