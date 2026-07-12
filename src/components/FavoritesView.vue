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
    useDialog,
    NSwitch,
    NTimeline,
    NTimelineItem
} from 'naive-ui'
import _ from 'lodash'
import { useModuleStore } from '@/stores/useModuleStore'
import { useUIStore } from '@/stores/useUIStore'
import { useBiliStore } from '@/stores/useBiliStore'
import { updateSaveSpamerStatusList } from '@/utils/ui'
import { getDanmakuLength } from '@/utils/danmaku'
import stop from '@/modules/Spamer/textSpamer'

const moduleStore = useModuleStore()
const uiStore = useUIStore()
const biliStore = useBiliStore()
const message = useMessage()
const dialog = useDialog()
const favStop = new stop('StopFavoritesSpamer')

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
            msg: '',
            enabled: false,
            timeinterval: 5,
            timeintervalMax: 5,
            randomize: false
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
                const panel = _.find(moduleStore.moduleConfig.Favorites.favoritesTabPanels, {
                    name
                })
                if (panel) {
                    _.remove(
                        moduleStore.moduleConfig.Favorites.enabledOrder,
                        (k) => k === panel.key
                    )
                }
                _.remove(moduleStore.moduleConfig.Favorites.favoritesTabPanels, { name })
                moduleStore.moduleConfig.Favorites.favoritesTabsValue = name - 1
            }
        })
    }
}
const handleStartSpamer = () => {
    const enabledPanels = enabledPanelsInOrder.value

    if (enabledPanels.length === 0) {
        message.error('没有加入序列的弹幕组')
        return
    }

    const panelsWithEmptyMsg = _.filter(enabledPanels, (p) => _.isEmpty(p.msg))
    if (!_.isEmpty(panelsWithEmptyMsg)) {
        _.forEach(panelsWithEmptyMsg, (p) => {
            message.error(`${p.tab || '(未命名)'}还没填内容呢`)
        })
        return
    }

    const panelsWithBadInterval = _.filter(enabledPanels, (p) => {
        return (
            p.timeinterval === null ||
            p.timeinterval === undefined ||
            (p.randomize &&
                (p.timeintervalMax === null ||
                    p.timeintervalMax === undefined ||
                    p.timeintervalMax < p.timeinterval))
        )
    })
    if (!_.isEmpty(panelsWithBadInterval)) {
        _.forEach(panelsWithBadInterval, (p) => {
            message.error(`${p.tab || '(未命名)'}的时间间隔设置有误`)
        })
        return
    }

    uiStore.uiConfig.isShowPanel = false
    moduleStore.moduleConfig.Favorites.enable = true
    moduleStore.emitter.emit('Favorites', { module: 'Favorites' })
    updateSaveSpamerStatusList(
        biliStore.BilibiliLive?.ROOMID,
        'Favorites',
        true,
        biliStore.masterInfo?.info?.uname
    )
}
const handleStopSpamer = () => {
    favStop.stop('favorites')
    updateSaveSpamerStatusList(biliStore.BilibiliLive?.ROOMID, 'Favorites', false)
}
const handleEnableToggle = (value: boolean, key: number) => {
    const order = moduleStore.moduleConfig.Favorites.enabledOrder
    if (value) {
        if (!order.includes(key)) order.push(key)
    } else {
        _.remove(order, (k) => k === key)
    }
}

const enabledPanelsInOrder = computed(() => {
    const panels = moduleStore.moduleConfig.Favorites.favoritesTabPanels
    const order = moduleStore.moduleConfig.Favorites.enabledOrder
    return order
        .map((key) => panels.find((p) => p.key === key))
        .filter((p): p is NonNullable<typeof p> => !!p && p.enabled)
})

const getTimelineColor = (key: number) => {
    const hue = (key * 137.508) % 360
    return `hsl(${hue}, 65%, 55%)`
}

