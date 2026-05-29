import _ from 'lodash'
import { BILIAPI } from '@/utils/bili'
import { useDiscreteAPI } from '@/utils/ui'
import { useBiliStore } from '@/stores/useBiliStore'
import { sliceDanmaku } from '@/utils/danmaku'
import BaseModule from '../BaseModule'

type SpamArea = 'text' | 'favorites'

interface SpamConfig {
    enable: boolean
    timeinterval: number
}

class TextSpamer extends BaseModule {
    private textConfig = this.moduleStore.moduleConfig.TextSpam
    private favoritesConfig = this.moduleStore.moduleConfig.Favorites
    private timeoutId: NodeJS.Timeout | null = null
    private timeLimitId: NodeJS.Timeout | null = null

    private get roomId(): number | undefined {
        return useBiliStore().BilibiliLive?.ROOMID
    }

    private getRandomInterval(min: number, max: number): number {
        if (max > min) {
            return Math.floor(Math.random() * (max - min + 1) + min)
        }
        return min
    }

    private formatMsg(msg: string): string {
        return msg.replace(/\n/g, '')
    }

    private formatFavorites(): string[] {
        return _.flatMap(this.favoritesConfig.favoritesTabPanels, (item) => {
            if (!item.msg) return []
            const processedMsg = this.formatMsg(item.msg)
            return sliceDanmaku(processedMsg, this.textConfig.textinterval)
        })
    }

    private formatTime(seconds: number): number {
        return seconds * 1000
    }

    private cleanUP(): void {
        if (this.timeoutId) {
            clearTimeout(this.timeoutId)
            this.timeoutId = null
        }
        if (this.timeLimitId) {
            clearTimeout(this.timeLimitId)
            this.timeLimitId = null
        }
    }

    private async sendMsg(message: string, roomid: number): Promise<boolean> {
        try {
            const response = await BILIAPI.sendMsg(message, roomid)
            const { notification } = useDiscreteAPI(
                ['notification'],
                !this.moduleStore.moduleConfig.setting.danmakuDetail.enable
            )

            if (response.code === 0) {
                this.logger.log(`弹幕 ${message} 发送成功`, response)
                return true
            }

            this.logger.error(`弹幕 ${message} 发送失败`, response)
            notification.error({
                closable: false,
                content: `弹幕"${message}"发送失败: ${response.message}`,
                duration: 3000
            })
            return false
        } catch (error) {
            this.logger.error(`弹幕 ${message} 发送失败`, error)
            return false
        }
    }

    private createCycleSender(
        msgs: string[],
        roomid: number,
        timeintervalMin: number,
        timeintervalMax: number,
        randomize: boolean,
        config: SpamConfig
    ): void {
        let currentIndex = 0

        const sendNext = async () => {
            if (!config.enable) {
                this.cleanUP()
                return
            }
            await this.sendMsg(msgs[currentIndex], roomid)
            currentIndex = (currentIndex + 1) % msgs.length

            const delay = randomize
                ? this.getRandomInterval(timeintervalMin, timeintervalMax)
                : timeintervalMin
            this.timeoutId = setTimeout(sendNext, delay)
        }

        sendNext()
    }

    private async startTextSpam(): Promise<void> {
        this.cleanUP()
        if (!this.roomId) return

        const formattedMsg = this.formatMsg(this.textConfig.msg)
        const msgs = sliceDanmaku(formattedMsg, this.textConfig.textinterval)
        const timeintervalMin = this.formatTime(this.textConfig.timeinterval)
        const timeintervalMax = this.formatTime(this.textConfig.timeintervalMax)
        const timelimit = this.formatTime(this.textConfig.timelimit)

        this.createCycleSender(
            msgs,
            this.roomId,
            timeintervalMin,
            timeintervalMax,
            this.textConfig.randomize,
            this.textConfig
        )

        if (timelimit > 0) {
            this.timeLimitId = setTimeout(() => {
                this.stop('text')
            }, timelimit)
        }
    }

    private async startFavoritesSpam(): Promise<void> {
        this.cleanUP()
        if (!this.roomId) return

        const msgs = this.formatFavorites()
        if (msgs.length === 0) return

        const timeintervalMin = this.formatTime(this.favoritesConfig.timeinterval)
        const timeintervalMax = this.formatTime(this.favoritesConfig.timeintervalMax)
        this.createCycleSender(
            msgs,
            this.roomId,
            timeintervalMin,
            timeintervalMax,
            this.favoritesConfig.randomize,
            this.favoritesConfig
        )
    }

    public stop(area: SpamArea): void {
        const config = area === 'text' ? this.textConfig : this.favoritesConfig
        const log = area === 'text' ? '文字独轮车已停止' : '收藏夹独轮车已停止'

        config.enable = false
        this.cleanUP()
        this.logger.log(log)
    }

    public async run(): Promise<void> {
        this.moduleStore.emitter.off('TextSpam')
        this.moduleStore.emitter.off('Favorites')
        this.cleanUP()

        this.moduleStore.emitter.on('TextSpam', () => this.startTextSpam())
        this.moduleStore.emitter.on('Favorites', () => this.startFavoritesSpam())
    }
}

export default TextSpamer
