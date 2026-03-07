<script setup lang="ts">
import { computed, ref, nextTick, onMounted, onUpdated, onBeforeUnmount, watch } from 'vue'
import {
    NButton,
    NForm,
    NFormItem,
    NInput,
    NInputNumber,
    NPopover,
    NFlex,
    NPageHeader,
    useMessage,
    NIcon,
    NAvatar
} from 'naive-ui'
import type { InputInst } from 'naive-ui'
import { useUIStore } from '@/stores/useUIStore'
import { useModuleStore } from '@/stores/useModuleStore'
import { useBiliStore } from '@/stores/useBiliStore'
import EmotionIcon from '@/assets/EmotionIcon.svg?component'
import stop from '@/modules/Spamer/textSpamer'

const uiStore = useUIStore()
const moduleStore = useModuleStore()
const biliStore = useBiliStore()
const message = useMessage()
const tStop = new stop('StopTextSpamer')

const textInputRef = ref<InputInst | null>(null)
const textPreviewInputRef = ref<InputInst | null>(null)

const textTextareaEl = ref<HTMLTextAreaElement | null>(null)
const textPreviewTextareaEl = ref<HTMLTextAreaElement | null>(null)

const textOverlayStyle = ref<Record<string, string>>({})
const textOverlayViewportStyle = ref<Record<string, string>>({})
const textOverlayTransform = ref('translateY(0px)')

let textScrollListener: ((event: Event) => void) | null = null
let textPreviewScrollListener: ((event: Event) => void) | null = null
let textSyncing = false
let textRelayoutTimer: ReturnType<typeof setTimeout> | null = null

const textinterval = computed(() => Math.max(1, Number(moduleStore.moduleConfig.TextSpam.textinterval || 1)))

const textPreviewLines = computed(() => {
    return moduleStore.moduleConfig.TextSpam.msg.split(/\r?\n/).map((line) => ({
        keep: line.slice(0, textinterval.value),
        overflow: line.slice(textinterval.value)
    }))
})

