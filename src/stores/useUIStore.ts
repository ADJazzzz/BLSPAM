import { defineStore } from 'pinia'
import { reactive, watch } from 'vue'
import _ from 'lodash'
import { uiConfig, menuIndex } from '@/types'
import Storage from '@/utils/storage'
import { GM_addValueChangeListener } from '$'

export const useUIStore = defineStore('ui', () => {
    const uiConfig: uiConfig = reactive(Storage.getUiConfig())

    const updateMenuValue = (key: menuIndex) => {
        uiConfig.activeMenuIndex = key
    }

    let themeObserver: MutationObserver | null = null
    const startThemeSync = () => {
        if (themeObserver) return
        const sync = () => {
            const labStyle = document.documentElement.getAttribute('lab-style') || ''
            const theme: 'dark' | 'light' = labStyle.includes('dark') ? 'dark' : 'light'
            if (theme !== uiConfig.theme) {
                uiConfig.theme = theme
            }
        }

        sync()
        themeObserver = new MutationObserver(_.debounce(sync, 300))
        themeObserver.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['lab-style']
        })
    }

    const applyRoomInfo = (roomInfo: any) => {
        uiConfig.roomInfo = Storage.cleanRoomInfo(roomInfo)
    }
    const multiSync = () => {
        if (typeof GM_addValueChangeListener === 'function') {
            GM_addValueChangeListener('ui', (_key, _oldValue, newValue, remote) => {
                if (!remote) return
                applyRoomInfo(newValue?.roomInfo)
            })
        }
    }

    watch(
        uiConfig,
        _.debounce((newUiConfig: uiConfig) => {
            const latestUiConfig = Storage.getUiConfig()
            Storage.setUiConfig({
                ...newUiConfig,
                roomInfo: latestUiConfig.roomInfo
            })
        }, 350)
    )

    return { uiConfig, updateMenuValue, startThemeSync, multiSync }
})
