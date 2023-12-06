import axios from 'axios'
import { useBiliStore } from '../../stores/useBiliStore'
import { BApiMethod, BiliCookies } from '../../types'

axios.defaults.withCredentials = true

const BILIAPI: BApiMethod = {
    sendMsg: (
        msg,
        roomid,
        room_type = 0,
        mode = 1,
        jumpfrom = 0,
        fontsize = 25,
        color = 16777215,
        bubble = 0,
        reply_mid = 0
    ) => {
        const biliStore = useBiliStore()
        const bili_jct = (biliStore.cookies as BiliCookies).bili_jct
        const timestamp = (): number => Date.parse(new Date().toString()) / 1000
        return axios.post(
            'https://api.live.bilibili.com/msg/send',
            {
                msg,
                roomid,
                room_type,
                mode,
                jumpfrom,
                fontsize,
                color,
                bubble,
                reply_mid,
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
        color = 16777215,
        mode = 1,
        dm_type = 1,
        fontsize = 25,
        bubble = 0
    ) => {
        const biliStore = useBiliStore()
        const bili_jct = (biliStore.cookies as BiliCookies).bili_jct
        const timestamp = (): number => Date.parse(new Date().toString()) / 1000
        return axios.post(
            'https://api.live.bilibili.com/msg/send',
            {
                msg,
                roomid,
                color,
                mode,
                dm_type,
                fontsize,
                rnd: timestamp(),
                bubble,
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
