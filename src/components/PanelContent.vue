<script lang="ts">
import { defineComponent } from 'vue'
import TextView from './TextView.vue'
import EmotionView from './EmotionView.vue'
import { useUIStore } from '../stores/useUIStore'

export default defineComponent({
    components: {
        TextView,
        EmotionView
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
