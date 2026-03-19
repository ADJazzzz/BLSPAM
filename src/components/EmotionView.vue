<script setup lang="ts">
import { computed, watch } from 'vue'
import {
    NAvatar,
    NDivider,
    NCheckboxGroup,
    NCheckbox,
    NPopover,
    NButton,
    NForm,
    NFormItem,
    NInputNumber,
    NFlex,
    NPageHeader,
    useMessage
} from 'naive-ui'
import { useBiliStore } from '@/stores/useBiliStore'
import { useModuleStore } from '@/stores/useModuleStore'
import { useUIStore } from '@/stores/useUIStore'
import stop from '@/modules/Spamer/emotionSpamer'

const biliStore = useBiliStore()
const moduleStore = useModuleStore()
const uiStore = useUIStore()
const message = useMessage()
const emStop = new stop('StopEmotionSpamer')

const allEmotionPackages = computed(() =>
    biliStore.emotionData.filter((data) => data.pkg_id !== 100)
)
const roomEmotionPackages = computed(() =>
    allEmotionPackages.value.filter((data) => data.pkg_type === 2)
)
const commonEmotionPackages = computed(() =>
    allEmotionPackages.value.filter((data) => data.pkg_type !== 2)
)
const currentRoomID = computed<number | null>(
    () => biliStore.BilibiliLive?.ROOMID ?? biliStore.masterInfo?.room_id ?? null
)
const currentRoomKey = computed<string | null>(() =>
    currentRoomID.value !== null ? String(currentRoomID.value) : null
)
const currentRoomEmotionMsg = computed(() => {
    if (!currentRoomKey.value) return []
    return moduleStore.moduleConfig.EmotionSpam.msgByRoom[currentRoomKey.value] ?? []
})
const selectedEmotionPackage = computed(() => {
    const selectedID = moduleStore.moduleConfig.EmotionSpam.emotionViewSelectedID
    return allEmotionPackages.value.find((data) => data.pkg_id === selectedID) ?? null
})
const selectedEmotionList = computed(() => {
    const allEmotions = allEmotionPackages.value.flatMap((pkg) => pkg.emoticons)
    return currentRoomEmotionMsg.value
        .map((unique) => allEmotions.find((emotion) => emotion.emoticon_unique === unique))
        .filter((emotion): emotion is NonNullable<typeof emotion> => Boolean(emotion))
})

const updateCurrentRoomEmotionMsg = (value: (string | number)[]) => {
    if (!currentRoomKey.value) return
    moduleStore.moduleConfig.EmotionSpam.msgByRoom[currentRoomKey.value] = value.map(String)
}
const handleRemoveSelectedEmotion = (unique: string) => {
    updateCurrentRoomEmotionMsg(currentRoomEmotionMsg.value.filter((item) => item !== unique))
}

const handleClick = (id: number) => {
    moduleStore.moduleConfig.EmotionSpam.emotionViewSelectedID = id
}

