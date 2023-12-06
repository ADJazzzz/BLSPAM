import BILIAPI from '../../utils/bili'
import { useBiliStore } from '../../stores/useBiliStore'
import BaseModule from '../BaseModule'

class TextSpamer extends BaseModule {
    config = this.moduleStore.moduleConfig.TextSpam

    private formatMsg(msg: string): string {
        return msg.replace(/\n/g, '')
    }

    private async cycleSendDanmu(
        formattedmsg: string,
        roomid: number,
        timeinterval: number,
        textinterval: number
    ): Promise<void> {
        const slices: string[] = []
        let currentIndex = 0

        if (formattedmsg.length < textinterval) {
            const short = setInterval(async () => {
                if (this.config.enable) {
                    await BILIAPI.sendMsg(formattedmsg, roomid)
                } else {
                    clearInterval(short)
                }
            }, timeinterval)
        } else {
            for (let i = 0; i < formattedmsg.length; i += textinterval) {
                slices.push(formattedmsg.slice(i, i + textinterval))
            }

            const long = setInterval(async () => {
                if (this.config.enable) {
                    if (currentIndex < slices.length) {
                        await BILIAPI.sendMsg(slices[currentIndex], roomid)
                        currentIndex++
                    } else {
                        currentIndex = 0
                    }
                } else {
                    clearInterval(long)
                }
            }, timeinterval)
        }
    }

    public async run(): Promise<void> {
        this.logger.log('文字独轮车准备就绪')
        this.moduleStore.emitter.on('TextSpam', async () => {
            const formattedmsg = this.formatMsg(this.config.msg)
            const roomid = useBiliStore().BilibiliLive?.ROOMID
            const timeinterval = this.config.timeinterval
            const textinterval = this.config.textinterval
            if (roomid) {
                await this.cycleSendDanmu(formattedmsg, roomid, timeinterval, textinterval)
            }
        })
    }
}

export default TextSpamer
