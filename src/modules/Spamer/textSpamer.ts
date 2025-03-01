import BILIAPI from '../../utils/bili'
import { useBiliStore } from '../../stores/useBiliStore'
import BaseModule from '../BaseModule'
import { AxiosResponse } from '../../types'

class TextSpamer extends BaseModule {
    config = this.moduleStore.moduleConfig.TextSpam
    private intervalId: NodeJS.Timeout | null = null
    private msgSlices: string[] = []

    private formatMsg(msg: string): string {
        return msg.replace(/\n/g, '')
    }

    private formatTime(time: number): number {
        return time * 1000
    }

    private cleanUP(): void {
        if (this.intervalId) {
            clearInterval(this.intervalId)
            this.intervalId = null
        }
        this.msgSlices = []
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

        if (msg.length < textinterval) {
            const sendNext = async () => {
                if (this.config.enable) {
                    await sendMsg(msg)
                } else {
                    this.cleanUP()
                }
            }

            await sendNext()

            this.intervalId = setInterval(sendNext, timeinterval)
        } else {
            for (let i = 0; i < msg.length; i += textinterval) {
                this.msgSlices.push(msg.slice(i, i + textinterval))
            }

            let currentIndex = 0

            const sendNextSlice = async () => {
                if (this.config.enable) {
                    if (currentIndex < this.msgSlices.length) {
                        await sendMsg(this.msgSlices[currentIndex])
                        currentIndex++
                    }
                    if (currentIndex >= this.msgSlices.length) {
                        currentIndex = 0
                    }
                } else {
                    this.cleanUP()
                }
            }

            await sendNextSlice()

            this.intervalId = setInterval(sendNextSlice, timeinterval)
        }

        if (timelimit !== 0) {
            setTimeout(() => {
                this.config.enable = false
                this.cleanUP()
                this.logger.log('文字独轮车已停止')
            }, timelimit)
        }
    }

    public stop(): void {
        this.config.enable = false
        this.cleanUP()
        this.logger.log('文字独轮车已停止')
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
