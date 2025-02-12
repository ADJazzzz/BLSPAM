<script setup lang="ts">
import {
    NButton,
    NIcon,
    NBadge,
    NConfigProvider,
    NMessageProvider,
    NDialogProvider,
    zhCN,
    NModal,
    NLayout,
    NLayoutSider,
    NLayoutContent,
    darkTheme,
    lightTheme
} from 'naive-ui'
import { h, render } from 'vue'
import { dq, pollingQuery } from './utils/dom'
import { useUIStore } from './stores/useUIStore'
import { useBiliStore } from './stores/useBiliStore'
import { useModuleStore } from './stores/useModuleStore'
import MainIcon from './components/Icons/MainIcon.vue'
import PanelMenu from './components/PanelMenu.vue'
import PanelContent from './components/PanelContent.vue'
import Logger from './utils/logger'
import { GM_addStyle, unsafeWindow } from '$'

const logger = new Logger('App')

const uiStore = useUIStore()
const moduleStore = useModuleStore()
uiStore.uiConfig.isShowPanel = false

const renderPanel = (elementName: string, ctrStyle: object) => {
    pollingQuery(document, elementName, 300, 300, true).then((controlPanelContent) => {
        const buttonNode = h(
            NButton,
            {
                class: 'blspam_btn',
                text: true,
                tag: 'div',
                style: ctrStyle,
                focusable: false,
                bordered: false,
                onClick: () => {
                    if (!useBiliStore().userInfo?.isLogin) {
                        uiStore.uiConfig.isShowPanel = false
                    } else {
                        uiStore.uiConfig.isShowPanel = true
                        handleUpdateTheme()
                    }
                }
            },
            {
                default: () =>
                    h(
                        NBadge,
                        {
                            dot: true,
                            processing: true,
                            type:
                                moduleStore.moduleConfig.TextSpam.enable ||
                                moduleStore.moduleConfig.EmotionSpam.enable ||
                                moduleStore.moduleConfig.TextGroupSpam.enable
                                    ? 'success'
                                    : useBiliStore().userInfo?.isLogin
                                      ? 'info'
                                      : 'error'
                        },
                        {
                            default: () =>
                                h(NIcon, { component: MainIcon, size: 24 }, { default: () => null })
                        }
                    )
            }
        )

        render(buttonNode, controlPanelContent)
    })
}
const handleUpdateTheme = () => {
    const biliTheme = unsafeWindow.bililiveThemeV2.getTheme()
    uiStore.uiConfig.theme = biliTheme
}
const handleUpdateCollapse = (collapsed: boolean) => {
    uiStore.uiConfig.isCollapsed = collapsed
}

new MutationObserver((_mutationsList, observer) => {
    const controlPanel = dq('#control-panel-ctnr-box')
    if (controlPanel) {
        setTimeout(() => {
            const oldTheme = dq('.icon-left-part')
            const newTheme = dq('.chat-input-ctnr-new.p-relative')

            if (oldTheme || newTheme) {
                if (oldTheme) {
                    renderPanel('.icon-left-part', { marginLeft: '4px', display: 'inline-block' })
                }
                if (newTheme) {
                    renderPanel('.chat-input-ctnr-new.p-relative', {
                        marginRight: '4px',
                        alignSelf: 'center'
                    })
                }
            }
        }, 500)
        observer.disconnect()
        logger.log('初始化完成')
    }
}).observe(document.body, { childList: true, subtree: true })
// n-config-provider 的 preflight-style-disabled 属性不知道为什么不生效，只能这样了
GM_addStyle('body { font-size: 12px }')
</script>

<template>
    <!-- <n-config-provider :locale="zhCN" preflight-style-disabled> -->
    <n-config-provider
        :locale="zhCN"
        :theme="uiStore.uiConfig.theme === 'dark' ? darkTheme : lightTheme"
    >
        <n-message-provider>
            <n-dialog-provider>
                <n-modal v-model:show="uiStore.uiConfig.isShowPanel" style="max-width: 1200px">
                    <n-layout has-sider>
                        <n-layout-sider
                            bordered
                            show-trigger
                            collapse-mode="width"
                            :collapsed-width="64"
                            :width="240"
                            :native-scrollbar="false"
                            content-style="max-height: 320px; padding-top: 8px"
                            :collapsed="uiStore.uiConfig.isCollapsed"
                            :on-update:collapsed="handleUpdateCollapse"
                        >
                            <PanelMenu />
                        </n-layout-sider>
                        <n-layout-content content-style="padding: 24px;">
                            <PanelContent />
                        </n-layout-content>
                    </n-layout>
                </n-modal>
            </n-dialog-provider>
        </n-message-provider>
    </n-config-provider>
</template>
