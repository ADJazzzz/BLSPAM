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
    useMessage,
    useDialog
} from 'naive-ui'
import _ from 'lodash'
import { useModuleStore } from '../stores/useModuleStore'
import { useUIStore } from '../stores/useUIStore'

const moduleStore = useModuleStore()
const uiStore = useUIStore()
const message = useMessage()
const dialog = useDialog()

const rules = {
    timeinterval: {
        required: true,
        message: '最小为1',
        trigger: ['input', 'blur'],
        validator: () => {
            return moduleStore.moduleConfig.TextGroupSpam.timeinterval !== null
        }
    }
}
const handleTabsValueUpdate = (value: number) => {
    moduleStore.moduleConfig.TextGroupSpam.textGroupTabsValue = value
}
const closeDisable = computed(() => {
    return moduleStore.moduleConfig.TextGroupSpam.textGroupTabPanels.length > 1
})
const handleTabsAdd = () => {
    if (moduleStore.moduleConfig.TextGroupSpam.enable) {
        message.error('停车后才能添加')
    } else {
        const newKey =
            Math.max(
                ...moduleStore.moduleConfig.TextGroupSpam.textGroupTabPanels.map(
                    (panels) => panels.key
                )
            ) + 1
        const newName =
            Math.max(
                ...moduleStore.moduleConfig.TextGroupSpam.textGroupTabPanels.map(
                    (panels) => panels.name
                )
            ) + 1
        moduleStore.moduleConfig.TextGroupSpam.textGroupTabPanels.push({
            key: newKey,
            name: newName,
            tab: '',
            msg: ''
        })
        moduleStore.moduleConfig.TextGroupSpam.textGroupTabsValue = newName
    }
}
const handleTabsClose = (name: number) => {
    if (moduleStore.moduleConfig.TextGroupSpam.enable) {
        message.error('停车后才能删除')
    } else {
        dialog.warning({
            title: '删除',
            content: '确定要删除吗？',
            positiveText: '确定',
            negativeText: '再想想',
            onPositiveClick: () => {
                _.remove(moduleStore.moduleConfig.TextGroupSpam.textGroupTabPanels, { name })
                moduleStore.moduleConfig.TextGroupSpam.textGroupTabsValue = name - 1
            }
        })
    }
}
const handleStartSpamer = () => {
    const panelsWithEmptyMsg = _.filter(
        moduleStore.moduleConfig.TextGroupSpam.textGroupTabPanels,
        (panels) => _.isEmpty(panels.msg)
    )

    if (!_.isEmpty(panelsWithEmptyMsg)) {
        _.forEach(panelsWithEmptyMsg, (panels) => {
            message.error(`${panels.tab}还没填内容呢`)
        })
    } else {
        if (moduleStore.moduleConfig.TextGroupSpam.timeinterval === null) {
            message.error('没参数你车什么?')
        } else {
            uiStore.uiConfig.isShowPanel = false
            moduleStore.moduleConfig.TextGroupSpam.enable = true
            moduleStore.emitter.emit('TextGroupSpam', {
                module: 'TextGroupSpam'
            })
        }
    }
}
const handleStopSpamer = () => {
    moduleStore.moduleConfig.TextGroupSpam.enable = false
}
</script>

<template>
    <n-form :rules="rules" :disabled="moduleStore.moduleConfig.TextGroupSpam.enable">
        <n-form-item :show-label="false">
            <n-flex>
                <n-form-item label="时间间隔" path="timeinterval">
                    <n-popover trigger="hover" style="max-width: 300px" placement="bottom">
                        <template #trigger>
                            <n-input-number
                                clearable
                                :show-button="false"
                                v-model:value="moduleStore.moduleConfig.TextGroupSpam.timeinterval"
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
            </n-flex>
        </n-form-item>
        <n-form-item :show-feedback="false" :show-label="false">
            <n-tabs
                type="card"
                v-model:value="moduleStore.moduleConfig.TextGroupSpam.textGroupTabsValue"
                @update:value="handleTabsValueUpdate"
                addable
                :closable="closeDisable"
                @add="handleTabsAdd"
                @close="handleTabsClose"
            >
                <n-tab-pane
                    v-for="panels in moduleStore.moduleConfig.TextGroupSpam.textGroupTabPanels"
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
                            clearable
                            placeholder="最好写一下标题吧"
                        />
                    </n-form-item>
                    <n-form-item
                        label="发送内容"
                        show-require-mark
                        :validation-status="panels.msg === '' ? 'error' : undefined"
                    >
                        <n-input
                            v-model:value="panels.msg"
                            round
                            clearable
                            show-count
                            type="textarea"
                            placeholder="默认每次弹幕发送字数为20，超出20将自动分割到下一条弹幕"
                        />
                    </n-form-item>
                </n-tab-pane>
            </n-tabs>
        </n-form-item>
        <n-flex
            justify="end"
            style="margin-top: 10px"
            v-if="!moduleStore.moduleConfig.TextGroupSpam.enable"
        >
            <n-button round @click="uiStore.uiConfig.isShowPanel = false">取消</n-button>
            <n-button round type="primary" @click="handleStartSpamer">开车</n-button>
        </n-flex>
        <n-flex
            justify="end"
            style="margin-top: 10px"
            v-if="moduleStore.moduleConfig.TextGroupSpam.enable"
        >
            <n-button round @click="uiStore.uiConfig.isShowPanel = false">取消</n-button>
            <n-button round type="error" @click="handleStopSpamer">停车</n-button>
        </n-flex>
    </n-form>
</template>
