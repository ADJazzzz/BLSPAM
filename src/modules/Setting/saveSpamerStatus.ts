import { watch } from 'vue'
import { useBiliStore } from '@/stores/useBiliStore'
import { useDiscreteAPI } from '@/utils/ui'
import type { RoomSpamerStatus } from '@/types'
import BaseModule from '../BaseModule'

class SaveSpamerStatus extends BaseModule {
    config = this.moduleStore.moduleConfig.setting.saveSpamerStatus

    private getRoomKey(): string | null {
        const roomid = useBiliStore().BilibiliLive?.ROOMID
        return roomid ? String(roomid) : null
    }

    private ensureRoomStatus(roomKey: string): RoomSpamerStatus {
        const roomStatus = this.config.roomStatus
        const hasStoredRooms = Object.keys(roomStatus).length > 0
        if (!roomStatus[roomKey]) {
            roomStatus[roomKey] = hasStoredRooms
                ? {
                      TextSpam: false,
                      EmotionSpam: false,
                      Favorites: false
                  }
                : {
                      TextSpam: this.moduleStore.moduleConfig.TextSpam.enable,
                      EmotionSpam: this.moduleStore.moduleConfig.EmotionSpam.enable,
                      Favorites: this.moduleStore.moduleConfig.Favorites.enable
                  }
        }

        return roomStatus[roomKey]
    }

    private applyRoomStatus(status: RoomSpamerStatus) {
        this.moduleStore.moduleConfig.TextSpam.enable = status.TextSpam
        this.moduleStore.moduleConfig.EmotionSpam.enable = status.EmotionSpam
        this.moduleStore.moduleConfig.Favorites.enable = status.Favorites
    }

    private watchRoomStatus(roomKey: string) {
        const stop = watch(
            () => [
                this.moduleStore.moduleConfig.TextSpam.enable,
                this.moduleStore.moduleConfig.EmotionSpam.enable,
                this.moduleStore.moduleConfig.Favorites.enable
            ],
            ([textEnabled, emotionEnabled, favoritesEnabled]) => {
                this.config.roomStatus[roomKey] = {
                    TextSpam: textEnabled,
                    EmotionSpam: emotionEnabled,
                    Favorites: favoritesEnabled
                }
            },
            { immediate: true }
        )

        const cleanup = () => {
            stop()
        }

        window.addEventListener('beforeunload', cleanup, { once: true })
        window.addEventListener('pagehide', cleanup, { once: true })
        window.addEventListener('unload', cleanup, { once: true })
    }

    public async run() {
        if (this.config.enable) {
            const roomKey = this.getRoomKey()
            if (!roomKey) return

            this.logger.log('将恢复当前直播间独轮车开关状态')
            const roomStatus = this.ensureRoomStatus(roomKey)
            this.applyRoomStatus(roomStatus)
            this.watchRoomStatus(roomKey)

            setTimeout(() => {
                const modules = ['TextSpam', 'EmotionSpam', 'Favorites'] as const
                let hasRestored = false
                for (const module of modules) {
                    if (roomStatus[module]) {
                        this.moduleStore.emitter.emit(module, { module })
                        hasRestored = true
                    }
                }

                if (hasRestored) {
                    const { notification } = useDiscreteAPI(['notification'])
                    notification.create({
                        content:
                            '将恢复当前直播间独轮车开关状态，如需关闭请到控制面板关闭并刷新网页',
                        closable: false,
                        duration: 6e3
                    })
                }
            }, 200)
        } else {
            this.moduleStore.moduleConfig.TextSpam.enable = false
            this.moduleStore.moduleConfig.EmotionSpam.enable = false
            this.moduleStore.moduleConfig.Favorites.enable = false
        }
    }
}

export default SaveSpamerStatus
