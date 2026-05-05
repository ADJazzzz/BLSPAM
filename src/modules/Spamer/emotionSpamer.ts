import { BILIAPI } from '@/utils/bili'
import { useDiscreteAPI } from '@/utils/ui'
import { useBiliStore } from '@/stores/useBiliStore'
import BaseModule from '../BaseModule'

class EmotionSpamer extends BaseModule {
    config = this.moduleStore.moduleConfig.EmotionSpam
    private timeoutId: NodeJS.Timeout | null = null

    private formatTime(time: number): number {
        return time * 1000
    }

    private getRandomInterval(min: number, max: number): number {
        if (max > min) {
            return Math.floor(Math.random() * (max - min + 1) + min)
        }
        return min
    }

    private cleanUP(): void {
        if (this.timeoutId) {
            clearTimeout(this.timeoutId)
            this.timeoutId = null
        }
    }

    private async cycleSendEmotion(
        emotions: string[],
        roomid: number,
        timeintervalMin: number,
        timeintervalMax: number,
        timelimit: number,
        randomize: boolean
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
                if (currentIndex < emotions.length) {
                    await sendEmotion(emotions[currentIndex])
                    currentIndex++
                }
                if (currentIndex >= emotions.length) {
                    currentIndex = 0
                }
                const delay = randomize
                    ? this.getRandomInterval(timeintervalMin, timeintervalMax)
                    : timeintervalMin
                this.timeoutId = setTimeout(sendNextEmotion, delay)
            } else {
                this.cleanUP()
            }
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
            const formattedTimeIntervalMin = this.formatTime(this.config.timeinterval)
            const formattedTimeIntervalMax = this.formatTime(this.config.timeintervalMax)
            const formattedTime = this.formatTime(this.config.timelimit)
            if (roomid) {
                const msg = this.config.msgByRoom[String(roomid)] ?? []
                await this.cycleSendEmotion(
                    msg,
                    roomid,
                    formattedTimeIntervalMin,
                    formattedTimeIntervalMax,
                    formattedTime,
                    this.config.randomize
                )
            }
        })
    }
}

export default EmotionSpamer
