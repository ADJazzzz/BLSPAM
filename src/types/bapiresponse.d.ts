import { LiveInfoData, UserData } from './bapidata'

declare namespace Response {
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
    interface Nav {
        code: number
        message: string
        ttl: number
        data: UserData.Nav.Data
    }

    interface AxiosResponse {
        config: any
        data: SendMsg | GetEmoticons | Nav
        headers: any
        status: number
        statusText: string
    }
}

export { Response }
