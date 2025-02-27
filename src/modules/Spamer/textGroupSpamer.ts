import _ from 'lodash'
import BILIAPI from '../../utils/bili'
import { useBiliStore } from '../../stores/useBiliStore'
import BaseModule from '../BaseModule'
import { AxiosResponse } from '../../types'

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
        let intervalId: NodeJS.Timeout | null = null

        const sendMsg = async (msg: string) => {
            try {
                const response = (await BILIAPI.sendMsg(msg, roomid)) as AxiosResponse
                if (response.data.code === 0) {
                    this.logger.log(`弹幕 ${msg} 发送成功`, response)
                } else {
                    this.logger.error(`弹幕 ${msg} 发送失败`, response)
                }
            } catch (error) {
                this.logger.error(`弹幕 ${msg} 发送失败`, error)
            }
        }

        const sendNextMsg = async () => {
            if (this.config.enable) {
                if (currentIndex < msg.length) {
                    await sendMsg(msg[currentIndex])
                    currentIndex++
                }
                if (currentIndex >= msg.length) {
                    currentIndex = 0
                }
            } else {
                if (intervalId) {
                    clearInterval(intervalId)
                    intervalId = null
                }
            }
        }

        // Invoke send immediately
        sendNextMsg()

        intervalId = setInterval(sendNextMsg, timeinterval)
    }

    public async run(): Promise<void> {
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
