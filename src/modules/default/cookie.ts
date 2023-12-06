import { useBiliStore } from '../../stores/useBiliStore'
import { BiliCookies } from '../../types/'
import BaseModule from '../BaseModule'

class Cookies extends BaseModule {
    private getCookiesValue(): Promise<BiliCookies> {
        return new Promise<BiliCookies>((resolve, reject) => {
            const cookieNames = ['bili_jct', 'LIVE_BUVID']
            const cookieValues: Partial<BiliCookies> = {}

            const cookies = document.cookie.split(';')
            for (const cookie of cookies) {
                const [name, value] = cookie.trim().split('=')
                if (cookieNames.includes(name)) {
                    cookieValues[name as keyof BiliCookies] = value
                }
            }

            if (Object.keys(cookieValues).length === cookieNames.length) {
                resolve(cookieValues as BiliCookies)
            } else {
                reject(new Error(`没找到所有的cookies`))
            }
        })
    }

    public async run(): Promise<void> {
        useBiliStore().cookies = await this.getCookiesValue()
    }
}

export default Cookies
