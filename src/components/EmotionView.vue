<script setup lang="ts">
import {
    NAvatar,
    NSpace,
    NDivider,
    NCheckboxGroup,
    NCheckbox,
    NPopover,
    NButton,
    NForm,
    NFormItem,
    NInputNumber,
    NGrid,
    NGi,
    useMessage
} from 'naive-ui'
import { useBiliStore } from '../stores/useBiliStore'
import { useModuleStore } from '../stores/useModuleStore'
import { useUIStore } from '../stores/useUIStore'

const biliStore = useBiliStore()
const moduleStore = useModuleStore()
const uiStore = useUIStore()
const message = useMessage()

const handleClick = (id: number) => {
    moduleStore.moduleConfig.EmotionSpam.emotionViewSelectedID = id
}
const handleUpdateValue = (value: (string | number)[]) => {
    moduleStore.moduleConfig.EmotionSpam.msg = value.map(String)
}

const rules = {
    timeinterval: {
        required: true,
        message: '最小为1',
        trigger: ['input', 'blur'],
        validator: () => {
            if (moduleStore.moduleConfig.EmotionSpam.timeinterval === null) {
                return false
            } else {
                return true
            }
        }
    },
    timelimit: {
        required: true,
        message: '输入一个大于等于0的数字',
        trigger: ['input', 'blur'],
        validator: () => {
            if (moduleStore.moduleConfig.TextSpam.timelimit === null) {
                return false
            } else {
                return true
            }
        }
    }
}
const handleStartSpamer = () => {
    if (moduleStore.moduleConfig.EmotionSpam.msg.length === 0) {
        message.error('没选表情你车什么?')
    } else if (
        moduleStore.moduleConfig.EmotionSpam.timeinterval === null ||
        moduleStore.moduleConfig.EmotionSpam.timelimit === null
    ) {
        message.error('没参数你车什么?')
    } else {
        uiStore.uiConfig.isShowPanel = false
        moduleStore.moduleConfig.EmotionSpam.enable = true
        moduleStore.emitter.emit('EmotionSpam', {
            module: 'EmotionSpam'
        })
    }
}
const handleStopSpamer = () => {
    moduleStore.moduleConfig.EmotionSpam.enable = false
}
</script>

<template>
    <n-space id="emotionTab" justify="start">
        <div
            style="padding: 0 5px"
            v-for="data in biliStore.emotionData"
            :key="data.pkg_id"
            :id="data.pkg_id.toString()"
            @click="handleClick(data.pkg_id)"
        >
            <n-avatar color="white" :src="data.current_cover" />
        </div>
    </n-space>
    <n-divider style="margin: 15px 0" />
    <div
        id="emotionContent"
        v-if="moduleStore.moduleConfig.EmotionSpam.emotionViewSelectedID !== null"
    >
        <n-checkbox-group
            v-model:value="moduleStore.moduleConfig.EmotionSpam.msg"
            @update:value="handleUpdateValue"
        >
            <n-space style="padding-top: 5px">
                <n-checkbox
                    :value="data.emoticon_unique"
                    v-for="data in biliStore.emotionData.find(
                        (data) =>
                            data.pkg_id ===
                            moduleStore.moduleConfig.EmotionSpam.emotionViewSelectedID
                    )?.emoticons"
                    :key="data.emoticon_id"
                    :disabled="data.perm === 0 || moduleStore.moduleConfig.EmotionSpam.enable"
                >
                    <n-popover>
                        <template #trigger>
                            <n-avatar color="white" size="large" :src="data.url" />
                        </template>
                        <span>{{ data.emoji }}</span>
                    </n-popover>
                </n-checkbox>
            </n-space>
        </n-checkbox-group>
    </div>
    <n-divider style="margin: 15px 0" />
    <n-grid x-gap="2" :cols="2" style="align-items: center; margin-top: 5px">
        <n-gi>
            <n-form :rules="rules" :disabled="moduleStore.moduleConfig.EmotionSpam.enable">
                <n-space>
                    <n-form-item label="时间间隔" path="timeinterval">
                        <n-popover trigger="hover" style="max-width: 300px">
                            <template #trigger>
                                <n-input-number
                                    clearable
                                    :show-button="false"
                                    v-model:value="
                                        moduleStore.moduleConfig.EmotionSpam.timeinterval
                                    "
                                    placeholder="默认3，单位为秒"
                                    min="1"
                                    :precision="0"
                                >
                                    <template #suffix> 秒 </template>
                                </n-input-number>
                            </template>
                            <span
                                >弹幕发送时间间隔，默认为3秒，也是b站最快的发弹幕频率，当然这里可以设置小于该值</span
                            >
                        </n-popover>
                    </n-form-item>
                    <n-form-item label="时间限制" path="timelimit">
                        <n-popover trigger="hover">
                            <template #trigger>
                                <n-input-number
                                    clearable
                                    :show-button="false"
                                    v-model:value="moduleStore.moduleConfig.EmotionSpam.timelimit"
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
                </n-space>
            </n-form>
        </n-gi>
        <n-gi>
            <n-space
                justify="end"
                style="margin-top: 10px"
                v-if="!moduleStore.moduleConfig.EmotionSpam.enable"
            >
                <n-button
                    v-if="!moduleStore.moduleConfig.EmotionSpam.msg.length"
                    round
                    type="info"
                    @click="
                        moduleStore.moduleConfig.EmotionSpam.msg = biliStore.emotionData.flatMap(
                            (emoticons) => {
                                return emoticons.emoticons
                                    .filter((data) => data.perm !== 0)
                                    .map((data) => data.emoticon_unique)
                            }
                        )
                    "
                >
                    全选
                </n-button>
                <n-button
                    v-if="moduleStore.moduleConfig.EmotionSpam.msg.length"
                    round
                    type="info"
                    @click="moduleStore.moduleConfig.EmotionSpam.msg = []"
                    >清空</n-button
                >
                <n-button round @click="uiStore.uiConfig.isShowPanel = false">取消</n-button>
                <n-button round type="primary" @click="handleStartSpamer">开车</n-button>
            </n-space>
            <n-space
                justify="end"
                style="margin-top: 10px"
                v-if="moduleStore.moduleConfig.EmotionSpam.enable"
            >
                <n-button round @click="uiStore.uiConfig.isShowPanel = false">取消</n-button>
                <n-button round type="error" @click="handleStopSpamer">停车</n-button>
            </n-space>
        </n-gi>
    </n-grid>
</template>
