import { LiveResponse, UserResponse, AxiosResponse } from './bapiresponse'

interface BApiMethod {
    sendMsg: (
        msg: string,
        room_id: number,
        bubble?: number,
        color?: number,
        mode?: number,
        room_type?: number,
        jumpfrom?: number,
        reply_mid?: number,
        reply_attr?: number,
        replay_dmid?: any,
        statistics?: { appId: number; platform: number },
        fontsize?: number
    ) => Promise<LiveResponse.SendMsg | AxiosResponse>
    sendEmotion: (
        msg: string,
        roomid: number,
        bubble?: number,
        color?: number,
        mode?: number,
        dm_type?: number,
        emoticonOptions?: any,
        fontsize?: number
    ) => Promise<LiveResponse.SendMsg | AxiosResponse>
    getEmoticons: (
        platform: string,
        room_id: number
    ) => Promise<LiveResponse.GetEmoticons | AxiosResponse>
    nav: () => Promise<UserResponse.Nav | AxiosResponse>
}

export { BApiMethod }
