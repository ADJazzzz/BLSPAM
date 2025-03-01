import BILIAPI from '../../utils/bili'
import { useBiliStore } from '../../stores/useBiliStore'
import BaseModule from '../BaseModule'
import { AxiosResponse } from '../../types'

class EmotionSpamer extends BaseModule {
    config = this.moduleStore.moduleConfig.EmotionSpam
    private intervalId: NodeJS.Timeout | null = null

    private formatTime(time: number): number {
        return time * 1000
    }

    private cleanUP(): void {
        if (this.intervalId) {
            clearInterval(this.intervalId)
            this.intervalId = null
        }
    }

    private async cycleSendEmotion(
        emotions: string[],
        roomid: number,
        timeinterval: number,
        timelimit: number
    ): Promise<void> {
        let currentIndex = 0

        const sendEmotion = async (emotion: string) => {
            try {
                const response = (await BILIAPI.sendEmotion(emotion, roomid)) as AxiosResponse
                if (response.data.code === 0) {
                    this.logger.log(`表情 ${emotion} 发送成功`, response)
                } else {
                    this.logger.error(`表情 ${emotion} 发送失败`, response)
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
            } else {
                this.cleanUP()
            }
        }

        await sendNextEmotion()

        this.intervalId = setInterval(sendNextEmotion, timeinterval)

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
        this.moduleStore.emitter.on('EmotionSpam', async () => {
            const msg = this.config.msg
            const roomid = useBiliStore().BilibiliLive?.ROOMID
            const formattedTimeInterval = this.formatTime(this.config.timeinterval)
            const formattedTime = this.formatTime(this.config.timelimit)
            if (roomid) {
                await this.cycleSendEmotion(msg, roomid, formattedTimeInterval, formattedTime)
            }
        })
    }
}

export default EmotionSpamer
