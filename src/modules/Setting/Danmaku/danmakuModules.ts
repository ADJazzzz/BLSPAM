import { createDiscreteApi } from 'naive-ui'
import BaseModule from '../../BaseModule'
import { dq } from '../../../utils/dom'
import BILIAPI from '../../../utils/bili'
import { useBiliStore } from '../../../stores/useBiliStore'
import { AxiosResponse } from '../../../types'

class danmakuModules extends BaseModule {
    config = this.moduleStore.moduleConfig.setting.danmakuModules

    private async dmOB() {
        const dmArea = dq('.chat-items')
        if (dmArea) {
            new MutationObserver((mutationsList) => {
                mutationsList.forEach((mutationsList) => {
                    Array.from(mutationsList.addedNodes).forEach((node) => {
                        if (
                            (node instanceof HTMLElement &&
                                node.classList.contains('chat-item') &&
                                node.classList.contains('danmaku-item') &&
                                node.classList.length === 2) ||
                            (node instanceof HTMLElement &&
                                node.classList.contains('chat-item') &&
                                node.classList.contains('danmaku-item') &&
                                node.classList.contains('chat-colorful-bubble') &&
                                node.classList.contains('has-bubble') &&
                                node.classList.length === 4)
                        ) {
                            node.addEventListener('click', this.handleNodeClick.bind(this))
                        }
                    })
                })
            }).observe(dmArea, { childList: true, subtree: false })
        }
    }

    private handleNodeClick(event: Event) {
        const clickedElement = event.target
        if (
            clickedElement instanceof HTMLElement &&
            clickedElement.classList.contains('danmaku-item-right')
        ) {
            this.renderMenu(clickedElement.innerText)
        }
    }

    private renderMenu(msg: string) {
        const dmMenu = dq('.danmaku-menu.p-fixed.ts-dot-4.a-move-in-top.p-relative.z-danmaku-menu')
        if (dmMenu) {
            dmMenu.querySelectorAll('.none-select').forEach((element) => {
                if (!element.querySelector('.dm-repeat')) {
                    const dmRepeat = document.createElement('div')
                    dmRepeat.style.cursor = 'pointer'
                    dmRepeat.style.padding = 10 + 'px'
                    dmRepeat.classList.add('dm-repeat')

                    const ATag = document.createElement('a')
                    ATag.style.color = '#23ade5'
                    ATag.addEventListener('click', () => this.dmRepeat(msg))
                    ATag.innerText = '弹幕+1'
                    dmRepeat.appendChild(ATag)

                    element.appendChild(dmRepeat)
                }

                if (!element.querySelector('.danmaku-copy')) {
                    const danmakuCopy = document.createElement('div')
                    danmakuCopy.style.cursor = 'pointer'
                    danmakuCopy.style.padding = 10 + 'px'
                    danmakuCopy.classList.add('danmaku-copy')

                    const ATag = document.createElement('a')
                    ATag.style.color = '#23ade5'
                    ATag.addEventListener('click', () => this.dmCopy(msg))
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
                const response = (await BILIAPI.sendMsg(msg, roomid)) as AxiosResponse
                if (response.data.code === 0) {
                    this.logger.log(`弹幕 ${msg} 发送成功`, response)
                    const { message } = createDiscreteApi(['message'])
                    message.success(`弹幕 ${msg} 发送成功`, { duration: 2500 })
                } else {
                    this.logger.error(`弹幕 ${msg} 发送失败`, response)
                }
            } catch (error) {
                this.logger.error(`弹幕 ${msg} 发送失败`, error)
            }
        }
    }

    private async dmCopy(msg: string) {
        try {
            await navigator.clipboard.writeText(msg)
            const { message } = createDiscreteApi(['message'])
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
