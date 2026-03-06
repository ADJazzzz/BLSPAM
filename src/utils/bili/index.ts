import axios from 'axios'
import { useBiliStore } from '@/stores/useBiliStore'
import { BiliCookies } from '@/types'
import { BiliAPIResponse, BiliAPIMethods } from '@/types'

axios.defaults.withCredentials = true

export const BILIAPI: BiliAPIMethods = {
    sendMsg: async (
        msg,
        roomid,
        bubble = 0,
        color = 16777215,
        mode = 1,
        room_type = 0,
        jumpfrom = 0,
        reply_mid = 0,
        reply_attr = 0,
        replay_dmid = '',
        statistics = { appId: 100, platform: 5 },
        reply_type = 0,
        reply_uname = '',
        data_extend = { trackid: '-99998' },
        fontsize = 25
    ) => {
        const biliStore = useBiliStore()
        const bili_jct = (biliStore.cookies as BiliCookies).bili_jct
        const res = await axios.post<BiliAPIResponse.MsgSend.Response>(
            'https://api.live.bilibili.com/msg/send',
            {
                bubble,
                msg,
                color,
                mode,
                room_type,
                jumpfrom,
                reply_mid,
                reply_attr,
                replay_dmid,
                statistics,
                reply_type,
                reply_uname,
                data_extend,
                fontsize,
                rnd: Math.floor(Date.now() / 1000),
                roomid,
                csrf: bili_jct,
                csrf_token: bili_jct
            },
            {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }
        )
        return res.data
    },
    sendEmotion: async (
        msg,
        roomid,
        bubble = 0,
        color = 16777215,
        mode = 1,
        dm_type = 1,
        emoticonOptions = {},
        data_extend = { trackid: '-99998' },
        fontsize = 25
    ) => {
        const biliStore = useBiliStore()
        const bili_jct = (biliStore.cookies as BiliCookies).bili_jct
        const res = await axios.post<BiliAPIResponse.MsgSend.Response>(
            'https://api.live.bilibili.com/msg/send',
            {
                bubble,
                msg,
                color,
                mode,
                dm_type,
                emoticon_options: emoticonOptions,
                data_extend,
                fontsize,
                rnd: Math.floor(Date.now() / 1000),
                roomid,
                csrf: bili_jct,
                csrf_token: bili_jct
            },
            {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }
        )
        return res.data
    },
    getEmoticons: async (platform, room_id) => {
        const res = await axios.get<BiliAPIResponse.GetEmoticons.Response>(
            `https://api.live.bilibili.com/xlive/web-ucenter/v2/emoticon/GetEmoticons?platform=${platform}&room_id=${room_id}`
        )
        return res.data
    },
    getInfoByUser: async (room_id) => {
        const res = await axios.get<BiliAPIResponse.GetInfoByUser.Response>(
            `https://api.live.bilibili.com/xlive/web-room/v1/index/getInfoByUser?room_id=${room_id}`
        )
        return res.data
    },
    getCurrentUserDanmuLengthLimit: async (room_id) => {
        const res = await axios.get<BiliAPIResponse.GetInfoByUser.Response>(
            `https://api.live.bilibili.com/xlive/web-room/v1/index/getInfoByUser?room_id=${room_id}`
        )
        return res.data.data.property.danmu.length
    },
    nav: async () => {
        const res = await axios.get<BiliAPIResponse.Nav.Response>(
            'https://api.bilibili.com/x/web-interface/nav'
        )
        return res.data
    }
}




