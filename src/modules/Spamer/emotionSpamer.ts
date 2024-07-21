import BILIAPI from '../../utils/bili'
import { useBiliStore } from '../../stores/useBiliStore'
import BaseModule from '../BaseModule'
import { AxiosResponse } from '../../types'

class EmotionSpamer extends BaseModule {
    config = this.moduleStore.moduleConfig.EmotionSpam

    private formatTime(time: number): number {
        return time * 1000
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

        const send = setInterval(async () => {
            if (this.config.enable) {
                if (currentIndex < emotions.length) {
                    await sendEmotion(emotions[currentIndex])
                    currentIndex++
                }
                if (currentIndex >= emotions.length) {
                    currentIndex = 0
                }
            } else {
                clearInterval(send)
            }
        }, timeinterval)

        if (timelimit !== 0) {
            setTimeout(() => {
                clearInterval(send)
                this.config.enable = false
            }, timelimit)
        }
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
