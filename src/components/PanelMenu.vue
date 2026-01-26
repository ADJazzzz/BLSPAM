<script setup lang="ts">
import { h } from 'vue'
import type { Component } from 'vue'
import { NIcon, NMenu } from 'naive-ui'
import type { MenuOption } from 'naive-ui'
import { useUIStore } from '../stores/useUIStore'
import TextIcon from '@/assets/TextIcon.svg?component'
import EmotionIcon from '@/assets/EmotionIcon.svg?component'
import FavoritesIcon from '@/assets/FavoritesIcon.svg?component'
import SettingIcon from '@/assets/SettingIcon.svg?component'

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
    },
    {
        label: '收藏夹',
        key: 'FavoritesView',
        icon: renderIcon(FavoritesIcon)
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
