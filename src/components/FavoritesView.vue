<script setup lang="ts">
import { computed, ref, nextTick, onMounted, onUpdated, onBeforeUnmount } from 'vue'
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
import type { InputInst } from 'naive-ui'
import _ from 'lodash'
import { useModuleStore } from '@/stores/useModuleStore'
import { useUIStore } from '@/stores/useUIStore'
import stop from '@/modules/Spamer/textSpamer'

const moduleStore = useModuleStore()
const uiStore = useUIStore()
const message = useMessage()
const dialog = useDialog()
const favStop = new stop('StopFavoritesSpamer')

const favoritesMainInputRefs = ref<Record<number, InputInst | null>>({})
const favoritesPreviewInputRefs = ref<Record<number, InputInst | null>>({})
const favoritesOverlayStyles = ref<Record<number, Record<string, string>>>({})
const favoritesOverlayViewportStyles = ref<Record<number, Record<string, string>>>({})
const favoritesOverlayTransforms = ref<Record<number, string>>({})

const favoritesMainTextareas = new Map<number, HTMLTextAreaElement>()
const favoritesPreviewTextareas = new Map<number, HTMLTextAreaElement>()
const favoritesMainListeners = new Map<number, (event: Event) => void>()
const favoritesPreviewListeners = new Map<number, (event: Event) => void>()
const favoritesSyncing = new Set<number>()

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

const textintervalForPreview = computed(() => {
    return Math.max(1, Number(moduleStore.moduleConfig.TextSpam.textinterval || 1))
})

const getPreviewLines = (msg: string) => {
    const textinterval = textintervalForPreview.value
    return msg.split(/\r?\n/).map((line) => ({
        keep: line.slice(0, textinterval),
        overflow: line.slice(textinterval)
    }))
}

const setOverlayTransform = (panelName: number, scrollTop: number) => {
    favoritesOverlayTransforms.value[panelName] = `translateY(${-scrollTop}px)`
}

const updateOverlayStyle = (panelName: number) => {
    const mainTextarea = favoritesMainInputRefs.value[panelName]?.textareaElRef
    const mainWrapper = favoritesMainInputRefs.value[panelName]?.wrapperElRef
    const previewTextarea = favoritesPreviewInputRefs.value[panelName]?.textareaElRef
    const previewWrapper = favoritesPreviewInputRefs.value[panelName]?.wrapperElRef

    if (!mainTextarea || !mainWrapper || !previewTextarea || !previewWrapper) return

    const style = getComputedStyle(mainTextarea)
    const suffix = mainWrapper.querySelector('.n-input__suffix') as HTMLElement | null
    const suffixWidth = suffix?.offsetWidth ?? 0
    const suffixHeight = suffix?.offsetHeight ?? 0

    const previewHost = previewWrapper.closest('.preview-overlay-wrap') as HTMLElement | null
    if (previewHost) {
        const hostRect = previewHost.getBoundingClientRect()
        const textareaRect = previewTextarea.getBoundingClientRect()
        favoritesOverlayViewportStyles.value[panelName] = {
            top: `${textareaRect.top - hostRect.top}px`,
            left: `${textareaRect.left - hostRect.left}px`,
            width: `${textareaRect.width}px`,
            height: `${textareaRect.height}px`
        }
    }

    favoritesOverlayStyles.value[panelName] = {
        fontSize: style.fontSize,
        lineHeight: style.lineHeight,
        fontFamily: style.fontFamily,
        letterSpacing: style.letterSpacing,
        paddingTop: style.paddingTop,
        paddingRight: `calc(${style.paddingRight} + ${suffixWidth}px)`,
        paddingBottom: `calc(${style.paddingBottom} + ${suffixHeight}px)`,
        paddingLeft: style.paddingLeft,
        boxSizing: 'border-box'
    }
}

const syncMainToPreview = (event: Event, panelName: number) => {
    const target = event.target as HTMLTextAreaElement | null
    const preview = favoritesPreviewTextareas.get(panelName)

    if (!target || !preview || favoritesSyncing.has(panelName)) return

    favoritesSyncing.add(panelName)
    preview.scrollTop = target.scrollTop
    setOverlayTransform(panelName, target.scrollTop)
    requestAnimationFrame(() => {
        favoritesSyncing.delete(panelName)
    })
}

const syncPreviewToMain = (event: Event, panelName: number) => {
    const target = event.target as HTMLTextAreaElement | null
    const main = favoritesMainTextareas.get(panelName)

    if (!target || !main || favoritesSyncing.has(panelName)) return

    favoritesSyncing.add(panelName)
    main.scrollTop = target.scrollTop
    setOverlayTransform(panelName, target.scrollTop)
    requestAnimationFrame(() => {
        favoritesSyncing.delete(panelName)
    })
}

