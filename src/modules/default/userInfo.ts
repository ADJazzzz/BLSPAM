import { BILIAPI } from '@/utils/bili'
import { useBiliStore } from '../../stores/useBiliStore'
import { useModuleStore } from '@/stores/useModuleStore'
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

    private syncTextIntervalWithDanmuLimit(limit: number | null): void {
        if (!limit || limit < 1) {
            return
        }

        const moduleStore = useModuleStore()
        const currentInterval = moduleStore.moduleConfig.TextSpam.textinterval

        if (currentInterval === 20 || currentInterval < 1 || currentInterval > limit) {
            moduleStore.moduleConfig.TextSpam.textinterval = limit
        }
    }

    public async run(): Promise<void> {
        const biliStore = useBiliStore()

        biliStore.BilibiliLive = await this.getWindowBiliLive()
        if (biliStore.BilibiliLive) {
            biliStore.emotionData = await this.getEmotionData()
        }

        biliStore.loginInfo = await this.getLoginInfo()
        biliStore.infoByuser = await this.getInfoByUser()

        const roomID = biliStore.BilibiliLive?.ROOMID
        let danmuLengthLimit = biliStore.infoByuser?.property.danmu.length ?? null

        if (roomID) {
            try {
                danmuLengthLimit = await BILIAPI.getCurrentUserDanmuLengthLimit(roomID)
            } catch (error) {
                this.logger.warn('获取当前用户弹幕字数上限失败，回退到 getInfoByUser', error)
            }
        }

        biliStore.danmuLengthLimit = danmuLengthLimit
        this.syncTextIntervalWithDanmuLimit(danmuLengthLimit)
    }
}

export default UserInfo
