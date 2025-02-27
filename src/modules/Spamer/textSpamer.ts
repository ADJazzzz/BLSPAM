import BILIAPI from '../../utils/bili'
import { useBiliStore } from '../../stores/useBiliStore'
import BaseModule from '../BaseModule'
import { AxiosResponse } from '../../types'

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
            try {
                const response = (await BILIAPI.sendMsg(message, roomid)) as AxiosResponse
                if (response.data.code === 0) {
                    this.logger.log(`弹幕 ${message} 发送成功`, response)
                } else {
                    this.logger.error(`弹幕 ${message} 发送失败`, response)
                }
            } catch (error) {
                this.logger.error(`弹幕 ${message} 发送失败`, error)
            }
        }

        let intervalId: NodeJS.Timeout | null = null

        const stopSending = () => {
            if (intervalId) {
                clearInterval(intervalId)
                intervalId = null
                this.config.enable = false
            }
        }

        if (msg.length < textinterval) {
            const sendNext = async () => {
                if (this.config.enable) {
                    await sendMsg(msg)
                } else {
                    stopSending()
                }
            }

            // Invoke send immediately
            sendNext()

            intervalId = setInterval(sendNext, timeinterval)
        }
        else {
            const slices: string[] = []
            for (let i = 0; i < msg.length; i += textinterval) {
                slices.push(msg.slice(i, i + textinterval))
            }

            let currentIndex = 0

            const sendNextSlice = async () => {
                if (this.config.enable) {
                    if (currentIndex < slices.length) {
                        await sendMsg(slices[currentIndex])
                        currentIndex++
                    }
                    if (currentIndex >= slices.length) {
                        currentIndex = 0
                    }
                } else {
                    stopSending()
                }
            }

            // Invoke send immediately
            sendNextSlice()

            intervalId = setInterval(sendNextSlice, timeinterval)
        }

        if (timelimit !== 0) {
            setTimeout(stopSending, timelimit)
        }
    }

    public async run(): Promise<void> {
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
