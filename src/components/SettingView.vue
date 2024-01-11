<script setup lang="ts">
import { NFlex, NSwitch } from 'naive-ui'
import InfoDialog from './Icons/InfoDialog.vue'
</script>

<template>
    <n-flex vertical>
        <n-flex align="center"
            ><n-switch />保持独轮车开关状态<InfoDialog id="SettingView.saveSpamerStatus"
        /></n-flex>
    </n-flex>
</template>
