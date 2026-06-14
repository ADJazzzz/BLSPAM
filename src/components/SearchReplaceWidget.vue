<script setup lang="ts">
import { ref, watch, nextTick, onMounted, onUnmounted } from 'vue'
import {
    NCard,
    NInput,
    NInputGroup,
    NButton,
    NCheckbox,
    NSpace,
    NFlex,
    useMessage,
    useDialog
} from 'naive-ui'

const props = defineProps<{
    show: boolean
    value: string
    textareaInst: any
}>()

const emit = defineEmits<{
    (e: 'update:show', value: boolean): void
    (e: 'update:value', value: string): void
}>()

const message = useMessage()
const dialog = useDialog()

const searchText = ref('')
const replaceText = ref('')
const caseSensitive = ref(false)
const useRegex = ref(false)

const matchRanges = ref<{ start: number; end: number }[]>([])
const activeMatchIndex = ref(-1)

const searchInputRef = ref<InstanceType<typeof NInput> | null>(null)
const textareaEl = ref<HTMLTextAreaElement | null>(null)

const getSearchRegex = (): RegExp | null => {
    if (!searchText.value) return null
    try {
        const flags = 'g' + (caseSensitive.value ? '' : 'i')
        if (useRegex.value) {
            return new RegExp(searchText.value, flags)
        } else {
            const escaped = searchText.value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
            return new RegExp(escaped, flags)
        }
    } catch (e) {
        return null
    }
}

let debounceTimer: any = null
const isComposing = ref(false)

const triggerDebounceFocus = () => {
    if (debounceTimer) {
        clearTimeout(debounceTimer)
    }
    if (isComposing.value) return

    debounceTimer = setTimeout(() => {
        if (props.show && matchRanges.value.length > 0) {
            activeMatchIndex.value = 0
            highlightMatch(0, true)
        }
    }, 500)
}

const handleCompositionStart = () => {
    isComposing.value = true
}

const handleCompositionEnd = () => {
    isComposing.value = false
    triggerDebounceFocus()
}



const handleTextareaKeyDown = (e: KeyboardEvent) => {
    if (!props.show) return

    if (e.key === 'ArrowUp') {
        e.preventDefault()
        findPrev()
    } else if (e.key === 'ArrowDown') {
        e.preventDefault()
        findNext()
    } else if (e.key === 'Enter') {
        e.preventDefault()
        findNext()
    } else if (e.key === 'Escape') {
        e.preventDefault()
        searchInputRef.value?.focus()
    } else if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
        // 用户输入普通字符，我们把它转回查找输入框
        e.preventDefault()
        const inputEl = searchInputRef.value?.$el?.querySelector('input') as HTMLInputElement | null
        if (inputEl) {
            inputEl.focus()
            
            // 获取当前选区并插入字符
            const start = inputEl.selectionStart ?? searchText.value.length
            const end = inputEl.selectionEnd ?? searchText.value.length
            searchText.value = searchText.value.slice(0, start) + e.key + searchText.value.slice(end)
            
            // 将光标设置在刚刚插入 of the character 后面
            const newPos = start + 1
            nextTick(() => {
                inputEl.setSelectionRange(newPos, newPos)
            })
        }
    } else if (e.key === 'Backspace') {
        e.preventDefault()
        const inputEl = searchInputRef.value?.$el?.querySelector('input') as HTMLInputElement | null
        if (inputEl) {
            inputEl.focus()
            
            const start = inputEl.selectionStart ?? searchText.value.length
            const end = inputEl.selectionEnd ?? searchText.value.length
            
            if (start !== end) {
                // 如果有选区，删掉选区
                searchText.value = searchText.value.slice(0, start) + searchText.value.slice(end)
                nextTick(() => {
                    inputEl.setSelectionRange(start, start)
                })
            } else if (start > 0) {
                // 没有选区，删掉光标前的一个字符
                searchText.value = searchText.value.slice(0, start - 1) + searchText.value.slice(start)
                const newPos = start - 1
                nextTick(() => {
                    inputEl.setSelectionRange(newPos, newPos)
                })
            }
        }
    }
}

const getTextArea = (): HTMLTextAreaElement | null => {
    if (props.textareaInst?.$el) {
        return props.textareaInst.$el.querySelector('textarea')
    }
    return null
}

