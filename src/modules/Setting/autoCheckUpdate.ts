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

    public async CheckUpdate() {
        const currentVersion = this.getCurrentVersion()
        const getGitHubAPI: CheckUpdate.GitHub.GithubAPI = (await this.getLatestVersionRes())
            .response

        if (currentVersion === getGitHubAPI.tag_name) {
            this.logger.log('当前版本已经是最新版本')
        } else if (currentVersion < getGitHubAPI.tag_name) {
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
