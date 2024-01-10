import _ from 'lodash'
import BILIAPI from '../../utils/bili'
import { useBiliStore } from '../../stores/useBiliStore'
import BaseModule from '../BaseModule'

class TextGroupSpamer extends BaseModule {
    config = this.moduleStore.moduleConfig.TextGroupSpam

    private formatMsg(): string[] {
        const slicedMsg = _.flatMap(this.config.textGroupTabPanels, (items) => {
            if (items.msg) {
                const processedMsg = items.msg.replace(/\n/g, '')
                if (processedMsg.length > 20) {
                    return processedMsg.match(/.{1,20}/g) || []
                } else {
                    return [processedMsg]
                }
            }
            return []
        })
        return slicedMsg
    }

    private formatTime(time: number): number {
        return time * 1000
    }

    private async cycleSendDanmuGroup(
        msg: string[],
        roomid: number,
        timeinterval: number
    ): Promise<void> {
        let currentIndex = 0
        const sendMsg = async (msg: string) => {
            if (this.config.enable) {
                await BILIAPI.sendMsg(msg, roomid)
            }
        }

        const send = setInterval(async () => {
            if (this.config.enable) {
                if (currentIndex < msg.length) {
                    await sendMsg(msg[currentIndex])
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
        this.logger.log('文字池独轮车准备就绪')
        this.moduleStore.emitter.on('TextGroupSpam', async () => {
            const msg = this.formatMsg()
            const roomid = useBiliStore().BilibiliLive?.ROOMID
            const formattedTimeInterval = this.formatTime(this.config.timeinterval)
            if (roomid) {
                await this.cycleSendDanmuGroup(msg, roomid, formattedTimeInterval)
            }
        })
    }
}

export default TextGroupSpamer