const updateMatches = () => {
    const text = props.value
    if (!text || !searchText.value) {
        matchRanges.value = []
        activeMatchIndex.value = -1
        return
    }

    const regex = getSearchRegex()
    if (!regex) {
        matchRanges.value = []
        activeMatchIndex.value = -1
        return
    }

    try {
        const ranges: { start: number; end: number }[] = []
        let match: RegExpExecArray | null
        regex.lastIndex = 0

        const limit = 10000
        let count = 0
        while ((match = regex.exec(text)) !== null && count < limit) {
            count++
            ranges.push({
                start: match.index,
                end: match.index + match[0].length
            })
            if (match[0].length === 0) {
                regex.lastIndex++
            }
        }

        matchRanges.value = ranges
        if (activeMatchIndex.value >= ranges.length) {
            activeMatchIndex.value = ranges.length - 1
        }
    } catch (e: any) {
        matchRanges.value = []
        activeMatchIndex.value = -1
    }
}

const scrollTextareaToRange = (textarea: HTMLTextAreaElement, start: number) => {
    const textBefore = textarea.value.slice(0, start)
    const lines = textBefore.split('\n')
    const lineNumber = lines.length - 1

    const computedStyle = window.getComputedStyle(textarea)
    const lineHeightStr = computedStyle.lineHeight
    let lineHeight = parseFloat(lineHeightStr)
    if (isNaN(lineHeight)) {
        const fontSize = parseFloat(computedStyle.fontSize) || 14
        lineHeight = fontSize * 1.5
    }

    const textareaHeight = textarea.clientHeight
    const targetScrollTop = Math.max(0, lineNumber * lineHeight - textareaHeight / 2 + lineHeight / 2)
    textarea.scrollTop = targetScrollTop
}

const highlightMatch = (index: number, focusTextarea = true) => {
    if (index < 0 || index >= matchRanges.value.length) return
    const range = matchRanges.value[index]
    const textarea = getTextArea()
    if (textarea) {
        // Synchronously scroll and set range without focusing, avoiding focus theft during typing
        scrollTextareaToRange(textarea, range.start)
        textarea.setSelectionRange(range.start, range.end)

        if (focusTextarea) {
            textarea.focus()
        }
    }
}

const findNext = () => {
    if (matchRanges.value.length === 0) return
    activeMatchIndex.value = (activeMatchIndex.value + 1) % matchRanges.value.length
    highlightMatch(activeMatchIndex.value)
}

const findPrev = () => {
    if (matchRanges.value.length === 0) return
    activeMatchIndex.value = (activeMatchIndex.value - 1 + matchRanges.value.length) % matchRanges.value.length
    highlightMatch(activeMatchIndex.value)
}

const replaceSelected = () => {
    if (matchRanges.value.length === 0 || activeMatchIndex.value === -1) {
        message.warning('请先使用查找功能定位到匹配项')
        return
    }

    const range = matchRanges.value[activeMatchIndex.value]
    const text = props.value

    const newText = text.slice(0, range.start) + replaceText.value + text.slice(range.end)
    emit('update:value', newText)

    const nextIndex = activeMatchIndex.value >= matchRanges.value.length - 1 ? 0 : activeMatchIndex.value

    nextTick(() => {
        updateMatches()
        if (matchRanges.value.length > 0) {
            activeMatchIndex.value = Math.min(nextIndex, matchRanges.value.length - 1)
            highlightMatch(activeMatchIndex.value)
        } else {
            activeMatchIndex.value = -1
        }
    })
}

const replaceAll = () => {
    if (matchRanges.value.length === 0) {
        message.warning('没有找到可替换的匹配项')
        return
    }

    const count = matchRanges.value.length

    dialog.warning({
        title: '全部替换确认',
        content: `确认全部替换这 ${count} 处匹配吗？`,
        positiveText: '确认',
        negativeText: '取消',
        onPositiveClick: () => {
            let newText = props.value
            const regex = getSearchRegex()
            if (!regex) {
                message.error('正则表达式无效')
                return
            }
            newText = newText.replace(regex, replaceText.value)

            emit('update:value', newText)
            message.success(`成功全部替换了 ${count} 处匹配`)

            nextTick(() => {
                updateMatches()
                activeMatchIndex.value = -1
            })
        }
    })
}

watch(
    () => props.value,
    () => {
        updateMatches()
    }
)