const handleClearAllSequence = () => {
    moduleStore.moduleConfig.Favorites.favoritesTabPanels.forEach((p) => {
        p.enabled = false
    })
    moduleStore.moduleConfig.Favorites.enabledOrder = []
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
</script>

<template>
    <n-form :disabled="moduleStore.moduleConfig.Favorites.enable">
        <n-page-header
            subtitle="收藏夹：这是一个收藏夹，当然你也可以车收藏夹😊"
            style="margin-bottom: 10px"
        />
        <n-form-item id="controlpanel" label="收藏夹发送序列">
            <div style="overflow-x: auto; padding-bottom: 4px">
                <n-timeline horizontal v-if="enabledPanelsInOrder.length > 0">
                <n-timeline-item
                    v-for="panels in enabledPanelsInOrder"
                    :key="panels.key"
                    :color="getTimelineColor(panels.key)"
                    :title="panels.tab || '(未命名)'"
                    :content="panels.randomize && panels.timeintervalMax > panels.timeinterval
                        ? `随机时间间隔: ${panels.timeinterval}-${panels.timeintervalMax}秒`
                        : `时间间隔：${panels.timeinterval}秒`"
                />
            </n-timeline>
            </div>
        </n-form-item>
        <n-form-item :show-feedback="false" :show-label="false" id="favpanel">
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
                    <n-form-item :show-label="false">
                        <n-flex align="center">
                            <n-form-item
                                label="标题，用于区分不同的弹幕组"
                                show-require-mark
                                :validation-status="panels.tab === '' ? 'error' : undefined"
                            >
                                <n-input
                                    v-model:value="panels.tab"
                                    clearable
                                    placeholder="最好写一下标题吧"
                                    style="width: 240px"
                                />
                            </n-form-item>
                            <n-form-item label="加入序列">
                                <n-popover trigger="hover" placement="bottom">
                                    <template #trigger>
                                        <n-switch
                                            v-model:value="panels.enabled"
                                            @update:value="
                                                (val: boolean) =>
                                                    handleEnableToggle(val, panels.key)
                                            "
                                        />
                                    </template>
                                    <span>开启后该弹幕组将加入独轮车发送序列</span>
                                </n-popover>
                            </n-form-item>
                            <template v-if="panels.enabled">
                                <n-form-item label="随机时间">
                                    <n-popover trigger="hover" placement="bottom">
                                        <template #trigger>
                                            <n-switch v-model:value="panels.randomize" />
                                        </template>
                                        <span>开启后在最小和最大时间间隔范围内随机发送</span>
                                    </n-popover>
                                </n-form-item>
                                <n-form-item
                                    show-require-mark
                                    :label="panels.randomize ? '最小间隔' : '间隔'"
                                >
                                    <n-popover trigger="hover" placement="bottom">
                                        <template #trigger>
                                            <n-input-number
                                                clearable
                                                :show-button="false"
                                                v-model:value="panels.timeinterval"
                                                placeholder="5"
                                                min="1"
                                                :precision="0"
                                                style="width: 100px"
                                                @update:value="(val: number | null) => { if (val !== null && panels.timeintervalMax < val) panels.timeintervalMax = val }"
                                            >
                                                <template #suffix> 秒 </template>
                                            </n-input-number>
                                        </template>
                                        <span>该弹幕组的发送时间间隔，默认为5秒</span>
                                    </n-popover>
                                </n-form-item>
                                <n-form-item
                                    v-if="panels.randomize"
                                    show-require-mark
                                    label="最大间隔"
                                >
                                    <n-popover trigger="hover" placement="bottom">
                                        <template #trigger>
                                            <n-input-number
                                                clearable
                                                :show-button="false"
                                                v-model:value="panels.timeintervalMax"
                                                placeholder="5"
                                                min="1"
                                                :precision="0"
                                                style="width: 100px"
                                                @update:value="(val: number | null) => { if (val !== null && val < panels.timeinterval) panels.timeinterval = val }"
                                            >
                                                <template #suffix> 秒 </template>
                                            </n-input-number>
                                        </template>
                                        <span>最大时间间隔，与最小相同时不随机</span>
                                    </n-popover>
                                </n-form-item>
                            </template>
                        </n-flex>
                    </n-form-item>
                    <n-form-item
                        label="内容"
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
                            rows="5"
                        >
                            <template #count="{ value }">
                                {{ getDanmakuLength(value ?? '') }}
                            </template>
                        </n-input>
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
            <n-button round type="warning" :focusable="false" @click="handleClearAllSequence">清除序列</n-button>
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
