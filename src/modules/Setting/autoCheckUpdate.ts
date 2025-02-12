import { createDiscreteApi, NButton } from 'naive-ui'
import { h } from 'vue'
import { GM_xmlhttpRequest, GM_info, unsafeWindow } from '$'
import { CheckUpdate } from '../../types'
import BaseModule from '../BaseModule'

class checkUpdate extends BaseModule {
    config = this.moduleStore.moduleConfig.setting.autoCheckUpdate

    private async getLatestVersionRes(): Promise<CheckUpdate.MonkeyXMLHttpRequest.MonkeyXMLHttpRequestResponse> {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                url: 'https://api.github.com/repos/ADJazzzz/BLSPAM/releases/latest',
                nocache: true,
                method: 'GET',
                responseType: 'json',
                onload: (res: CheckUpdate.MonkeyXMLHttpRequest.MonkeyXMLHttpRequestResponse) => {
                    resolve(res)
                },
                onerror: (res: CheckUpdate.MonkeyXMLHttpRequest.MonkeyXMLHttpRequestResponse) => {
                    reject(res)
                }
            })
        })
    }

    private getCurrentVersion(): string {
        return GM_info.script.version
    }

    private compareVersion(curVer: string, latVer: string): number {
        const curVerParts = curVer.split('.').map(Number)
        const latVerParts = latVer.split('.').map(Number)

        for (let i = 0; i < Math.max(curVerParts.length, latVerParts.length); i++) {
            const curVerPart = curVerParts[i] ?? 0
            const latVerPart = latVerParts[i] ?? 0

            if (curVerPart !== latVerPart) {
                return curVerPart > latVerPart ? 1 : -1
            }
        }

        return 0
    }

    public async CheckUpdate() {
        const currentVersion = this.getCurrentVersion()
        const getGitHubAPI: CheckUpdate.GitHub.GithubAPI = (await this.getLatestVersionRes())
            .response

        const compareRes = this.compareVersion(currentVersion, getGitHubAPI.tag_name)
        if (compareRes === 0) {
            this.logger.log('当前已是最新的版本')
        } else if (compareRes === -1) {
            this.logger.log(`发现新版本：${getGitHubAPI.tag_name}`)
            const { notification } = createDiscreteApi(['notification'])
            notification.create({
                title: `发现新版本：${getGitHubAPI.tag_name}`,
                action: () => [
                    h(
                        NButton,
                        {
                            text: true,
                            type: 'info',
                            style: 'margin-right: 10px',
                            onClick: () =>
                                unsafeWindow.open(
                                    'https://github.com/ADJazzzz/BLSPAM/blob/main/CHANGELOG.md'
                                )
                        },
                        { default: () => '查看更新日志' }
                    ),
                    h(
                        NButton,
                        {
                            text: true,
                            type: 'primary',
                            style: 'margin-right: 10px',
                            onClick: () =>
                                unsafeWindow.open(getGitHubAPI.assets[0].browser_download_url)
                        },
                        {
                            default: () => '安装'
                        }
                    ),
                    h(
                        NButton,
                        {
                            text: true,
                            type: 'error',
                            onClick: () => {
                                this.config.enable = false
                                notification.destroyAll()
                            }
                        },
                        { default: () => '关闭检测' }
                    )
                ]
            })
        }
    }

    public async run() {
        if (this.config.enable) {
            await this.CheckUpdate()
        }
    }
}

export default checkUpdate
