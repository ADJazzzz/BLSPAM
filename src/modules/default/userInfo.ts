import BILIAPI from '../../utils/bili'
import { UserData, LiveInfoData } from '../../types'
import { useBiliStore } from '../../stores/useBiliStore'
import { unsafeWindow } from '$'
import BaseModule from '../BaseModule'

class UserInfo extends BaseModule {
    private async getUserInfo(): Promise<UserData.Nav.Data> {
        try {
            const response = await BILIAPI.nav()
            if (response.code === 0) {
                return Promise.resolve(response.data)
            } else {
                this.logger.error('获取用户信息出错', response.message)
                return Promise.reject(response.message)
            }
        } catch (error) {
            this.logger.error('获取用户信息出错', error)
            return Promise.reject(error)
        }
    }

    private getWindowBiliLive(): Promise<Window['BilibiliLive']> {
        return new Promise((resolve) => {
            const timer = setInterval(() => {
                const windowBiliLive = unsafeWindow.BilibiliLive
                if (windowBiliLive) {
                    clearInterval(timer)
                    resolve(windowBiliLive)
                }
            }, 100)
        })
    }

    private async getEmotionData(): Promise<LiveInfoData.GetEmoticons.EmotionData[]> {
        const roomID = useBiliStore().BilibiliLive?.ROOMID
        if (!roomID) {
            this.logger.error('获取用户信息出错', 'roomID 不存在')
            return Promise.reject('roomID 不存在')
        }
        const EmotionData: LiveInfoData.GetEmoticons.EmotionData[] = []
        try {
            const response = await BILIAPI.getEmoticons('pc', roomID)
            if (response.code === 0) {
                EmotionData.push(...response.data.data)
                return Promise.resolve(EmotionData)
            } else {
                this.logger.error('获取表情包出错', response.message)
                return Promise.reject(response.message)
            }
        } catch (error) {
            this.logger.error('获取表情包出错', error)
            return Promise.reject(error)
        }
    }

    public async run(): Promise<void> {
        useBiliStore().BilibiliLive = await this.getWindowBiliLive()
        if (useBiliStore().BilibiliLive) {
            useBiliStore().emotionData = await this.getEmotionData()
        }
        useBiliStore().userInfo = await this.getUserInfo()
    }
}

export default UserInfo
