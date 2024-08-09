import { defineStore } from 'pinia'
import { reactive, watch } from 'vue'
import _ from 'lodash'
import { uiConfig, menuIndex } from '../types'
import Storage from '../utils/storage'

export const useUIStore = defineStore('ui', () => {
    const uiConfig: uiConfig = reactive(Storage.getUiConfig())

    const updateMenuValue = (key: menuIndex) => {
        uiConfig.activeMenuIndex = key
    }

    watch(
        uiConfig,
        _.debounce((newUiConfig: uiConfig) => Storage.setUiConfig(newUiConfig), 350)
    )

    return { uiConfig, updateMenuValue }
})
