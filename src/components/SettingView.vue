<script setup lang="ts">
import { computed } from 'vue'
import { NPageHeader, NFlex, NSwitch, NButton } from 'naive-ui'
import InfoDialog from './helpInfoDialog.vue'
import { useModuleStore } from '@/stores/useModuleStore'
import checkUpdate from '@/modules/Setting/autoCheckUpdate'

const moduleStore = useModuleStore()
const manualCheckUpdate = new checkUpdate('ManualCheckUpdate')

const moduleLabelMap: Record<string, string> = {
    TextSpam: '文字独轮车',
    EmotionSpam: '表情独轮车',
    Favorites: '收藏'
}

const savedRoomEntries = computed(() => {
    return moduleStore.moduleConfig.setting.saveSpamerStatus.saveSpamerStatusList
})

const showSavedRooms = computed(() => {
    return (
        moduleStore.moduleConfig.setting.saveSpamerStatus.enable &&
        savedRoomEntries.value.length > 0
    )
})

const handleRemoveRoom = (roomid: number) => {
    const list = moduleStore.moduleConfig.setting.saveSpamerStatus.saveSpamerStatusList
    const index = list.findIndex((item) => item.roomid === roomid)
    if (index !== -1) {
        list.splice(index, 1)
    }
}

const handleDanmakuModeChange = () => {
    if (moduleStore.moduleConfig.setting.danmakuModules.mode === 'menu') {
        moduleStore.moduleConfig.setting.danmakuModules.mode = 'direct'
    } else {
        moduleStore.moduleConfig.setting.danmakuModules.mode = 'menu'
    }
}
</script>

<template>
    <n-page-header subtitle="设置" style="margin-bottom: 10px" />
    <n-flex vertical>
        <n-flex align="center"
            ><n-switch
                v-model:value="
                    moduleStore.moduleConfig.setting.saveSpamerStatus.enable
                " />保持独轮车开关状态<InfoDialog id="SettingView.saveSpamerStatus"
        /></n-flex>
        <n-flex v-if="showSavedRooms" align="center" :wrap="true">
            <span style="color: #909399; font-size: 12px; white-space: nowrap">已开启的直播间（点击直播间可移除保持）：</span>
            <n-button
                v-for="entry in savedRoomEntries"
                :key="entry.roomid"
                size="tiny"
                secondary
                round
                type="info"
                @click="handleRemoveRoom(entry.roomid)"
            >
                {{ entry.uname }}({{ entry.roomid }})
                {{ entry.modules.map((m) => moduleLabelMap[m] ?? m).join('、') }}
            </n-button>
        </n-flex>
        <n-flex align="center"
            ><n-switch
                v-model:value="moduleStore.moduleConfig.setting.danmakuModules.enable"
            />弹幕+1和弹幕复制<InfoDialog id="SettingView.danmakuModules" /> 目前模式为<NButton
                :focusable="false"
                quaternary
                size="tiny"
                type="info"
                @click="handleDanmakuModeChange"
                >{{
                    moduleStore.moduleConfig.setting.danmakuModules.mode === 'menu'
                        ? '菜单模式'
                        : '直接渲染模式'
                }}（点击切换模式）</NButton
            ></n-flex
        >
        <n-flex align="center"
            ><n-switch
                v-model:value="
                    moduleStore.moduleConfig.setting.danmakuDetail.enable
                " />显示弹幕详情<InfoDialog id="SettingView.danmakuDetail"
        /></n-flex>
        <n-flex align="center"
            ><n-switch
                v-model:value="moduleStore.moduleConfig.setting.autoCheckUpdate.enable"
            />自动检测更新<InfoDialog id="SettingView.autoCheckUpdate" /><n-button
                strong
                secondary
                round
                type="primary"
                @click="manualCheckUpdate.CheckUpdate('manual')"
                >检测更新</n-button
            ></n-flex
        >
    </n-flex>
</template>
