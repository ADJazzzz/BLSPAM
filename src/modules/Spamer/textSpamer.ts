import BILIAPI from '../../utils/bili'
import { useBiliStore } from '../../stores/useBiliStore'
import BaseModule from '../BaseModule'

class TextSpamer extends BaseModule {
    config = this.moduleStore.moduleConfig.TextSpam

    private formatMsg(msg: string): string {
        return msg.replace(/\n/g, '')
    }

    private formatTime(time: number): number {
        return time * 1000
    }

    private async cycleSendDanmu(
        msg: string,
        roomid: number,
        timeinterval: number,
        textinterval: number,
        timelimit: number
    ): Promise<void> {
        const sendMsg = async (message: string) => {
            if (this.config.enable) {
                await BILIAPI.sendMsg(message, roomid)
            }
        }

        if (msg.length < textinterval) {
            const shortInterval = setInterval(() => sendMsg(msg), timeinterval)
            if (!this.config.enable) {
                clearInterval(shortInterval)
            }
            if (timelimit !== 0) {
                setTimeout(() => {
                    clearInterval(shortInterval)
                    this.config.enable = false
                }, timelimit)
            }
        } else {
            const slices: string[] = []
            for (let i = 0; i < msg.length; i += textinterval) {
                slices.push(msg.slice(i, i + textinterval))
            }

            let currentIndex = 0

            const sendMsgLong = async () => {
                if (currentIndex < slices.length) {
                    await sendMsg(slices[currentIndex])
                    currentIndex++
                } else {
                    currentIndex = 0
                }
            }

            const longInterval = setInterval(sendMsgLong, timeinterval)
            if (!this.config.enable) {
                clearInterval(longInterval)
            }
            if (timelimit !== 0) {
                setTimeout(() => {
                    clearInterval(longInterval)
                    this.config.enable = false
                }, timelimit)
            }
        }
    }

    public async run(): Promise<void> {
        this.logger.log('文字独轮车准备就绪')
        this.moduleStore.emitter.on('TextSpam', async () => {
            const formattedMsg = this.formatMsg(this.config.msg)
            const roomid = useBiliStore().BilibiliLive?.ROOMID
            const timeinterval = this.formatTime(this.config.timeinterval)
            const textinterval = this.config.textinterval
            const formattedTime = this.formatTime(this.config.timelimit)
            if (roomid) {
                await this.cycleSendDanmu(
                    formattedMsg,
                    roomid,
                    timeinterval,
                    textinterval,
                    formattedTime
                )
            }
        })
    }
}

export default TextSpamer
