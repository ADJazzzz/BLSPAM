<script setup lang="ts">
import { h, render } from 'vue'
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
import { dq, pollingQuery } from './utils/dom'
import { useUIStore } from './stores/useUIStore'
import { useBiliStore } from './stores/useBiliStore'
import { useModuleStore } from './stores/useModuleStore'
import AppIcon from './assets/AppIcon.svg?component'
import PanelMenu from './components/PanelMenu.vue'
import PanelContent from './components/PanelContent.vue'
import Logger from './utils/logger'
import { unsafeWindow, GM_addStyle } from '$'

const logger = new Logger('App')
const uiStore = useUIStore()
const moduleStore = useModuleStore()
uiStore.uiConfig.isShowPanel = false

const renderAppBtn = (ctrEleName: string, appStyle: object) => {
    pollingQuery(document, ctrEleName, 300, 1200, true).then((eleContent) => {
        const buttonNode = h(
            NButton,
            {
                class: 'blspam_app_btn',
                text: true,
                style: appStyle,
                focusable: false,
                bordered: false,
                onClick: () => {
                    if (!useBiliStore().loginInfo?.isLogin) {
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
                            offset: [-1, 2],
                            type:
                                moduleStore.moduleConfig.TextSpam.enable ||
                                moduleStore.moduleConfig.EmotionSpam.enable ||
                                moduleStore.moduleConfig.Favorites.enable
                                    ? 'success'
                                    : useBiliStore().loginInfo?.isLogin && useBiliStore().cookies
                                      ? 'info'
                                      : 'error'
                        },
                        {
                            default: () => h(NIcon, { component: AppIcon, size: 24 })
                        }
                    )
            }
        )
        render(buttonNode, eleContent)
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
        renderAppBtn('.icon-left-part', {
            marginLeft: '4px',
            display: 'inline-block'
        })
        observer.disconnect()
        logger.info('初始化完成')
    }
}).observe(document.body, { childList: true, subtree: true })
// n-config-provider 的 preflight-style-disabled 属性不知道为什么不生效，只能这样了
GM_addStyle(`
body { font-size: 12px }
`)
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
