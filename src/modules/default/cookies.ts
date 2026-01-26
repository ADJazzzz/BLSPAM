import { useBiliStore } from '@/stores/useBiliStore'
import { BiliCookies } from '@/types'
import BaseModule from '../BaseModule'

class Cookies extends BaseModule {
    private getCookiesValue(): Promise<BiliCookies> {
        return new Promise<BiliCookies>((resolve, reject) => {
            const cookieNames = ['bili_jct']
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
                reject(this.logger.error('没有找到所需的 Cookie 值，请确保已登录。'))
            }
        })
    }

    public async run(): Promise<void> {
        useBiliStore().cookies = await this.getCookiesValue()
    }
}

export default Cookies
