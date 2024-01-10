import BILIAPI from '../../utils/bili'
import { useBiliStore } from '../../stores/useBiliStore'
import BaseModule from '../BaseModule'

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
            if (this.config.enable) {
                await BILIAPI.sendEmotion(emotion, roomid)
            }
        }

        const send = setInterval(async () => {
            if (this.config.enable) {
                if (currentIndex < emotions.length) {
                    await sendEmotion(emotions[currentIndex])
                    currentIndex++
                } else {
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
        this.logger.log('表情独轮车准备就绪')
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
