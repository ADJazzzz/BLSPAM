<script setup lang="ts">
import {
    NButton,
    NForm,
    NFormItem,
    NInput,
    NInputNumber,
    NPopover,
    NSpace,
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
        moduleStore.moduleConfig.TextSpam.timeinterval === null
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
        message: '最小为1000',
        trigger: ['input', 'blur'],
        validator: () => {
            if (moduleStore.moduleConfig.TextSpam.timeinterval >= 1000) {
                return true
            } else {
                return false
            }
        }
    },
    textinterval: {
        required: true,
        message: '输入一个大于0，小于30的数字',
        trigger: ['input', 'blur'],
        validator: () => {
            if (moduleStore.moduleConfig.TextSpam.textinterval >= 1) {
                return true
            } else {
                return false
            }
        }
    },
    msg: {
        required: true,
        message: '没内容你车什么',
        trigger: ['input', 'blur'],
        validator: () => {
            if (moduleStore.moduleConfig.TextSpam.msg.length > 0) {
                return true
            } else {
                return false
            }
        }
    }
}
</script>

<template>
    <n-form :rules="rules" :disabled="moduleStore.moduleConfig.TextSpam.enable">
        <n-form-item>
            <n-space align="center">
                <n-form-item label="时间间隔" path="timeinterval">
                    <n-popover trigger="hover" style="max-width: 300px" placement="bottom">
                        <template #trigger>
                            <n-input-number
                                clearable
                                :show-button="false"
                                v-model:value="moduleStore.moduleConfig.TextSpam.timeinterval"
                                placeholder="默认3000，单位为毫秒(ms)"
                                min="1000"
                                :precision="0"
                            />
                        </template>
                        <span
                            >弹幕发送时间间隔，默认为3秒（3000ms），也是b站最快的发弹幕频率，当然这里可以设置小于该值</span
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
            </n-space>
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
    </n-form>
    <n-space
        justify="end"
        style="margin-top: 10px"
        v-if="!moduleStore.moduleConfig.TextSpam.enable"
    >
        <n-button round @click="uiStore.uiConfig.isShowPanel = false">取消</n-button>
        <n-button round type="primary" @click="handleStartSpamer">开车</n-button>
    </n-space>
    <n-space justify="end" style="margin-top: 10px" v-if="moduleStore.moduleConfig.TextSpam.enable">
        <n-button round @click="uiStore.uiConfig.isShowPanel = false">取消</n-button>
        <n-button round type="error" @click="handleStopSpamer">停车</n-button>
    </n-space>
</template>
