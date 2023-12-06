import { LiveResponse, UserResponse } from './bapiresponse'

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
    ) => Promise<LiveResponse.SendMsg>
    sendEmotion: (
        msg: string,
        roomid: number,
        color?: number,
        mode?: number,
        dm_type?: number,
        fontsize?: number,
        bubble?: number
    ) => Promise<LiveResponse.SendMsg>
    getEmoticons: (platform: string, room_id: number) => Promise<LiveResponse.GetEmoticons>
    nav: () => Promise<UserResponse.Nav>
}

export { BApiMethod }