watch([searchText, caseSensitive, useRegex], () => {
    updateMatches()
    if (matchRanges.value.length > 0) {
        activeMatchIndex.value = 0
        highlightMatch(0, false)
        triggerDebounceFocus()
    } else {
        activeMatchIndex.value = -1
        if (debounceTimer) {
            clearTimeout(debounceTimer)
        }
    }
})

watch(
    () => props.show,
    (newVal) => {
        if (newVal) {
            nextTick(() => {
                const textarea = getTextArea()
                if (textarea) {
                    textareaEl.value = textarea
                    textarea.addEventListener('keydown', handleTextareaKeyDown)
                }

                searchInputRef.value?.focus()
                updateMatches()
                if (matchRanges.value.length > 0) {
                    activeMatchIndex.value = 0
                    highlightMatch(0, false)
                    triggerDebounceFocus()
                }
            })
        } else {
            if (debounceTimer) {
                clearTimeout(debounceTimer)
            }
            if (textareaEl.value) {
                textareaEl.value.removeEventListener('keydown', handleTextareaKeyDown)
                textareaEl.value = null
            }
            const textarea = getTextArea()
            if (textarea) {
                textarea.setSelectionRange(0, 0)
            }
        }
    }
)

const handleGlobalKeyDown = (e: KeyboardEvent) => {
    if (props.show && (e.ctrlKey || e.metaKey) && (e.key === 'f' || e.key === 'F')) {
        e.preventDefault()
        searchInputRef.value?.focus()
        searchInputRef.value?.select()
    }
}

onMounted(() => {
    window.addEventListener('keydown', handleGlobalKeyDown)
})

onUnmounted(() => {
    window.removeEventListener('keydown', handleGlobalKeyDown)
    if (textareaEl.value) {
        textareaEl.value.removeEventListener('keydown', handleTextareaKeyDown)
    }
    if (debounceTimer) {
        clearTimeout(debounceTimer)
    }
})

const handleSearchKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'ArrowUp') {
        e.preventDefault()
        findPrev()
    } else if (e.key === 'ArrowDown') {
        e.preventDefault()
        findNext()
    } else if (e.key === 'Enter') {
        e.preventDefault()
        findNext()
    }
}
</script>

<template>
    <n-card
        v-if="show"
        size="small"
        closable
        @close="emit('update:show', false)"
        style="
            position: absolute;
            top: 4px;
            right: 4px;
            z-index: 10;
            width: 330px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        "
    >
        <n-flex vertical size="small">
            <!-- Row 1: Search -->
            <n-input-group>
                <n-input
                    v-model:value="searchText"
                    placeholder="查找"
                    size="small"
                    ref="searchInputRef"
                    :input-props="{
                        onKeydown: handleSearchKeyDown,
                        onCompositionstart: handleCompositionStart,
                        onCompositionend: handleCompositionEnd
                    }"
                    style="flex: 1"
                />
                <n-button size="small" @click="findPrev" title="上一个匹配">
                    ▲
                </n-button>
                <n-button size="small" @click="findNext" title="下一个匹配">
                    ▼
                </n-button>
            </n-input-group>

            <!-- Row 2: Replace -->
            <n-input-group>
                <n-input
                    v-model:value="replaceText"
                    placeholder="替换为"
                    size="small"
                    style="flex: 1"
                />
                <n-button size="small" @click="replaceSelected" title="替换当前匹配">
                    替换
                </n-button>
                <n-button size="small" type="primary" secondary @click="replaceAll" title="全部替换">
                    全部
                </n-button>
            </n-input-group>

            <!-- Row 3: Options & Status -->
            <n-flex justify="space-between" align="center" style="margin-top: 2px">
                <n-space size="small">
                    <n-checkbox v-model:checked="caseSensitive" size="small">
                        区分大小写
                    </n-checkbox>
                    <n-checkbox v-model:checked="useRegex" size="small">
                        正则
                    </n-checkbox>
                </n-space>
                <span style="font-size: 11px; color: #888;">
                    {{ matchRanges.length > 0 ? `${activeMatchIndex + 1} / ${matchRanges.length}` : '无匹配' }}
                </span>
            </n-flex>
        </n-flex>
    </n-card>
</template>

<style>
.blspam-textarea-container textarea::selection {
    background: #1890ff !important;
    color: #ffffff !important;
}
</style>
