import { useBiliStore } from '@/stores/useBiliStore'
import { useDiscreteAPI } from '@/utils/ui'
import BaseModule from '../BaseModule'

class SaveSpamerStatus extends BaseModule {
    config = this.moduleStore.moduleConfig.setting.saveSpamerStatus

    public async run() {
        if (this.config.enable) {
            const biliStore = useBiliStore()
            const currentRoomId = biliStore.BilibiliLive?.ROOMID

            if (!currentRoomId) {
                this.logger.log('未检测到房间ID，跳过恢复')
                this.moduleStore.moduleConfig.TextSpam.enable = false
                this.moduleStore.moduleConfig.EmotionSpam.enable = false
                this.moduleStore.moduleConfig.Favorites.enable = false
                return
            }

            const savedEntry = this.config.saveSpamerStatusList.find(
                (item) => item.roomid === currentRoomId
            )
            const modulesToRestore = savedEntry?.modules ?? []

            // 先同步全局 enable 标志为当前房间的实际状态，确保 UI 跨房间正确
            this.moduleStore.moduleConfig.TextSpam.enable = modulesToRestore.includes('TextSpam')
            this.moduleStore.moduleConfig.EmotionSpam.enable =
                modulesToRestore.includes('EmotionSpam')
            this.moduleStore.moduleConfig.Favorites.enable = modulesToRestore.includes('Favorites')

            if (modulesToRestore.length === 0) {
                this.logger.log(`房间 ${currentRoomId} 无待恢复的独轮车状态`)
                return
            }

            this.logger.log(
                `将在房间 ${currentRoomId} 恢复独轮车状态: ${modulesToRestore.join(', ')}`
            )

            const uname = savedEntry?.uname ?? '未知用户'

            setTimeout(() => {
                for (const module of modulesToRestore) {
                    ;(this.moduleStore.emitter.emit as any)(module, { module })
                }

                const { notification } = useDiscreteAPI(['notification'])
                notification.create({
                    content: `将在「${uname}」的直播间恢复独轮车状态，如需关闭请到控制面板关闭并刷新网页`,
                    closable: false,
                    duration: 6e3
                })
            }, 200)
        } else {
            this.config.saveSpamerStatusList = []
            this.moduleStore.moduleConfig.TextSpam.enable = false
            this.moduleStore.moduleConfig.EmotionSpam.enable = false
            this.moduleStore.moduleConfig.Favorites.enable = false
        }
    }
}

export default SaveSpamerStatus
