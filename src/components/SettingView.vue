<script setup lang="ts">
import { NPageHeader, NFlex, NSwitch, NButton } from 'naive-ui'
import InfoDialog from './helpInfoDialog.vue'
import { useModuleStore } from '@/stores/useModuleStore'
import checkUpdate from '@/modules/Setting/autoCheckUpdate'

const moduleStore = useModuleStore()
const manualCheckUpdate = new checkUpdate('ManualCheckUpdate')
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
        <n-flex align="center"
            ><n-switch
                v-model:value="
                    moduleStore.moduleConfig.setting.danmakuModules.enable
                " />弹幕+1和弹幕复制<InfoDialog id="SettingView.danmakuModules"
        /> 目前模式为<NButton :focusable="false" quaternary size="tiny" type="info" @click="handleDanmakuModeChange">{{ moduleStore.moduleConfig.setting.danmakuModules.mode === 'menu' ? '菜单模式' : '直接渲染模式' }}</NButton></n-flex>
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
