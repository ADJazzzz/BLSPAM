<script setup lang="ts">
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

        <n-form-item :show-label="false">
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
                <span style="font-size: 12px; color: #909399"
                    >提示：运行中修改开关不会立即生效，下次点击“开车”生效</span
                >
            </n-flex>
        </n-form-item>

        <n-form-item label="发送内容" path="msg">
            <n-input
                round
                clearable
                type="textarea"
                show-count
                v-model:value="moduleStore.moduleConfig.TextSpam.msg"
                placeholder="车了可能会被禁，但不车就等于一直被禁"
            />
            <n-popover trigger="click" placement="left" style="width: 500px">
                <template #trigger>
                    <n-button text style="padding-left: 4px">
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
