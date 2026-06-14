<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
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
    NAvatar,
    NSwitch
} from 'naive-ui'
import { useUIStore } from '@/stores/useUIStore'
import { useModuleStore } from '@/stores/useModuleStore'
import { useBiliStore } from '@/stores/useBiliStore'
import { updateSaveSpamerStatusList } from '@/utils/ui'
import { getDanmakuLength } from '@/utils/danmaku'
import EmotionIcon from '@/assets/EmotionIcon.svg?component'
import stop from '@/modules/Spamer/textSpamer'
import SearchReplaceWidget from './SearchReplaceWidget.vue'

const uiStore = useUIStore()
const moduleStore = useModuleStore()
const biliStore = useBiliStore()
const message = useMessage()
const tStop = new stop('StopTextSpamer')

const showSearchReplace = ref(false)
const textareaInstRef = ref<any>(null)

const handleKeyDown = (e: KeyboardEvent) => {
    if (!uiStore.uiConfig.isShowPanel) return
    if ((e.ctrlKey || e.metaKey) && (e.key === 'f' || e.key === 'F')) {
        e.preventDefault()
        showSearchReplace.value = true
    }
}

onMounted(() => {
    window.addEventListener('keydown', handleKeyDown)
})

onUnmounted(() => {
    window.removeEventListener('keydown', handleKeyDown)
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
    } else if (
        moduleStore.moduleConfig.TextSpam.randomize &&
        (moduleStore.moduleConfig.TextSpam.timeintervalMax === null ||
            moduleStore.moduleConfig.TextSpam.timeintervalMax <
                moduleStore.moduleConfig.TextSpam.timeinterval)
    ) {
        message.error('最大时间间隔不能小于最小时间间隔')
    } else {
        uiStore.uiConfig.isShowPanel = false
        moduleStore.moduleConfig.TextSpam.enable = true
        moduleStore.emitter.emit('TextSpam', {
            module: 'TextSpam'
        })
        updateSaveSpamerStatusList(
            biliStore.BilibiliLive?.ROOMID,
            'TextSpam',
            true,
            biliStore.masterInfo?.info?.uname
        )
    }
}
const handleStopSpamer = () => {
    tStop.stop('text')
    updateSaveSpamerStatusList(biliStore.BilibiliLive?.ROOMID, 'TextSpam', false)
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
    timeintervalMax: {
        required: true,
        message: '最小为1，且不能小于最小间隔',
        trigger: ['input', 'blur'],
        validator: () => {
            if (!moduleStore.moduleConfig.TextSpam.randomize) return true
            return (
                moduleStore.moduleConfig.TextSpam.timeintervalMax !== null &&
                moduleStore.moduleConfig.TextSpam.timeintervalMax >=
                    moduleStore.moduleConfig.TextSpam.timeinterval
            )
        }
    },
    textinterval: {
        required: true,
        message: `输入一个大于0，小于的${biliStore.infoByuser?.property.danmu.length}的数字`,
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
                <n-form-item label="随机时间间隔">
                    <n-popover trigger="hover" style="max-width: 300px" placement="right">
                        <template #trigger>
                            <n-switch v-model:value="moduleStore.moduleConfig.TextSpam.randomize" />
                        </template>
                        <span>开启后在选定的最小和最大时间间隔范围内随机发送弹幕</span>
                    </n-popover>
                </n-form-item>
                <n-form-item
                    :label="
                        moduleStore.moduleConfig.TextSpam.randomize ? '最小时间间隔' : '时间间隔'
                    "
                    path="timeinterval"
                >
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
                <n-form-item
                    v-if="moduleStore.moduleConfig.TextSpam.randomize"
                    label="最大时间间隔"
                    path="timeintervalMax"
                >
                    <n-popover trigger="hover" style="max-width: 300px" placement="bottom">
                        <template #trigger>
                            <n-input-number
                                clearable
                                :show-button="false"
                                v-model:value="moduleStore.moduleConfig.TextSpam.timeintervalMax"
                                placeholder="默认5，单位为秒"
                                min="1"
                                :precision="0"
                            >
                                <template #suffix> 秒 </template>
                            </n-input-number>
                        </template>
                        <span
                            >弹幕发送最大时间间隔，将在最小和最大时间间隔范围内随机，与最小时间间隔相同时不随机</span
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
                                placeholder="默认20"
                                min="1"
                                :max="biliStore.infoByuser?.property.danmu.length"
                                :precision="0"
                            />
                        </template>
                        <span
                            >每次弹幕发送字数, 最大为
                            {{ biliStore.infoByuser?.property.danmu.length }}
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
        <n-form-item path="msg" :show-label="false">
            <n-flex vertical style="width: 100%; gap: 6px;">
                <n-flex justify="space-between" align="center" style="width: 100%">
                    <span style="font-weight: 500; font-size: 14px;">发送内容</span>
                    <n-flex align="center" style="gap: 12px;">
                        <n-popover trigger="click" placement="bottom" style="width: 500px">
                            <template #trigger>
                                <n-button text style="display: flex; align-items: center;">
                                    <n-icon :size="20">
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
                        <n-button size="tiny" type="primary" secondary @click="showSearchReplace = true">
                            搜索替换
                        </n-button>
                    </n-flex>
                </n-flex>
                <div class="blspam-textarea-container" style="position: relative; width: 100%;">
                    <n-input
                        ref="textareaInstRef"
                        round
                        clearable
                        type="textarea"
                        show-count
                        v-model:value="moduleStore.moduleConfig.TextSpam.msg"
                        placeholder="车了可能会被禁，但不车就等于一直被禁"
                        rows="5"
                    >
                        <template #count="{ value }">
                            {{ getDanmakuLength(value ?? '') }}
                        </template>
                    </n-input>
                    <SearchReplaceWidget
                        v-model:show="showSearchReplace"
                        v-model:value="moduleStore.moduleConfig.TextSpam.msg"
                        :textarea-inst="textareaInstRef"
                    />
                </div>
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
