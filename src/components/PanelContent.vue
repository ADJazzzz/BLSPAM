<script lang="ts">
import { defineComponent } from 'vue'
import TextView from './TextView.vue'
import EmotionView from './EmotionView.vue'
import TextGroupView from './TextGroupView.vue'
import SettingView from './SettingView.vue'
import { useUIStore } from '../stores/useUIStore'

export default defineComponent({
    components: {
        TextView,
        TextGroupView,
        EmotionView,
        SettingView
    },
    setup() {
        const uiStore = useUIStore()
        return {
            uiStore
        }
    }
})
</script>

<template>
    <component :is="uiStore.uiConfig.activeMenuIndex"></component>
</template>
