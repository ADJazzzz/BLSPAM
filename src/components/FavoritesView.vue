<script setup lang="ts">
import { computed, ref, nextTick, onMounted, onBeforeUnmount, watch } from 'vue'
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
    NIcon,
    NAvatar,
    useMessage,
    useDialog
} from 'naive-ui'
import type { InputInst } from 'naive-ui'
import _ from 'lodash'
import { useModuleStore } from '@/stores/useModuleStore'
import { useUIStore } from '@/stores/useUIStore'
import { useBiliStore } from '@/stores/useBiliStore'
import EmotionIcon from '@/assets/EmotionIcon.svg?component'
import stop from '@/modules/Spamer/textSpamer'

const moduleStore = useModuleStore()
const uiStore = useUIStore()
const biliStore = useBiliStore()
const message = useMessage()
const dialog = useDialog()
const favStop = new stop('StopFavoritesSpamer')

const favoritesMainInputRefs = ref<Record<number, InputInst | null>>({})
const favoritesPreviewInputRefs = ref<Record<number, InputInst | null>>({})
const favoritesOverlayStyles = ref<Record<number, Record<string, string>>>({})
const favoritesOverlayViewportStyles = ref<Record<number, Record<string, string>>>({})
const favoritesSelectionRanges = ref<Record<number, { start: number; end: number }>>({})

const favoritesMainTextareas = new Map<number, HTMLTextAreaElement>()
const favoritesPreviewTextareas = new Map<number, HTMLTextAreaElement>()
const favoritesMainListeners = new Map<number, (event: Event) => void>()
const favoritesPreviewListeners = new Map<number, (event: Event) => void>()
const favoritesCursorListeners = new Map<number, (event: Event) => void>()
const favoritesOverlayElements = new Map<number, HTMLDivElement>()
const favoritesSyncing = new Set<number>()
let favoritesRelayoutTimer: ReturnType<typeof setTimeout> | null = null

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

const getOffsetToAncestor = (el: HTMLElement, ancestor: HTMLElement) => {
    let top = 0
    let left = 0
    let current: HTMLElement | null = el

    while (current && current !== ancestor) {
        top += current.offsetTop
        left += current.offsetLeft
        current = current.offsetParent as HTMLElement | null
    }

    if (current !== ancestor) {
        const hostRect = ancestor.getBoundingClientRect()
        const elRect = el.getBoundingClientRect()
        return {
            top: elRect.top - hostRect.top,
            left: elRect.left - hostRect.left
        }
    }

    return { top, left }
}

