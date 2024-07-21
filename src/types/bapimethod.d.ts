import { LiveResponse, UserResponse, AxiosResponse } from './bapiresponse'

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
    ) => Promise<LiveResponse.SendMsg | AxiosResponse>
    sendEmotion: (
        msg: string,
        roomid: number,
        color?: number,
        mode?: number,
        dm_type?: number,
        fontsize?: number,
        bubble?: number
    ) => Promise<LiveResponse.SendMsg | AxiosResponse>
    getEmoticons: (
        platform: string,
        room_id: number
    ) => Promise<LiveResponse.GetEmoticons | AxiosResponse>
    nav: () => Promise<UserResponse.Nav | AxiosResponse>
}

export { BApiMethod }
