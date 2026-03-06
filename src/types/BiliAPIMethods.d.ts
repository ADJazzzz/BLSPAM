import { BiliAPIResponse } from './BiliAPIResponse'

interface BiliAPIMethods {
    sendMsg: (
        msg: string,
        roomid: number,
        bubble?: number,
        color?: number,
        mode?: number,
        room_type?: number,
        jumpfrom?: number,
        reply_mid?: number,
        reply_attr?: number,
        replay_dmid?: any,
        statistics?: {
            appId: number
            platform: number
        },
        reply_type?: number,
        reply_uname?: string,
        data_extend?: {
            trackid: string
        },
        fontsize?: number
    ) => Promise<BiliAPIResponse.MsgSend.Response>
    sendEmotion: (
        msg: string,
        roomid: number,
        bubble?: number,
        color?: number,
        mode?: number,
        dm_type?: number,
        emoticonOptions?: any,
        data_extend?: {
            trackid: string
        },
        fontsize?: number
    ) => Promise<BiliAPIResponse.MsgSend.Response>
    getEmoticons: (
        platform: string,
        room_id: number
    ) => Promise<BiliAPIResponse.GetEmoticons.Response>
    getInfoByUser: (room_id: number) => Promise<BiliAPIResponse.GetInfoByUser.Response>
    getCurrentUserDanmuLengthLimit: (room_id: number) => Promise<number>
    nav: () => Promise<BiliAPIResponse.Nav.Response>
}

export { BiliAPIMethods }