const setTextOverlayTransform = (scrollTop: number) => {
    textOverlayTransform.value = `translateY(${-scrollTop}px)`
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

const updateTextOverlayStyle = () => {
    const textarea = textInputRef.value?.textareaElRef
    const wrapper = textInputRef.value?.wrapperElRef
    const previewTextarea = textPreviewInputRef.value?.textareaElRef
    const previewWrapper = textPreviewInputRef.value?.wrapperElRef

    if (!textarea || !wrapper || !previewTextarea || !previewWrapper) return

    const style = getComputedStyle(textarea)
    const suffix = wrapper.querySelector('.n-input__suffix') as HTMLElement | null
    const suffixWidth = suffix?.offsetWidth ?? 0
    const suffixHeight = suffix?.offsetHeight ?? 0

    const previewHost = previewWrapper.closest('.preview-overlay-wrap') as HTMLElement | null
    if (!previewHost) return
    const { top, left } = getOffsetToAncestor(previewTextarea, previewHost)
    const width = previewTextarea.offsetWidth
    const height = previewTextarea.offsetHeight
    if (width <= 1 || height <= 1) return

    textOverlayViewportStyle.value = {
        top: `${top}px`,
        left: `${left}px`,
        width: `${width}px`,
        height: `${height}px`
    }

    textOverlayStyle.value = {
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

const syncMainToPreview = (event: Event) => {
    const target = event.target as HTMLTextAreaElement | null
    if (!target || !textPreviewTextareaEl.value || textSyncing) return

    textSyncing = true
    textPreviewTextareaEl.value.scrollTop = target.scrollTop
    setTextOverlayTransform(target.scrollTop)
    requestAnimationFrame(() => {
        textSyncing = false
    })
}

const syncPreviewToMain = (event: Event) => {
    const target = event.target as HTMLTextAreaElement | null
    if (!target || !textTextareaEl.value || textSyncing) return

    textSyncing = true
    textTextareaEl.value.scrollTop = target.scrollTop
    setTextOverlayTransform(target.scrollTop)
    requestAnimationFrame(() => {
        textSyncing = false
    })
}

const bindTextScroll = () => {
    const main = textInputRef.value?.textareaElRef ?? null
    const preview = textPreviewInputRef.value?.textareaElRef ?? null

    if (main !== textTextareaEl.value) {
        if (textTextareaEl.value && textScrollListener) {
            textTextareaEl.value.removeEventListener('scroll', textScrollListener)
        }
        textTextareaEl.value = main
        if (main) {
            textScrollListener = (event: Event) => syncMainToPreview(event)
            main.addEventListener('scroll', textScrollListener, { passive: true })
        } else {
            textScrollListener = null
        }
    }

    if (preview !== textPreviewTextareaEl.value) {
        if (textPreviewTextareaEl.value && textPreviewScrollListener) {
            textPreviewTextareaEl.value.removeEventListener('scroll', textPreviewScrollListener)
        }
        textPreviewTextareaEl.value = preview
        if (preview) {
            preview.readOnly = true
            textPreviewScrollListener = (event: Event) => syncPreviewToMain(event)
            preview.addEventListener('scroll', textPreviewScrollListener, { passive: true })
        } else {
            textPreviewScrollListener = null
        }
    }

    updateTextOverlayStyle()
    const currentScrollTop = main?.scrollTop ?? 0
    if (preview) {
        preview.scrollTop = currentScrollTop
    }
    setTextOverlayTransform(currentScrollTop)
}

const scheduleTextRelayout = () => {
    if (textRelayoutTimer) {
        clearTimeout(textRelayoutTimer)
        textRelayoutTimer = null
    }

    nextTick(() => {
        bindTextScroll()
        requestAnimationFrame(() => bindTextScroll())
        textRelayoutTimer = setTimeout(() => {
            bindTextScroll()
            textRelayoutTimer = null
        }, 360)
    })
}

onMounted(() => {
    scheduleTextRelayout()
})

onUpdated(() => {
    bindTextScroll()
})

watch(
    () => uiStore.uiConfig.isShowPanel,
    (show) => {
        if (show && uiStore.uiConfig.activeMenuIndex === 'TextView') {
            scheduleTextRelayout()
        }
    }
)

watch(
    () => uiStore.uiConfig.activeMenuIndex,
    (menu) => {
        if (menu === 'TextView' && uiStore.uiConfig.isShowPanel) {
            scheduleTextRelayout()
        }
    }
)

onBeforeUnmount(() => {
    if (textTextareaEl.value && textScrollListener) {
        textTextareaEl.value.removeEventListener('scroll', textScrollListener)
    }
    if (textPreviewTextareaEl.value && textPreviewScrollListener) {
        textPreviewTextareaEl.value.removeEventListener('scroll', textPreviewScrollListener)
    }
    if (textRelayoutTimer) {
        clearTimeout(textRelayoutTimer)
        textRelayoutTimer = null
    }
})

const handleStartSpamer = () => {
    if (
        moduleStore.moduleConfig.TextSpam.msg === '' ||
        moduleStore.moduleConfig.TextSpam.msg === null
    ) {
        message.error('没内容你车什么?')
    } else if (
        moduleStore.moduleConfig.TextSpam.textinterval === null ||
        moduleStore.moduleConfig.TextSpam.timeinterval === null ||
        moduleStore.moduleConfig.TextSpam.timelimit === null
    ) {
        message.error('没参数你车什么?')
    } else {
        uiStore.uiConfig.isShowPanel = false
        moduleStore.moduleConfig.TextSpam.enable = true
        moduleStore.emitter.emit('TextSpam', {
            module: 'TextSpam'
        })
    }
}
const handleStopSpamer = () => {
    tStop.stop('text')
}

const toggleStorytellerMode = () => {
    moduleStore.moduleConfig.TextSpam.storytellerMode =
        !moduleStore.moduleConfig.TextSpam.storytellerMode
}

const toggleSequentialMode = () => {
    moduleStore.moduleConfig.TextSpam.sequentialMode =
        !moduleStore.moduleConfig.TextSpam.sequentialMode
}

const rules = {
    timeinterval: {
        required: true,
        message: '最小为1',
        trigger: ['input', 'blur'],
        validator: () => {
            return moduleStore.moduleConfig.TextSpam.timeinterval !== null
        }
    },
    textinterval: {
        required: true,
        message: `输入一个大于0，小于的${biliStore.danmuLengthLimit}的数字`,
        trigger: ['input', 'blur'],
        validator: () => {
            return moduleStore.moduleConfig.TextSpam.textinterval !== null
        }
    },
    timelimit: {
        required: true,
        message: '输入一个大于等于0的数字',
        trigger: ['input', 'blur'],
        validator: () => {
            return moduleStore.moduleConfig.TextSpam.timelimit !== null
        }
    },
    msg: {
        required: true,
        message: '没内容你车什么',
        trigger: ['input', 'blur'],
        validator: () => {
            return moduleStore.moduleConfig.TextSpam.msg.length > 0
        }
    }
}
</script>

<template>
    <n-form :rules="rules" :disabled="moduleStore.moduleConfig.TextSpam.enable">
        <n-page-header subtitle="文字独轮车" style="margin-bottom: 10px" />
        <n-form-item :show-label="false">
            <n-flex align="center">
                <n-form-item label="时间间隔" path="timeinterval">
                    <n-popover trigger="hover" style="max-width: 300px" placement="bottom">
                        <template #trigger>
                            <n-input-number
                                clearable
                                :show-button="false"
                                v-model:value="moduleStore.moduleConfig.TextSpam.timeinterval"
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
                <n-form-item label="数量间隔" path="textinterval">
                    <n-popover trigger="hover" placement="bottom">
                        <template #trigger>
                            <n-input-number
                                clearable
                                :show-button="false"
                                v-model:value="moduleStore.moduleConfig.TextSpam.textinterval"
                                placeholder="默认当前账号上限"
                                min="1"
                                :max="biliStore.danmuLengthLimit ?? undefined"
                                :precision="0"
                            />
                        </template>
                        <span
                            >每次弹幕发送字数, 最大为
                            {{ biliStore.danmuLengthLimit }}
                        </span>
                    </n-popover>
                </n-form-item>
                <n-form-item label="时间限制" path="timelimit">
                    <n-popover trigger="hover" placement="bottom">
                        <template #trigger>
                            <n-input-number
                                clearable
                                :show-button="false"
                                v-model:value="moduleStore.moduleConfig.TextSpam.timelimit"
                                placeholder="默认0"
                                min="0"
                                :precision="0"
                            >
                                <template #suffix> 秒 </template>
                            </n-input-number>
                        </template>
                        <span>设定一个时间，计时完成后自动停止，单位为秒，0为关闭该功能</span>
                    </n-popover>
                </n-form-item>
            </n-flex>
        </n-form-item>

        <n-form-item label="模式选择">
            <n-flex align="center" style="gap: 8px; width: 100%">
                <button
                    type="button"
                    :disabled="moduleStore.moduleConfig.TextSpam.enable"
                    @click="toggleStorytellerMode"
                    :style="{
                        padding: '4px 10px',
                        borderRadius: '999px',
                        border: '1px solid #bfbfbf',
                        cursor: moduleStore.moduleConfig.TextSpam.enable ? 'not-allowed' : 'pointer',
                        color: moduleStore.moduleConfig.TextSpam.storytellerMode ? '#fff' : '#333',
                        backgroundColor: moduleStore.moduleConfig.TextSpam.storytellerMode
                            ? '#18a058'
                            : '#fff'
                    }"
                >
                    说书模式 {{ moduleStore.moduleConfig.TextSpam.storytellerMode ? '开' : '关' }}
                </button>
                <button
                    type="button"
                    :disabled="moduleStore.moduleConfig.TextSpam.enable"
                    @click="toggleSequentialMode"
                    :style="{
                        padding: '4px 10px',
                        borderRadius: '999px',
                        border: '1px solid #bfbfbf',
                        cursor: moduleStore.moduleConfig.TextSpam.enable ? 'not-allowed' : 'pointer',
                        color: moduleStore.moduleConfig.TextSpam.sequentialMode ? '#fff' : '#333',
                        backgroundColor: moduleStore.moduleConfig.TextSpam.sequentialMode
                            ? '#18a058'
                            : '#fff'
                    }"
                >
                    按顺序发送 {{ moduleStore.moduleConfig.TextSpam.sequentialMode ? '开' : '关' }}
                </button>
            </n-flex>
        </n-form-item>

        <n-form-item label="发送内容" path="msg">
            <n-flex align="flex-start" :wrap="false" style="width: 100%; gap: 8px">
                <div style="width: 100%">
                    <n-input
                        ref="textInputRef"
                        round
                        clearable
                        type="textarea"
                        show-count
                        v-model:value="moduleStore.moduleConfig.TextSpam.msg"
                        placeholder="车了可能会被禁，但不车就等于一直被禁"
                    />

                    <div v-if="!moduleStore.moduleConfig.TextSpam.storytellerMode" class="preview-wrap">
                        <div class="preview-title">
                            逐行发送模式预览 - 灰色文字代表超过本行字数上限会被自动舍弃
                        </div>
                        <div class="preview-overlay-wrap">
                            <n-input
                                ref="textPreviewInputRef"
                                round
                                type="textarea"
                                readonly
                                :show-count="true"
                                :value="moduleStore.moduleConfig.TextSpam.msg"
                                class="preview-base"
                            />
                            <div
                                class="preview-overlay-viewport"
                                :style="textOverlayViewportStyle"
                                aria-hidden="true"
                            >
                                <div
                                    class="preview-overlay"
                                    :style="{
                                        ...textOverlayStyle,
                                        transform: textOverlayTransform
                                    }"
                                >
                                    <div class="preview-line" v-for="(line, idx) in textPreviewLines" :key="idx">
                                        <span>{{ line.keep }}</span><span class="overflow">{{ line.overflow }}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <n-popover trigger="click" placement="left" style="width: 500px">
                    <template #trigger>
                        <n-button text class="emoji-trigger">
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
                                @click="moduleStore.moduleConfig.TextSpam.msg += data.emoji"
                            />
                        </div>
                    </div>
                </n-popover>
            </n-flex>
        </n-form-item>
        <n-flex
            justify="end"
            style="margin-top: 10px"
            v-if="!moduleStore.moduleConfig.TextSpam.enable"
        >
            <n-button round @click="uiStore.uiConfig.isShowPanel = false">取消</n-button>
            <n-button round type="primary" @click="handleStartSpamer">开车</n-button>
        </n-flex>
        <n-flex
            justify="end"
            style="margin-top: 10px"
            v-if="moduleStore.moduleConfig.TextSpam.enable"
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
