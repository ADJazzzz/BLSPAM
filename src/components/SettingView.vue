<script setup lang="ts">
import { NFlex, NSwitch } from 'naive-ui'
import InfoDialog from './Icons/InfoDialog.vue'
import { useModuleStore } from '../stores/useModuleStore'

const moduleStore = useModuleStore()
</script>

<template>
    <n-flex vertical>
        <n-flex align="center"
            ><n-switch
                v-model:value="
                    moduleStore.moduleConfig.setting.saveSpamerStatus.enable
                " />保持独轮车开关状态<InfoDialog id="SettingView.saveSpamerStatus"
        /></n-flex>
    </n-flex>
</template>
