<script setup lang="ts">
import { h } from 'vue'
import type { Component } from 'vue'
import { NIcon, NMenu } from 'naive-ui'
import type { MenuOption } from 'naive-ui'
import { useUIStore } from '../stores/useUIStore'
import TextIcon from './Icons/TextIcon.vue'
import EmotionIcon from './Icons/EmotionIcon.vue'
import TextGroupIcon from './Icons/TextGroupIcon.vue'
import SettingIcon from './Icons/SettingIcon.vue'

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
        label: '文字池',
        key: 'TextGroupView',
        icon: renderIcon(TextGroupIcon)
    },
    {
        label: '表情',
        key: 'EmotionView',
        icon: renderIcon(EmotionIcon)
    },
    {
        label: '全局设置',
        key: 'SettingView',
        icon: renderIcon(SettingIcon)
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
