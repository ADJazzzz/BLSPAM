<script setup lang="ts">
import { NFlex, NSwitch, NButton } from 'naive-ui'
import InfoDialog from './Icons/InfoDialog.vue'
import { useModuleStore } from '../stores/useModuleStore'
import checkUpdate from '../modules/Setting/autoCheckUpdate'

const moduleStore = useModuleStore()
const manualCheckUpdate = new checkUpdate('ManualCheckUpdate')
</script>

<template>
    <n-flex vertical>
        <n-flex align="center"
            ><n-switch
                v-model:value="
                    moduleStore.moduleConfig.setting.saveSpamerStatus.enable
                " />保持独轮车开关状态<InfoDialog id="SettingView.saveSpamerStatus"
        /></n-flex>
        <n-flex align="center"
            ><n-switch
                v-model:value="moduleStore.moduleConfig.setting.autoCheckUpdate.enable"
            />自动检测更新<InfoDialog id="SettingView.autoCheckUpdate" /><n-button
                strong
                secondary
                round
                type="primary"
                @click="manualCheckUpdate.CheckUpdate()"
                >检测更新</n-button
            ></n-flex
        >
    </n-flex>
</template>
