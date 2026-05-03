import { BILIAPI } from '@/utils/bili'
import { useDiscreteAPI } from '@/utils/ui'
import { useBiliStore } from '@/stores/useBiliStore'
import type { timeIntervalRange } from '@/types'
import BaseModule from '../BaseModule'

class EmotionSpamer extends BaseModule {
    config = this.moduleStore.moduleConfig.EmotionSpam
    private intervalId: NodeJS.Timeout | null = null

    private formatTime(time: number): number {
        return time * 1000
    }

    private normalizeInterval(timeinterval: timeIntervalRange): timeIntervalRange {
        return {
            min: Math.min(timeinterval.min, timeinterval.max),
            max: Math.max(timeinterval.min, timeinterval.max)
        }
    }

    private getRandomInterval(timeinterval: timeIntervalRange): number {
        const normalizedInterval = this.normalizeInterval(timeinterval)
        const min = this.formatTime(normalizedInterval.min)
        const max = this.formatTime(normalizedInterval.max)
        if (max === min) return min
        return Math.floor(Math.random() * (max - min + 1) + min)
    }

    private cleanUP(): void {
        if (this.intervalId) {
            clearTimeout(this.intervalId)
            this.intervalId = null
        }
    }

    private async cycleSendEmotion(
        emotions: string[],
        roomid: number,
        timeinterval: timeIntervalRange,
        timelimit: number
    ): Promise<void> {
        let currentIndex = 0

        const sendEmotion = async (emotion: string) => {
            try {
                const response = await BILIAPI.sendEmotion(emotion, roomid)
                const { notification } = useDiscreteAPI(
                    ['notification'],
                    !this.moduleStore.moduleConfig.setting.danmakuDetail.enable
                )
                if (response.code === 0) {
                    this.logger.log(`表情 ${emotion} 发送成功`, response)
                } else {
                    this.logger.error(`表情 ${emotion} 发送失败`, response)
                    notification.error({
                        closable: false,
                        content: `表情"${emotion}"发送失败: ${response.message}`,
                        duration: 3000
                    })
                }
            } catch (error) {
                this.logger.error(`表情 ${emotion} 发送失败`, error)
            }
        }

        const sendNextEmotion = async () => {
            if (this.config.enable) {
                try {
                    if (currentIndex < emotions.length) {
                        await sendEmotion(emotions[currentIndex])
                        currentIndex++
                    }
                    if (currentIndex >= emotions.length) {
                        currentIndex = 0
                    }
                } catch (error) {
                    this.logger.error('表情发送发生异常', error)
                }
                this.intervalId = setTimeout(
                    sendNextEmotion,
                    this.getRandomInterval(timeinterval)
                )
                return
            }
            this.cleanUP()
        }

        await sendNextEmotion()

        if (timelimit !== 0) {
            setTimeout(() => {
                this.config.enable = false
                this.cleanUP()
                this.logger.log('表情独轮车已停止')
            }, timelimit)
        }
    }

    public stop(): void {
        this.config.enable = false
        this.cleanUP()
        this.logger.log('表情独轮车已停止')
    }

    public async run(): Promise<void> {
        this.moduleStore.emitter.off('EmotionSpam')
        this.cleanUP()
        this.moduleStore.emitter.on('EmotionSpam', async () => {
            const roomid = useBiliStore().BilibiliLive?.ROOMID
            const formattedTime = this.formatTime(this.config.timelimit)
            if (roomid) {
                const msg = this.config.msgByRoom[String(roomid)] ?? []
                await this.cycleSendEmotion(msg, roomid, this.config.timeinterval, formattedTime)
            }
        })
    }
}

export default EmotionSpamer
