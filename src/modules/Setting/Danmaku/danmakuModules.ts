import { h, render, Fragment } from 'vue'
import { NButton, NIcon, NConfigProvider, lightTheme, darkTheme } from 'naive-ui'
import { dq } from '@/utils/dom'
import { BILIAPI } from '@/utils/bili'
import { useDiscreteAPI } from '@/utils/ui'
import { useBiliStore } from '@/stores/useBiliStore'
import { useUIStore } from '@/stores/useUIStore'
import PlusIcon from './assets/PlusIcon.svg?component'
import CopyIcon from './assets/CopyIcon.svg?component'
import BaseModule from '@/modules/BaseModule'

class danmakuModules extends BaseModule {
    config = this.moduleStore.moduleConfig.setting.danmakuModules

    private async dmOB() {
        const dmArea = dq('.chat-items')
        if (dmArea) {
            new MutationObserver((mutationsList) => {
                mutationsList.forEach((mutationsList) => {
                    Array.from(mutationsList.addedNodes).forEach((node) => {
                        if (
                            node instanceof HTMLElement &&
                            node.classList.contains('chat-item') &&
                            node.classList.contains('danmaku-item') &&
                            // 白字
                            (node.classList.length === 2 ||
                                // 舰长提督总督
                                (node.classList.contains('chat-colorful-bubble') &&
                                    node.classList.contains('has-bubble') &&
                                    node.classList.length === 4) ||
                                // 富哥
                                (node.classList.contains('has-bubble') &&
                                    node.classList.length === 3))
                        ) {
                            if (this.config.mode === 'menu') {
                                const msg = node.dataset.danmaku || ''
                                node.addEventListener('click', () => this.renderMenu(msg))
                            } else {
                                this.renderDirectly(node)
                            }
                        }
                    })
                })
            }).observe(dmArea, { childList: true, subtree: false })
        }
    }

    private renderDirectly(node: HTMLElement) {
        const msg = node.dataset.danmaku || ''

        const msgEle = node.querySelector('.danmaku-item-right')
        if (!msgEle) return
        const btnContainer = document.createElement('div')
        btnContainer.style.cssText = 'display: inline-block; vertical-align: middle;'
        msgEle.after(btnContainer)

        render(
            h(
                NConfigProvider,
                {
                    theme: useUIStore().uiConfig.theme === 'dark' ? darkTheme : lightTheme,
                    themeOverrides: {
                        Button: {
                            textColorHover: '#409eff',
                            textColorFocus: '#409eff',
                            textColorTextHover: '#409eff',
                            textColorTextFocus: '#409eff'
                        }
                    },
                    style: { marginLeft: '2px', paddingTop: '4px' }
                },
                {
                    default: () =>
                        h(Fragment, [
                            h(
                                NButton,
                                {
                                    text: true,
                                    focusable: false,
                                    bordered: false,
                                    style: {
                                        marginLeft: '2px'
                                    },
                                    onClick: (e: MouseEvent) => {
                                        e.stopPropagation()
                                        this.dmCopy(msg)
                                    }
                                },
                                { default: () => h(NIcon, { component: CopyIcon, size: 16 }) }
                            ),
                            h(
                                NButton,
                                {
                                    text: true,
                                    focusable: false,
                                    bordered: false,
                                    onClick: (e: MouseEvent) => {
                                        e.stopPropagation()
                                        this.dmRepeat(msg)
                                    }
                                },
                                { default: () => h(NIcon, { component: PlusIcon, size: 16 }) }
                            )
                        ])
                }
            ),
            btnContainer
        )
    }

    private renderMenu(msg: string) {
        const dmMenu = dq('.danmaku-menu.p-fixed.ts-dot-4.a-move-in-top.p-relative.z-danmaku-menu')
        if (dmMenu) {
            dmMenu.querySelectorAll('.none-select').forEach((element) => {
                if (!element.querySelector('.dm-repeat')) {
                    const dmRepeat = document.createElement('div')
                    dmRepeat.style.cursor = 'pointer'
                    dmRepeat.style.padding = 10 + 'px'
                    dmRepeat.addEventListener('click', () => this.dmRepeat(msg))
                    dmRepeat.classList.add('dm-repeat')

                    const ATag = document.createElement('a')
                    ATag.style.color = '#23ade5'
                    ATag.innerText = '弹幕+1'

                    dmRepeat.appendChild(ATag)
                    element.appendChild(dmRepeat)
                }

                if (!element.querySelector('.danmaku-copy')) {
                    const danmakuCopy = document.createElement('div')
                    danmakuCopy.style.cursor = 'pointer'
                    danmakuCopy.style.padding = 10 + 'px'
                    danmakuCopy.addEventListener('click', () => this.dmCopy(msg))
                    danmakuCopy.classList.add('danmaku-copy')

                    const ATag = document.createElement('a')
                    ATag.style.color = '#23ade5'
                    ATag.innerText = '弹幕复制'

                    danmakuCopy.appendChild(ATag)
                    element.appendChild(danmakuCopy)
                }
            })

            new MutationObserver((mutationsList, observer) => {
                mutationsList.forEach((mutation) => {
                    if (mutation.attributeName === 'style') {
                        if ((dmMenu as HTMLElement).style.display === 'none') {
                            dmMenu
                                .querySelectorAll('.dm-repeat, .danmaku-copy')
                                .forEach((element) => {
                                    element.remove()
                                    observer.disconnect()
                                })
                        }
                    }
                })
            }).observe(dmMenu, { attributes: true, attributeFilter: ['style'] })
        }
    }

    private async dmRepeat(msg: string) {
        const roomid = useBiliStore().BilibiliLive?.ROOMID
        if (roomid) {
            try {
                const response = await BILIAPI.sendMsg(msg, roomid)
                const { message, notification } = useDiscreteAPI(['message', 'notification'])
                if (response.code === 0) {
                    this.logger.log(`弹幕 ${msg} 发送成功`, response)
                    message.success(`弹幕 ${msg} 发送成功`, { duration: 2500 })
                } else {
                    this.logger.error(`弹幕 ${msg} 发送失败`, response)
                    notification.error({
                        closable: false,
                        content: `弹幕"${msg}"发送失败: ${response.message}`,
                        duration: 3000
                    })
                }
            } catch (error) {
                this.logger.error(`弹幕 ${msg} 发送失败`, error)
            }
        }
    }

    private async dmCopy(msg: string) {
        try {
            await navigator.clipboard.writeText(msg)
            const { message } = useDiscreteAPI(['message'])
            message.success(`弹幕 ${msg} 已复制`, { duration: 2500 })
        } catch (error) {
            this.logger.log('复制到剪切板失败', error)
        }
    }

    public async run() {
        if (this.config.enable) {
            this.dmOB()
        }
    }
}

export default danmakuModules
