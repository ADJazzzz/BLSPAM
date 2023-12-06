import BILIAPI from '../../utils/bili'
import { useBiliStore } from '../../stores/useBiliStore'
import BaseModule from '../BaseModule'

class EmotionSpamer extends BaseModule {
    config = this.moduleStore.moduleConfig.EmotionSpam

    private async cycleSendEmotion(
        msg: string[],
        roomid: number,
        timeinterval: number
    ): Promise<void> {
        let currentIndex = 0
        const emotions: string[] = msg

        const send = setInterval(async () => {
            if (this.config.enable) {
                if (currentIndex < emotions.length) {
                    await BILIAPI.sendEmotion(emotions[currentIndex], roomid)
                    currentIndex++
                } else {
                    currentIndex = 0
                }
            } else {
                clearInterval(send)
            }
        }, timeinterval)
    }

    public async run(): Promise<void> {
        this.logger.log('表情独轮车准备就绪')
        this.moduleStore.emitter.on('EmotionSpam', async () => {
            const msg = this.config.msg
            const roomid = useBiliStore().BilibiliLive?.ROOMID
            const timeinterval = this.config.timeinterval
            if (roomid) {
                await this.cycleSendEmotion(msg, roomid, timeinterval)
            }
        })
    }
}

export default EmotionSpamer