const setOverlayTransform = (panelName: number, scrollTop: number) => {
    const overlay = favoritesOverlayElements.get(panelName)
    if (overlay) {
        overlay.style.transform = `translateY(${-scrollTop}px)`
    }
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
    if (!previewHost) return
    const { top, left } = getOffsetToAncestor(previewTextarea, previewHost)
    const width = previewTextarea.offsetWidth
    const height = previewTextarea.offsetHeight
    if (width <= 1 || height <= 1) return

    favoritesOverlayViewportStyles.value[panelName] = {
        top: `${top}px`,
        left: `${left}px`,
        width: `${width}px`,
        height: `${height}px`
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

const updateFavoriteSelectionRange = (panelName: number, event?: Event) => {
    const target =
        (event?.target as HTMLTextAreaElement | null) ?? favoritesMainTextareas.get(panelName) ?? null
    if (!target) return

    const maxLength = target.value.length
    const rawStart = target.selectionStart ?? maxLength
    const rawEnd = target.selectionEnd ?? rawStart
    const start = Math.max(0, Math.min(rawStart, maxLength))
    const end = Math.max(start, Math.min(rawEnd, maxLength))
    favoritesSelectionRanges.value[panelName] = { start, end }
}

const insertEmojiToFavorite = (panelName: number, emoji: string) => {
    const panel = moduleStore.moduleConfig.Favorites.favoritesTabPanels.find((item) => item.name === panelName)
    if (!panel) return

    const text = panel.msg || ''
    const activeTextarea = favoritesMainTextareas.get(panelName) ?? null
    const activeRange =
        activeTextarea && document.activeElement === activeTextarea
            ? {
                  start: activeTextarea.selectionStart ?? text.length,
                  end: activeTextarea.selectionEnd ?? text.length
              }
            : null
    const range = activeRange ?? favoritesSelectionRanges.value[panelName] ?? { start: text.length, end: text.length }
    const start = Math.max(0, Math.min(range.start, text.length))
    const end = Math.max(start, Math.min(range.end, text.length))

    panel.msg = `${text.slice(0, start)}${emoji}${text.slice(end)}`
    const cursor = start + emoji.length
    favoritesSelectionRanges.value[panelName] = { start: cursor, end: cursor }

    nextTick(() => {
        const textarea = favoritesMainTextareas.get(panelName)
        if (!textarea) return
        textarea.focus()
        textarea.setSelectionRange(cursor, cursor)
    })
}

const bindPanelScroll = (panelName: number) => {
    const main = favoritesMainInputRefs.value[panelName]?.textareaElRef ?? null
    const preview = favoritesPreviewInputRefs.value[panelName]?.textareaElRef ?? null

    const currentMain = favoritesMainTextareas.get(panelName) ?? null
    if (main !== currentMain) {
        const oldMainListener = favoritesMainListeners.get(panelName)
        const oldCursorListener = favoritesCursorListeners.get(panelName)
        if (currentMain && oldMainListener) {
            currentMain.removeEventListener('scroll', oldMainListener)
        }
        if (currentMain && oldCursorListener) {
            currentMain.removeEventListener('click', oldCursorListener)
            currentMain.removeEventListener('keyup', oldCursorListener)
            currentMain.removeEventListener('select', oldCursorListener)
            currentMain.removeEventListener('input', oldCursorListener)
            currentMain.removeEventListener('blur', oldCursorListener)
        }
        favoritesMainTextareas.delete(panelName)
        favoritesMainListeners.delete(panelName)
        favoritesCursorListeners.delete(panelName)

        if (main) {
            const listener = (event: Event) => syncMainToPreview(event, panelName)
            const cursorListener = (event: Event) => updateFavoriteSelectionRange(panelName, event)
            main.addEventListener('scroll', listener, { passive: true })
            main.addEventListener('click', cursorListener, { passive: true })
            main.addEventListener('keyup', cursorListener, { passive: true })
            main.addEventListener('select', cursorListener, { passive: true })
            main.addEventListener('input', cursorListener, { passive: true })
            main.addEventListener('blur', cursorListener, { passive: true })
            favoritesMainTextareas.set(panelName, main)
            favoritesMainListeners.set(panelName, listener)
            favoritesCursorListeners.set(panelName, cursorListener)
            updateFavoriteSelectionRange(panelName)
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

const setOverlayElement = (panelName: number, el: Element | null) => {
    if (el instanceof HTMLDivElement) {
        favoritesOverlayElements.set(panelName, el)
        const mainScrollTop = favoritesMainTextareas.get(panelName)?.scrollTop ?? 0
        setOverlayTransform(panelName, mainScrollTop)
    } else {
        favoritesOverlayElements.delete(panelName)
    }
}

const bindActivePanelScroll = () => {
    const activePanelName = moduleStore.moduleConfig.Favorites.favoritesTabsValue
    bindPanelScroll(activePanelName)
}

const scheduleFavoritesRelayout = () => {
    if (favoritesRelayoutTimer) {
        clearTimeout(favoritesRelayoutTimer)
        favoritesRelayoutTimer = null
    }

    nextTick(() => {
        bindActivePanelScroll()
        requestAnimationFrame(() => bindActivePanelScroll())
        favoritesRelayoutTimer = setTimeout(() => {
            bindActivePanelScroll()
            favoritesRelayoutTimer = null
        }, 360)
    })
}

onMounted(() => {
    scheduleFavoritesRelayout()
})

watch(
    () => moduleStore.moduleConfig.Favorites.favoritesTabsValue,
    () => {
        scheduleFavoritesRelayout()
    }
)

watch(
    () => moduleStore.moduleConfig.Favorites.storytellerMode,
    () => {
        scheduleFavoritesRelayout()
    }
)

watch(
    () => moduleStore.moduleConfig.Favorites.favoritesTabPanels.length,
    () => {
        scheduleFavoritesRelayout()
    }
)

watch(
    () => uiStore.uiConfig.isShowPanel,
    (show) => {
        if (show && uiStore.uiConfig.activeMenuIndex === 'FavoritesView') {
            scheduleFavoritesRelayout()
        }
    }
)

watch(
    () => uiStore.uiConfig.activeMenuIndex,
    (menu) => {
        if (menu === 'FavoritesView' && uiStore.uiConfig.isShowPanel) {
            scheduleFavoritesRelayout()
        }
    }
)

onBeforeUnmount(() => {
    favoritesMainTextareas.forEach((textarea, panelName) => {
        const listener = favoritesMainListeners.get(panelName)
        const cursorListener = favoritesCursorListeners.get(panelName)
        if (listener) {
            textarea.removeEventListener('scroll', listener)
        }
        if (cursorListener) {
            textarea.removeEventListener('click', cursorListener)
            textarea.removeEventListener('keyup', cursorListener)
            textarea.removeEventListener('select', cursorListener)
            textarea.removeEventListener('input', cursorListener)
            textarea.removeEventListener('blur', cursorListener)
        }
    })

    favoritesPreviewTextareas.forEach((textarea, panelName) => {
        const listener = favoritesPreviewListeners.get(panelName)
        if (listener) {
            textarea.removeEventListener('scroll', listener)
        }
    })
    if (favoritesRelayoutTimer) {
        clearTimeout(favoritesRelayoutTimer)
        favoritesRelayoutTimer = null
    }
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
                const mainTextarea = favoritesMainTextareas.get(name)
                const mainListener = favoritesMainListeners.get(name)
                const cursorListener = favoritesCursorListeners.get(name)
                const previewTextarea = favoritesPreviewTextareas.get(name)
                const previewListener = favoritesPreviewListeners.get(name)
                if (mainTextarea && mainListener) {
                    mainTextarea.removeEventListener('scroll', mainListener)
                }
                if (mainTextarea && cursorListener) {
                    mainTextarea.removeEventListener('click', cursorListener)
                    mainTextarea.removeEventListener('keyup', cursorListener)
                    mainTextarea.removeEventListener('select', cursorListener)
                    mainTextarea.removeEventListener('input', cursorListener)
                    mainTextarea.removeEventListener('blur', cursorListener)
                }
                if (previewTextarea && previewListener) {
                    previewTextarea.removeEventListener('scroll', previewListener)
                }
                _.remove(moduleStore.moduleConfig.Favorites.favoritesTabPanels, { name })
                delete favoritesSelectionRanges.value[name]
                favoritesMainListeners.delete(name)
                favoritesPreviewListeners.delete(name)
                favoritesCursorListeners.delete(name)
                favoritesMainTextareas.delete(name)
                favoritesPreviewTextareas.delete(name)
                favoritesOverlayElements.delete(name)
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

        <n-form-item label="模式选择">
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
                        <n-flex align="flex-start" :wrap="false" style="width: 100%; gap: 8px">
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

                                <div
                                    v-if="
                                        !moduleStore.moduleConfig.Favorites.storytellerMode &&
                                        panels.name === moduleStore.moduleConfig.Favorites.favoritesTabsValue
                                    "
                                    class="preview-wrap"
                                >
                                    <div class="preview-title">
                                        逐行发送模式预览 - 灰色文字代表超过本行字数上限会被自动舍弃
                                    </div>
                                    <div class="preview-overlay-wrap">
                                        <n-input
                                            :ref="(inst) =>
                                                setPreviewInputRef(panels.name, inst as InputInst | null)
                                            "
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
                                                :ref="(el) => setOverlayElement(panels.name, el)"
                                                class="preview-overlay"
                                                :style="{
                                                    ...(favoritesOverlayStyles[panels.name] || {})
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

                            <n-popover trigger="click" placement="left" style="width: 500px">
                                <template #trigger>
                                    <n-button text class="emoji-trigger" :disabled="isSendingPanel(panels.name)">
                                        <n-icon :size="24">
                                            <EmotionIcon />
                                        </n-icon>
                                    </n-button>
                                </template>
                                <div
                                    style="
                                        display: grid;
                                        grid-template-columns: repeat(auto-fill, minmax(32px, 1fr));
                                        gap: 8px;
                                        padding: 8px;
                                    "
                                >
                                    <div
                                        v-for="data in biliStore.emotionData.find((data) => data.pkg_id === 100)
                                            ?.emoticons"
                                        :key="data.emoticon_id"
                                        :disabled="data.perm === 0"
                                    >
                                        <n-avatar
                                            :color="uiStore.uiConfig.theme === 'dark' ? '#48484E' : 'white'"
                                            :size="24"
                                            :src="data.url"
                                            object-fit="contain"
                                            style="cursor: pointer"
                                            @click="insertEmojiToFavorite(panels.name, data.emoji)"
                                        />
                                    </div>
                                </div>
                            </n-popover>
                        </n-flex>
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

.emoji-trigger {
    padding-left: 4px;
    margin-top: 2px;
}
</style>
