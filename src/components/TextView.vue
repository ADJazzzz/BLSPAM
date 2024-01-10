<script setup lang="ts">
import {
    NButton,
    NForm,
    NFormItem,
    NInput,
    NInputNumber,
    NPopover,
    NFlex,
    useMessage
} from 'naive-ui'
import { useUIStore } from '../stores/useUIStore'
import { useModuleStore } from '../stores/useModuleStore'

const uiStore = useUIStore()
const moduleStore = useModuleStore()
const message = useMessage()

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
    moduleStore.moduleConfig.TextSpam.enable = false
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
        message: '输入一个大于0，小于30的数字',
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
        <n-form-item>
            <n-flex align="center">
                <n-form-item label="时间间隔" path="timeinterval">
                    <n-popover trigger="hover" style="max-width: 300px">
                        <template #trigger>
                            <n-input-number
                                clearable
                                :show-button="false"
                                v-model:value="moduleStore.moduleConfig.TextSpam.timeinterval"
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
                <n-form-item label="数量间隔" path="textinterval">
                    <n-popover trigger="hover">
                        <template #trigger>
                            <n-input-number
                                clearable
                                :show-button="false"
                                v-model:value="moduleStore.moduleConfig.TextSpam.textinterval"
                                placeholder="默认20"
                                min="1"
                                max="30"
                                :precision="0"
                            />
                        </template>
                        <span>每次弹幕发送字数，最大为30</span>
                    </n-popover>
                </n-form-item>
                <n-form-item label="时间限制" path="timelimit">
                    <n-popover trigger="hover">
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
        <n-form-item label="发送内容" path="msg">
            <n-input
                round
                clearable
                type="textarea"
                show-count
                v-model:value="moduleStore.moduleConfig.TextSpam.msg"
                placeholder="车了可能会被禁，但不车就等于一直被禁"
            />
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
