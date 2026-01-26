import { BILIAPI } from '@/utils/bili'
import { useBiliStore } from '../../stores/useBiliStore'
import { unsafeWindow } from '$'
import BaseModule from '../BaseModule'
import { BiliAPIResponse } from '@/types'

class UserInfo extends BaseModule {
    private async getLoginInfo() {
        try {
            const response = await BILIAPI.nav()
            if (response.code === 0) {
                this.logger.log('LoginInfo', response)
                return Promise.resolve(response.data)
            } else {
                this.logger.error('获取登陆信息出错', response.message)
                return Promise.reject(response.message)
            }
        } catch (error) {
            this.logger.error('获取登陆信息出错', error)
            return Promise.reject(error)
        }
    }

    private getWindowBiliLive(): Promise<Window['BilibiliLive']> {
        return new Promise((resolve) => {
            const timer = setInterval(() => {
                const windowBiliLive = unsafeWindow.BilibiliLive
                if (windowBiliLive) {
                    clearInterval(timer)
                    this.logger.log('windowBiliLive', windowBiliLive)
                    resolve(windowBiliLive)
                }
            }, 200)
        })
    }

    private async getEmotionData() {
        const roomID = useBiliStore().BilibiliLive?.ROOMID
        if (!roomID) {
            this.logger.error('获取用户信息出错', 'roomID 不存在')
            return Promise.reject('roomID 不存在')
        }
        const EmotionData: BiliAPIResponse.GetEmoticons.EmoticonPackage[] = []
        try {
            const response = await BILIAPI.getEmoticons('pc', roomID)
            if (response.code === 0) {
                this.logger.log('EmotionData', response)
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

    private async getInfoByUser() {
        const roomID = useBiliStore().BilibiliLive?.ROOMID
        if (!roomID) {
            this.logger.error('获取用户信息出错', 'roomID 不存在')
            return Promise.reject('roomID 不存在')
        }
        try {
            const response = await BILIAPI.getInfoByUser(roomID)
            if (response.code === 0) {
                this.logger.log('infoByuser', response)
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

    public async run(): Promise<void> {
        useBiliStore().BilibiliLive = await this.getWindowBiliLive()
        if (useBiliStore().BilibiliLive) {
            useBiliStore().emotionData = await this.getEmotionData()
        }
        useBiliStore().loginInfo = await this.getLoginInfo()
        useBiliStore().infoByuser = await this.getInfoByUser()
    }
}

export default UserInfo
