import { createDiscreteApi, NButton } from 'naive-ui'
import { h } from 'vue'
import { GM_xmlhttpRequest, GM_info, unsafeWindow } from '$'
import { CheckUpdate } from '../../types'
import { useUIStore } from '../../stores/useUIStore'
import BaseModule from '../BaseModule'

class checkUpdate extends BaseModule {
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

    private async CheckUpdate() {
        const currentVersion = this.getCurrentVersion()
        const getGitHubAPI: CheckUpdate.GitHub.GithubAPI = (await this.getLatestVersionRes())
            .response

        if (currentVersion === getGitHubAPI.tag_name) {
            this.logger.log('当前版本已经是最新版本')
        } else if (currentVersion < getGitHubAPI.tag_name) {
            this.logger.log(`发现新版本：${getGitHubAPI.tag_name}`)
            const { notification } = createDiscreteApi(['notification'])
            if (useUIStore().uiConfig.isShowUpdateNotify) {
                notification.create({
                    title: `发现新版本：${getGitHubAPI.tag_name}`,
                    content: `发布于：${getGitHubAPI.published_at}`,
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
                            { default: () => '查看详情' }
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
                                    useUIStore().uiConfig.isShowUpdateNotify = false
                                    notification.destroyAll()
                                }
                            },
                            { default: () => '不再提醒' }
                        )
                    ]
                })
            }
        }
    }

    public async run() {
        this.CheckUpdate()
    }
}

export default checkUpdate
