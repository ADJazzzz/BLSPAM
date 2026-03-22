import { BILIAPI } from '@/utils/bili'
import { useBiliStore } from '@/stores/useBiliStore'
import { useUIStore } from '@/stores/useUIStore'
import { useModuleStore } from '@/stores/useModuleStore'
import { unsafeWindow } from '$'
import BaseModule from '../BaseModule'
import { BiliAPIResponse } from '@/types'
import Storage from '@/utils/storage'
import { watch } from 'vue'
import { getRoomStatusText, updateRoomInfoItem } from '@/utils/ui'

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

    private async getMasterInfo() {
        const uid = useBiliStore().BilibiliLive?.ANCHOR_UID
        if (!uid) {
            this.logger.error('获取主播信息出错', 'uid 不存在')
            return Promise.reject('uid 不存在')
        }
        try {
            const response = await BILIAPI.masterInfo(uid)
            if (response.code === 0) {
                this.logger.log('masterInfo', response)

                return Promise.resolve(response.data)
            } else {
                this.logger.error('获取主播信息出错', response.message)
                return Promise.reject(response.message)
            }
        } catch (error) {
            this.logger.error('获取主播信息出错', error)
            return Promise.reject(error)
        }
    }

    private updateRoomInfo(roomid: number, uname: string) {
        const moduleStore = useModuleStore()
        const uiStore = useUIStore()
        const latestUiConfig = Storage.getUiConfig()
        const roomInfo = Array.isArray(latestUiConfig.roomInfo) ? latestUiConfig.roomInfo : []
        const statusText = getRoomStatusText(moduleStore.moduleConfig)
        const nextRoomInfo = updateRoomInfoItem(roomInfo, {
            uname,
            roomid,
            statusText,
            updateTime: Date.now()
        })

        latestUiConfig.roomInfo = nextRoomInfo
        Storage.setUiConfig(latestUiConfig)
        uiStore.uiConfig.roomInfo = nextRoomInfo
    }

    private roomInfoStatusSync(roomid: number, uname: string) {
        this.updateRoomInfo(roomid, uname)

        const heartbeatTimer = window.setInterval(() => {
            this.updateRoomInfo(roomid, uname)
        }, Storage.roomInfoHeartbeatInterval)

        const stopHeartbeat = () => {
            window.clearInterval(heartbeatTimer)
        }

        window.addEventListener('beforeunload', stopHeartbeat, { once: true })
        window.addEventListener('pagehide', stopHeartbeat, { once: true })
        window.addEventListener('unload', stopHeartbeat, { once: true })

        const moduleStore = useModuleStore()
        watch(
            () => [
                moduleStore.moduleConfig.TextSpam.enable,
                moduleStore.moduleConfig.EmotionSpam.enable,
                moduleStore.moduleConfig.Favorites.enable
            ],
            () => {
                this.updateRoomInfo(roomid, uname)
            }
        )
    }

    private roomInfoCleanup(roomid: number) {
        const removeRoomInfo = () => {
            const uiConfig = Storage.getUiConfig()
            const currentRoomInfo = Array.isArray(uiConfig.roomInfo) ? uiConfig.roomInfo : []
            const roomInfo = currentRoomInfo.filter((item) => item.roomid !== roomid)

            if (roomInfo.length !== currentRoomInfo.length) {
                uiConfig.roomInfo = roomInfo
                Storage.setUiConfig(uiConfig)
            }
        }

        window.addEventListener('beforeunload', removeRoomInfo, { once: true })
        window.addEventListener('pagehide', removeRoomInfo, { once: true })
        window.addEventListener('unload', removeRoomInfo, { once: true })
    }

    public async run(): Promise<void> {
        useBiliStore().BilibiliLive = await this.getWindowBiliLive()
        if (useBiliStore().BilibiliLive) {
            useBiliStore().emotionData = await this.getEmotionData()
            useBiliStore().loginInfo = await this.getLoginInfo()
            useBiliStore().infoByuser = await this.getInfoByUser()
            useBiliStore().masterInfo = await this.getMasterInfo()
        }

        const roomID = useBiliStore().masterInfo?.room_id
        const uname = useBiliStore().masterInfo?.info?.uname
        if (uname && roomID) {
            this.roomInfoStatusSync(roomID, uname)
            this.roomInfoCleanup(roomID)
        }
    }
}

export default UserInfo
