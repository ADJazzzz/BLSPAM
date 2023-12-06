<script setup lang="ts">
import { h } from 'vue'
import type { Component } from 'vue'
import { NIcon, NMenu } from 'naive-ui'
import type { MenuOption } from 'naive-ui'
import { useUIStore } from '../stores/useUIStore'
import TextIcon from './Icons/TextIcon.vue'
import EmotionIcon from './Icons/EmotionIcon.vue'

const uiStore = useUIStore()

function renderIcon(icon: Component) {
    return () => h(NIcon, null, { default: () => h(icon) })
}

const menuOptions: MenuOption[] = [
    {
        label: '文字',
        key: 'TextView',
        icon: renderIcon(TextIcon)
    },
    {
        label: '表情',
        key: 'EmotionView',
        icon: renderIcon(EmotionIcon)
    }
]
</script>

<template>
    <n-menu
        :collapsed-width="64"
        :collapsed-icon-size="22"
        :options="menuOptions"
        @update:value="uiStore.updateMenuValue"
        v-model:value="uiStore.uiConfig.activeMenuIndex"
    />
</template>
