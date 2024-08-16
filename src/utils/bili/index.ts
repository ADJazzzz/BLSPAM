import axios from 'axios'
import { useBiliStore } from '../../stores/useBiliStore'
import { BApiMethod, BiliCookies } from '../../types'

axios.defaults.withCredentials = true

const BILIAPI: BApiMethod = {
    sendMsg: (
        msg,
        roomid,
        bubble = 0,
        color = 16777215,
        mode = 1,
        room_type = 0,
        jumpfrom = 0,
        reply_mid = 0,
        reply_attr = 0,
        reply_dmid = '',
        statistics = {appId: 100, platform: 5},
        fontsize = 25
    ) => {
        const biliStore = useBiliStore()
        const bili_jct = (biliStore.cookies as BiliCookies).bili_jct
        const timestamp = (): number => Date.parse(new Date().toString()) / 1000
        return axios.post(
            'https://api.live.bilibili.com/msg/send',
            {
                msg,
                roomid,
                bubble,
                color,
                mode,
                room_type,
                jumpfrom,
                reply_mid,
                reply_attr,
                reply_dmid,
                fontsize,
                statistics: JSON.stringify(statistics),
                rnd: timestamp(),
                csrf: bili_jct,
                csrf_token: bili_jct
            },
            {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }
        )
    },

    sendEmotion: (
        msg,
        roomid,
        bubble = 0,
        color = 16777215,
        mode = 1,
        dm_type = 1,
        fontsize = 25
    ) => {
        const biliStore = useBiliStore()
        const bili_jct = (biliStore.cookies as BiliCookies).bili_jct
        const timestamp = (): number => Date.parse(new Date().toString()) / 1000
        return axios.post(
            'https://api.live.bilibili.com/msg/send',
            {
                msg,
                roomid,
                bubble,
                color,
                mode,
                dm_type,
                fontsize,
                rnd: timestamp(),
                csrf: bili_jct,
                csrf_token: bili_jct
            },
            {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }
        )
    },

    async getEmoticons(platform = 'pc', room_id) {
        const res = await axios.get(
            `https://api.live.bilibili.com/xlive/web-ucenter/v2/emoticon/GetEmoticons?platform=${platform}&room_id=${room_id}`
        )
        return res.data
    },

    async nav() {
        const res = await axios.get('https://api.bilibili.com/x/web-interface/nav')
        return res.data
    }
}

export default BILIAPI
