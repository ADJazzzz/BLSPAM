<script setup lang="ts">
import { computed } from 'vue'
import {
    NForm,
    NFormItem,
    NFlex,
    NPopover,
    NInputNumber,
    NInput,
    NTabs,
    NTabPane,
    NButton,
    NPageHeader,
    useMessage,
    useDialog
} from 'naive-ui'
import _ from 'lodash'
import { useModuleStore } from '@/stores/useModuleStore'
import { useUIStore } from '@/stores/useUIStore'
import stop from '@/modules/Spamer/textSpamer'

const moduleStore = useModuleStore()
const uiStore = useUIStore()
const message = useMessage()
const dialog = useDialog()
const favStop = new stop('StopFavoritesSpamer')

const rules = {
    timeinterval: {
        required: true,
        message: '最小为1',
        trigger: ['input', 'blur'],
        validator: () => {
            return moduleStore.moduleConfig.Favorites.timeinterval !== null
        }
    }
}
const handleTabsValueUpdate = (value: number) => {
    moduleStore.moduleConfig.Favorites.favoritesTabsValue = value
}
const closeDisable = computed(() => {
    return moduleStore.moduleConfig.Favorites.favoritesTabPanels.length > 1
})
const handleTabsAdd = () => {
    if (moduleStore.moduleConfig.Favorites.enable) {
        message.error('停车后才能添加')
    } else {
        const newKey =
            Math.max(
                ...moduleStore.moduleConfig.Favorites.favoritesTabPanels.map((panels) => panels.key)
            ) + 1
        const newName =
            Math.max(
                ...moduleStore.moduleConfig.Favorites.favoritesTabPanels.map(
                    (panels) => panels.name
                )
            ) + 1
        moduleStore.moduleConfig.Favorites.favoritesTabPanels.push({
            key: newKey,
            name: newName,
            tab: '',
            msg: ''
        })
        moduleStore.moduleConfig.Favorites.favoritesTabsValue = newName
    }
}
const handleTabsClose = (name: number) => {
    if (moduleStore.moduleConfig.Favorites.enable) {
        message.error('停车后才能删除')
    } else {
        dialog.warning({
            title: '删除',
            content: '确定要删除吗？',
            positiveText: '确定',
            negativeText: '再想想',
            onPositiveClick: () => {
                _.remove(moduleStore.moduleConfig.Favorites.favoritesTabPanels, { name })
                moduleStore.moduleConfig.Favorites.favoritesTabsValue = name - 1
            }
        })
    }
}
const handleStartSpamer = () => {
    const currentPanel = moduleStore.moduleConfig.Favorites.favoritesTabPanels.find(
        (panel) => panel.name === moduleStore.moduleConfig.Favorites.favoritesTabsValue
    )

    if (!currentPanel) {
        message.error('未找到当前标签页')
        return
    }

    if (_.isEmpty(currentPanel.msg)) {
        message.error(`${currentPanel.tab || '当前标签页'}还没填内容呢`)
        return
    }

    if (moduleStore.moduleConfig.Favorites.timeinterval === null) {
        message.error('没参数你车什么?')
    } else {
        uiStore.uiConfig.isShowPanel = false
        moduleStore.moduleConfig.Favorites.enable = true
        moduleStore.emitter.emit('Favorites', {
            module: 'Favorites'
        })
    }
}
const handleStopSpamer = () => {
    favStop.stop('favorites')
}
const handleSendToText = () => {
    const currentTabValue = moduleStore.moduleConfig.Favorites.favoritesTabsValue
    const currentPanel = moduleStore.moduleConfig.Favorites.favoritesTabPanels.find(
        (panel) => panel.name === currentTabValue
    )
    if (currentPanel) {
        if (!_.isEmpty(currentPanel.msg)) {
            moduleStore.moduleConfig.TextSpam.msg = currentPanel.msg
            uiStore.uiConfig.activeMenuIndex = 'TextView'
        } else {
            message.error('没有内容发什么')
        }
    } else {
        message.error('未找到当前标签页')
    }
}

const toggleStorytellerMode = () => {
    moduleStore.moduleConfig.Favorites.storytellerMode =
        !moduleStore.moduleConfig.Favorites.storytellerMode
}

const toggleSequentialMode = () => {
    moduleStore.moduleConfig.Favorites.sequentialMode =
        !moduleStore.moduleConfig.Favorites.sequentialMode
}
</script>

