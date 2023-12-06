import { LiveInfoData, UserData } from './bapidata'

declare namespace LiveResponse {
    interface SendMsg {
        code: number
        data: LiveInfoData.SendMsg.Data
        message: string
        msg: string
    }

    interface GetEmoticons {
        code: number
        message: string
        ttl: number
        data: LiveInfoData.GetEmoticons.Data
    }
}

declare namespace UserResponse {
    interface Nav {
        code: number
        message: string
        ttl: number
        data: UserData.Nav.Data
    }
}

export { LiveResponse, UserResponse }
