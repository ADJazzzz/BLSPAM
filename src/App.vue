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
    NLayoutContent
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

const logger = new Logger('App')

const uiStore = useUIStore()
const moduleStore = useModuleStore()
uiStore.uiConfig.isShowPanel = false
// moduleStore.moduleConfig.TextSpam.enable = false
// moduleStore.moduleConfig.EmotionSpam.enable = false
// moduleStore.moduleConfig.TextGroupSpam.enable = false

const renderPanel = () => {
    pollingQuery(document, '.icon-left-part', 300, 300, true).then((controlPanelLeft) => {
        const buttonNode = h(
            NButton,
            {
                class: 'blspam_btn',
                text: true,
                style: { margin: '0 5px', fontSize: '20px', verticalAlign: 'middle' },
                tag: 'span',
                onClick: () => {
                    if (!useBiliStore().userInfo?.isLogin) {
                        uiStore.uiConfig.isShowPanel = false
                    } else {
                        uiStore.uiConfig.isShowPanel = true
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
                                h(NIcon, { component: MainIcon }, { default: () => null })
                        }
                    )
            }
        )

        render(buttonNode, controlPanelLeft)
    })
}

const handleCollapse = (collapsed: boolean) => {
    uiStore.uiConfig.isCollapsed = collapsed
}

const observer = new MutationObserver((mutationsList, observer) => {
    const controlPanel = dq('#control-panel-ctnr-box')
    if (controlPanel) {
        renderPanel()
        observer.disconnect()
        logger.log('初始化完成')
    }
})

observer.observe(document.body, { childList: true, subtree: true })
</script>

<template>
    <n-config-provider :locale="zhCN">
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
                            :on-update:collapsed="handleCollapse"
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
