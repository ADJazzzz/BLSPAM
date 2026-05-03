import _ from 'lodash'
import { BILIAPI } from '@/utils/bili'
import { useDiscreteAPI } from '@/utils/ui'
import { useBiliStore } from '@/stores/useBiliStore'
import type { timeIntervalRange } from '@/types'
import BaseModule from '../BaseModule'

type SpamArea = 'text' | 'favorites'

type TimeIntervalRange = timeIntervalRange

interface SpamConfig {
    enable: boolean
    timeinterval: TimeIntervalRange
}

class TextSpamer extends BaseModule {
    private textConfig = this.moduleStore.moduleConfig.TextSpam
    private favoritesConfig = this.moduleStore.moduleConfig.Favorites
    private intervalId: NodeJS.Timeout | null = null
    private timeLimitId: NodeJS.Timeout | null = null

    private get roomId(): number | undefined {
        return useBiliStore().BilibiliLive?.ROOMID
    }

    private formatMsg(msg: string): string {
        return msg.replace(/\n/g, '')
    }

    private sliceMsg(msg: string, maxLength: number): string[] {
        if (msg.length <= maxLength) return [msg]
        return msg.match(new RegExp(`.{1,${maxLength}}`, 'g')) || []
    }

    private formatFavorites(): string[] {
        return _.flatMap(this.favoritesConfig.favoritesTabPanels, (item) => {
            if (!item.msg) return []
            const processedMsg = this.formatMsg(item.msg)
            return this.sliceMsg(processedMsg, this.textConfig.textinterval)
        })
    }

    private formatTime(seconds: number): number {
        return seconds * 1000
    }

    private normalizeInterval(timeinterval: TimeIntervalRange): TimeIntervalRange {
        return {
            min: Math.min(timeinterval.min, timeinterval.max),
            max: Math.max(timeinterval.min, timeinterval.max)
        }
    }

    private getRandomInterval(timeinterval: TimeIntervalRange): number {
        const normalizedInterval = this.normalizeInterval(timeinterval)
        const min = this.formatTime(normalizedInterval.min)
        const max = this.formatTime(normalizedInterval.max)
        if (max === min) return min
        return Math.floor(Math.random() * (max - min) + min)
    }

    private cleanUP(): void {
        if (this.intervalId) {
            clearTimeout(this.intervalId)
            this.intervalId = null
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
        timeinterval: TimeIntervalRange,
        config: SpamConfig
    ): void {
        let currentIndex = 0

        const sendNext = async () => {
            if (!config.enable) {
                this.cleanUP()
                return
            }
            try {
                await this.sendMsg(msgs[currentIndex], roomid)
            } catch (error) {
                this.logger.error('弹幕发送发生异常', error)
            } finally {
                currentIndex = (currentIndex + 1) % msgs.length
            }
            this.intervalId = setTimeout(sendNext, this.getRandomInterval(timeinterval))
        }

        sendNext()
    }

    private async startTextSpam(): Promise<void> {
        this.cleanUP()
        if (!this.roomId) return

        const formattedMsg = this.formatMsg(this.textConfig.msg)
        const msgs = this.sliceMsg(formattedMsg, this.textConfig.textinterval)
        const timelimit = this.formatTime(this.textConfig.timelimit)

        this.createCycleSender(msgs, this.roomId, this.textConfig.timeinterval, this.textConfig)

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

        this.createCycleSender(msgs, this.roomId, this.favoritesConfig.timeinterval, this.favoritesConfig)
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