<template>
    <n-form :rules="rules" :disabled="moduleStore.moduleConfig.Favorites.enable">
        <n-page-header
            subtitle="收藏夹：这是一个收藏夹，当然你也可以车收藏夹😊"
            style="margin-bottom: 10px"
        />
        <n-form-item :show-label="false">
            <n-flex>
                <n-form-item label="时间间隔" path="timeinterval">
                    <n-popover trigger="hover" style="max-width: 300px" placement="bottom">
                        <template #trigger>
                            <n-input-number
                                clearable
                                :show-button="false"
                                v-model:value="moduleStore.moduleConfig.Favorites.timeinterval"
                                placeholder="默认5，单位为秒"
                                min="1"
                                :precision="0"
                            >
                                <template #suffix> 秒 </template>
                            </n-input-number>
                        </template>
                        <span
                            >弹幕发送时间间隔，默认为5秒，也是b站最快的发弹幕频率，当然这里可以设置小于该值</span
                        >
                    </n-popover>
                </n-form-item>
            </n-flex>
        </n-form-item>

        <n-form-item :show-label="false">
            <n-flex align="center" style="gap: 8px; width: 100%">
                <button
                    type="button"
                    :disabled="moduleStore.moduleConfig.Favorites.enable"
                    @click="toggleStorytellerMode"
                    :style="{
                        padding: '4px 10px',
                        borderRadius: '999px',
                        border: '1px solid #bfbfbf',
                        cursor: moduleStore.moduleConfig.Favorites.enable ? 'not-allowed' : 'pointer',
                        color: moduleStore.moduleConfig.Favorites.storytellerMode ? '#fff' : '#333',
                        backgroundColor: moduleStore.moduleConfig.Favorites.storytellerMode
                            ? '#18a058'
                            : '#fff'
                    }"
                >
                    说书模式 {{ moduleStore.moduleConfig.Favorites.storytellerMode ? '开' : '关' }}
                </button>
                <button
                    type="button"
                    :disabled="moduleStore.moduleConfig.Favorites.enable"
                    @click="toggleSequentialMode"
                    :style="{
                        padding: '4px 10px',
                        borderRadius: '999px',
                        border: '1px solid #bfbfbf',
                        cursor: moduleStore.moduleConfig.Favorites.enable ? 'not-allowed' : 'pointer',
                        color: moduleStore.moduleConfig.Favorites.sequentialMode ? '#fff' : '#333',
                        backgroundColor: moduleStore.moduleConfig.Favorites.sequentialMode
                            ? '#18a058'
                            : '#fff'
                    }"
                >
                    按顺序发送 {{ moduleStore.moduleConfig.Favorites.sequentialMode ? '开' : '关' }}
                </button>
                <span style="font-size: 12px; color: #909399"
                    >提示：运行中修改开关不会立即生效，下次点击“开车”生效</span
                >
            </n-flex>
        </n-form-item>

        <n-form-item :show-feedback="false" :show-label="false">
            <n-tabs
                type="card"
                v-model:value="moduleStore.moduleConfig.Favorites.favoritesTabsValue"
                @update:value="handleTabsValueUpdate"
                addable
                :closable="closeDisable"
                @add="handleTabsAdd"
                @close="handleTabsClose"
            >
                <n-tab-pane
                    v-for="panels in moduleStore.moduleConfig.Favorites.favoritesTabPanels"
                    :key="panels.key"
                    :name="panels.name"
                    :tab="panels.tab"
                >
                    <n-form-item
                        label="标题，用于区分不同的弹幕组"
                        show-require-mark
                        :validation-status="panels.tab === '' ? 'error' : undefined"
                    >
                        <n-input
                            v-model:value="panels.tab"
                            clearable
                            placeholder="最好写一下标题吧"
                        />
                    </n-form-item>
                    <n-form-item
                        label="发送内容"
                        show-require-mark
                        :validation-status="panels.msg === '' ? 'error' : undefined"
                    >
                        <n-input
                            v-model:value="panels.msg"
                            round
                            clearable
                            show-count
                            type="textarea"
                            placeholder="默认每次弹幕发送字数为你文字独轮车设置的间隔，超出相应值将自动分割到下一条弹幕"
                        />
                    </n-form-item>
                </n-tab-pane>
            </n-tabs>
        </n-form-item>
        <n-flex
            justify="end"
            style="margin-top: 10px"
            v-if="!moduleStore.moduleConfig.Favorites.enable"
        >
            <n-button round type="info" @click="handleSendToText">发送到文字独轮车</n-button>
            <n-button round @click="uiStore.uiConfig.isShowPanel = false">取消</n-button>
            <n-button round type="primary" @click="handleStartSpamer">开车</n-button>
        </n-flex>
        <n-flex
            justify="end"
            style="margin-top: 10px"
            v-if="moduleStore.moduleConfig.Favorites.enable"
        >
            <n-button round @click="uiStore.uiConfig.isShowPanel = false">取消</n-button>
            <n-button round type="error" @click="handleStopSpamer">停车</n-button>
        </n-flex>
    </n-form>
</template>