const rules = {
    timeinterval: {
        required: true,
        message: '最小为1',
        trigger: ['input', 'blur'],
        validator: () => {
            return moduleStore.moduleConfig.EmotionSpam.timeinterval !== null
        }
    },
    timelimit: {
        required: true,
        message: '输入一个大于等于0的数字',
        trigger: ['input', 'blur'],
        validator: () => {
            return moduleStore.moduleConfig.EmotionSpam.timelimit !== null
        }
    }
}
const handleStartSpamer = () => {
    if (currentRoomEmotionMsg.value.length === 0) {
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
    emStop.stop()
}

watch(
    allEmotionPackages,
    (packages) => {
        if (packages.length === 0) return

        const selectedID = moduleStore.moduleConfig.EmotionSpam.emotionViewSelectedID
        const hasSelectedPackage = packages.some((item) => item.pkg_id === selectedID)

        if (!hasSelectedPackage) {
            moduleStore.moduleConfig.EmotionSpam.emotionViewSelectedID = packages[0].pkg_id
        }
    },
    { immediate: true }
)
</script>

<template>
    <n-page-header subtitle="表情独轮车，好用爱用" style="margin-bottom: 10px" />
    <div id="selectedEmo" style="margin-bottom: 10px">
        <n-flex justify="space-between" align="center" style="margin-bottom: 6px">
            <span>已选表情</span>
            <n-button
                text
                type="info"
                size="small"
                :disabled="
                    !currentRoomKey ||
                    currentRoomEmotionMsg.length === 0 ||
                    moduleStore.moduleConfig.EmotionSpam.enable
                "
                @click="updateCurrentRoomEmotionMsg([])"
            >
                清空当前房间所有已选表情
            </n-button>
        </n-flex>
        <n-flex v-if="selectedEmotionList.length > 0" wrap>
            <n-flex
                v-for="emotion in selectedEmotionList"
                :key="emotion.emoticon_id"
                align="center"
                style="padding: 4px 6px"
            >
                <n-popover>
                    <template #trigger>
                        <n-avatar
                            :color="uiStore.uiConfig.theme === 'dark' ? '#101014' : 'white'"
                            :size="36"
                            :src="emotion.url"
                            object-fit="contain"
                        />
                    </template>
                    <span>{{ emotion.emoji }}</span>
                </n-popover>
                <n-button
                    text
                    type="error"
                    size="tiny"
                    :disabled="moduleStore.moduleConfig.EmotionSpam.enable"
                    @click="handleRemoveSelectedEmotion(emotion.emoticon_unique)"
                >
                    ❌
                </n-button>
            </n-flex>
        </n-flex>
        <span v-else style="color: #909399">当前房间暂无已选表情</span>
    </div>
    <n-divider style="margin: 5px 0" />
    <div id="emotionTab">
        <div v-if="roomEmotionPackages.length > 0" style="margin-bottom: 8px">
            <div style="margin-bottom: 4px">房间表情</div>
            <n-flex justify="start">
                <div
                    style="padding: 0 5px"
                    v-for="data in roomEmotionPackages"
                    :key="data.pkg_id"
                    :id="data.pkg_id.toString()"
                    @click="handleClick(data.pkg_id)"
                >
                    <n-avatar
                        :color="uiStore.uiConfig.theme === 'dark' ? '#101014' : 'white'"
                        :src="data.current_cover"
                        :size="35"
                    />
                </div>
            </n-flex>
        </div>

        <div>
            <div style="margin-bottom: 4px">通用表情</div>
            <n-flex justify="start">
                <div
                    style="padding: 0 5px"
                    v-for="data in commonEmotionPackages"
                    :key="data.pkg_id"
                    :id="data.pkg_id.toString()"
                    @click="handleClick(data.pkg_id)"
                >
                    <n-avatar
                        :color="uiStore.uiConfig.theme === 'dark' ? '#101014' : 'white'"
                        :src="data.current_cover"
                        :size="35"
                    />
                </div>
            </n-flex>
        </div>
    </div>
    <n-divider style="margin: 8px 0" />
    <div
        id="emotionContent"
        v-if="moduleStore.moduleConfig.EmotionSpam.emotionViewSelectedID !== null"
    >
        <n-checkbox-group
            :value="currentRoomEmotionMsg"
            @update:value="updateCurrentRoomEmotionMsg"
            :disabled="!currentRoomKey"
        >
            <n-flex style="padding-top: 5px">
                <n-checkbox
                    :value="data.emoticon_unique"
                    v-for="data in selectedEmotionPackage?.emoticons"
                    :key="data.emoticon_id"
                    :disabled="data.perm === 0 || moduleStore.moduleConfig.EmotionSpam.enable"
                >
                    <n-popover>
                        <template #trigger>
                            <n-avatar
                                :color="uiStore.uiConfig.theme === 'dark' ? '#101014' : 'white'"
                                :size="60"
                                :src="data.url"
                                object-fit="contain"
                            />
                        </template>
                        <span>{{ data.emoji }}</span>
                    </n-popover>
                </n-checkbox>
            </n-flex>
        </n-checkbox-group>
    </div>
    <n-divider style="margin: 15px 0" />
    <n-flex justify="space-between" align="center">
        <n-form :rules="rules" :disabled="moduleStore.moduleConfig.EmotionSpam.enable">
            <n-flex>
                <n-form-item label="时间间隔" path="timeinterval">
                    <n-popover trigger="hover" style="max-width: 300px">
                        <template #trigger>
                            <n-input-number
                                clearable
                                :show-button="false"
                                v-model:value="moduleStore.moduleConfig.EmotionSpam.timeinterval"
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
            </n-flex>
        </n-form>
        <n-flex
            justify="end"
            style="margin-top: 10px"
            v-if="!moduleStore.moduleConfig.EmotionSpam.enable"
        >
            <n-button round @click="uiStore.uiConfig.isShowPanel = false">取消</n-button>
            <n-button round type="primary" @click="handleStartSpamer">开车</n-button>
        </n-flex>
        <n-flex
            justify="end"
            style="margin-top: 10px"
            v-if="moduleStore.moduleConfig.EmotionSpam.enable"
        >
            <n-button round @click="uiStore.uiConfig.isShowPanel = false">取消</n-button>
            <n-button round type="error" @click="handleStopSpamer">停车</n-button>
        </n-flex>
    </n-flex>
</template>
