import { defineStore } from 'pinia'
import { reactive, watch } from 'vue'
import _ from 'lodash'
import { uiConfig, menuIndex } from '@/types'
import Storage from '@/utils/storage'
import { unsafeWindow } from '$'

export const useUIStore = defineStore('ui', () => {
    const uiConfig: uiConfig = reactive(Storage.getUiConfig())

    const updateMenuValue = (key: menuIndex) => {
        uiConfig.activeMenuIndex = key
    }

    const isLiteRoom = () => {
        try {
            return (
                new URLSearchParams(window.location.search).get('liteVersion') === 'true' &&
                window.top !== window
            )
        } catch {
            return false
        }
    }
    const startThemeSync = () => {
        const sync = () => {
            let theme: 'dark' | 'light' = 'light'
            try {
                if (!isLiteRoom()) {
                    theme =
                        unsafeWindow?.bililiveThemeV2?.getTheme?.() === 'dark' ? 'dark' : 'light'
                }
            } catch {
                theme = 'light'
            }

            if (theme !== uiConfig.theme) {
                uiConfig.theme = theme
            }
        }

        sync()
        window.setInterval(sync, 1000)
    }

    watch(
        uiConfig,
        _.debounce((newUiConfig: uiConfig) => Storage.setUiConfig(newUiConfig), 350)
    )

    return { uiConfig, updateMenuValue, startThemeSync }
})