const bindPanelScroll = (panelName: number) => {
    const main = favoritesMainInputRefs.value[panelName]?.textareaElRef ?? null
    const preview = favoritesPreviewInputRefs.value[panelName]?.textareaElRef ?? null

    const currentMain = favoritesMainTextareas.get(panelName) ?? null
    if (main !== currentMain) {
        const oldMainListener = favoritesMainListeners.get(panelName)
        if (currentMain && oldMainListener) {
            currentMain.removeEventListener('scroll', oldMainListener)
        }
        favoritesMainTextareas.delete(panelName)
        favoritesMainListeners.delete(panelName)

        if (main) {
            const listener = (event: Event) => syncMainToPreview(event, panelName)
            main.addEventListener('scroll', listener, { passive: true })
            favoritesMainTextareas.set(panelName, main)
            favoritesMainListeners.set(panelName, listener)
        }
    }

    const currentPreview = favoritesPreviewTextareas.get(panelName) ?? null
    if (preview !== currentPreview) {
        const oldPreviewListener = favoritesPreviewListeners.get(panelName)
        if (currentPreview && oldPreviewListener) {
            currentPreview.removeEventListener('scroll', oldPreviewListener)
        }
        favoritesPreviewTextareas.delete(panelName)
        favoritesPreviewListeners.delete(panelName)

        if (preview) {
            preview.readOnly = true
            const listener = (event: Event) => syncPreviewToMain(event, panelName)
            preview.addEventListener('scroll', listener, { passive: true })
            favoritesPreviewTextareas.set(panelName, preview)
            favoritesPreviewListeners.set(panelName, listener)
        }
    }

    updateOverlayStyle(panelName)
    const currentScrollTop = main?.scrollTop ?? 0
    if (preview) {
        preview.scrollTop = currentScrollTop
    }
    setOverlayTransform(panelName, currentScrollTop)
}

const setMainInputRef = (panelName: number, inst: InputInst | null) => {
    favoritesMainInputRefs.value[panelName] = inst
    bindPanelScroll(panelName)
}

const setPreviewInputRef = (panelName: number, inst: InputInst | null) => {
    favoritesPreviewInputRefs.value[panelName] = inst
    bindPanelScroll(panelName)
}

onMounted(() => {
    nextTick(() => {
        moduleStore.moduleConfig.Favorites.favoritesTabPanels.forEach((panel) => {
            bindPanelScroll(panel.name)
        })
    })
})

onUpdated(() => {
    moduleStore.moduleConfig.Favorites.favoritesTabPanels.forEach((panel) => {
        bindPanelScroll(panel.name)
    })
})

onBeforeUnmount(() => {
    favoritesMainTextareas.forEach((textarea, panelName) => {
        const listener = favoritesMainListeners.get(panelName)
        if (listener) {
            textarea.removeEventListener('scroll', listener)
        }
    })

    favoritesPreviewTextareas.forEach((textarea, panelName) => {
        const listener = favoritesPreviewListeners.get(panelName)
        if (listener) {
            textarea.removeEventListener('scroll', listener)
        }
    })
})

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

const isSendingPanel = (panelName: number) => {
    return (
        moduleStore.moduleConfig.Favorites.enable &&
        moduleStore.moduleConfig.Favorites.sendingTabName === panelName
    )
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
        moduleStore.moduleConfig.Favorites.sendingTabName = currentPanel.name
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
    <n-form :rules="rules">
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
                                :disabled="moduleStore.moduleConfig.Favorites.enable"
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
                            :disabled="isSendingPanel(panels.name)"
                            clearable
                            placeholder="最好写一下标题吧"
                        />
                    </n-form-item>
                    <n-form-item
                        label="发送内容"
                        show-require-mark
                        :validation-status="panels.msg === '' ? 'error' : undefined"
                    >
                        <div style="width: 100%">
                            <n-input
                                :ref="(inst) => setMainInputRef(panels.name, inst as InputInst | null)"
                                v-model:value="panels.msg"
                                :disabled="isSendingPanel(panels.name)"
                                round
                                clearable
                                show-count
                                type="textarea"
                                placeholder="默认每次弹幕发送字数为你文字独轮车设置的间隔，超出相应值将自动分割到下一条弹幕"
                            />

                            <div v-if="!moduleStore.moduleConfig.Favorites.storytellerMode" class="preview-wrap">
                                <div class="preview-title">
                                    超长灰显预览（超过数量间隔的部分会被丢弃）
                                </div>
                                <div class="preview-overlay-wrap">
                                    <n-input
                                        :ref="(inst) => setPreviewInputRef(panels.name, inst as InputInst | null)"
                                        round
                                        type="textarea"
                                        readonly
                                        :show-count="true"
                                        :value="panels.msg"
                                        class="preview-base"
                                    />
                                    <div
                                        class="preview-overlay-viewport"
                                        :style="favoritesOverlayViewportStyles[panels.name] || {}"
                                        aria-hidden="true"
                                    >
                                        <div
                                            class="preview-overlay"
                                            :style="{
                                                ...(favoritesOverlayStyles[panels.name] || {}),
                                                transform:
                                                    favoritesOverlayTransforms[panels.name] ||
                                                    'translateY(0px)'
                                            }"
                                        >
                                            <div
                                                class="preview-line"
                                                v-for="(line, idx) in getPreviewLines(panels.msg)"
                                                :key="`${panels.name}-${idx}`"
                                            >
                                                <span>{{ line.keep }}</span
                                                ><span class="overflow">{{ line.overflow }}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
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

<style scoped>
.preview-wrap {
    margin-top: 8px;
}

.preview-title {
    margin-bottom: 4px;
    font-size: 12px;
    color: #909399;
}

.preview-overlay-wrap {
    position: relative;
    width: 100%;
}

.preview-base {
    width: 100%;
}

.preview-base :deep(textarea) {
    color: transparent;
    caret-color: transparent;
    overflow-x: hidden;
}

.preview-base :deep(.n-input__suffix) {
    visibility: hidden;
}

.preview-overlay-viewport {
    position: absolute;
    overflow: hidden;
    pointer-events: none;
}

.preview-overlay {
    position: relative;
    width: 100%;
    min-height: 100%;
    white-space: pre-wrap;
    word-break: break-word;
}

.preview-line {
    min-height: 1.6em;
}

.overflow {
    color: #b5b5b5;
}
</style>
