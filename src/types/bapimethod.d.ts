import { Response } from './bapiresponse'

interface BApiMethod {
    sendMsg: (
        msg: string,
        room_id: number,
        room_type?: number,
        mode?: number,
        jumpfrom?: number,
        fontsize?: number,
        color?: number,
        bubble?: number,
        reply_mid?: number
    ) => Promise<Response.AxiosResponse>
    sendEmotion: (
        msg: string,
        roomid: number,
        color?: number,
        mode?: number,
        dm_type?: number,
        fontsize?: number,
        bubble?: number
    ) => Promise<Response.AxiosResponse>
    getEmoticons: (platform: string, room_id: number) => Promise<Response.AxiosResponse>
    nav: () => Promise<Response.AxiosResponse>
}

export { BApiMethod }
