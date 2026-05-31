import { createDiscreteApi, darkTheme, lightTheme } from 'naive-ui'
import type { ConfigProviderProps } from 'naive-ui'
import { computed } from 'vue'
import { useUIStore } from '@/stores/useUIStore'
import { useModuleStore } from '@/stores/useModuleStore'
import { modulesConfig, roomInfoItem } from '@/types'

type RunningSpamer = '文字' | '表情' | '收藏'

export const useDiscreteAPI = <T extends ('message' | 'dialog' | 'notification' | 'loadingBar')[]>(
    apis: T,
    disable: boolean = false
) => {
    if (disable) {
        const emptyAPI: Record<string, any> = {}
        apis.forEach((api) => {
            emptyAPI[api] = new Proxy(
                {},
                {
                    get: () => () => {}
                }
            )
        })
        return emptyAPI
    }

    const uiStore = useUIStore()

    const discreteAPIConfig = computed<ConfigProviderProps>(() => ({
        theme: uiStore.uiConfig.theme === 'dark' ? darkTheme : lightTheme
    }))

    const options = {
        configProviderProps: discreteAPIConfig
    }

    return createDiscreteApi(apis, options)
}

export const getRoomStatusText = (moduleConfig: modulesConfig): string => {
    const running: RunningSpamer[] = []

    if (moduleConfig.TextSpam.enable) running.push('文字')
    if (moduleConfig.EmotionSpam.enable) running.push('表情')
    if (moduleConfig.Favorites.enable) running.push('收藏')

    if (running.length === 0) return '闲置中'

    return `正在运行${running.join('、')}独轮车中`
}

export const updateRoomInfoItem = (
    list: roomInfoItem[],
    nextItem: roomInfoItem
): roomInfoItem[] => {
    const index = list.findIndex((item) => item.roomid === nextItem.roomid)

    if (index === -1) {
        return [...list, nextItem]
    }

    const nextList = [...list]
    nextList[index] = nextItem
    return nextList
}

export const formatRoomInfoText = (list: roomInfoItem[]): string => {
    return list.map((item) => `${item.uname}(${item.roomid})-${item.statusText}`).join(' / ')
}

export const updateSaveSpamerStatusList = (
    roomId: number | undefined,
    moduleName: string,
    enabled: boolean,
    uname?: string
) => {
    if (!roomId) return
    const moduleStore = useModuleStore()
    const list = moduleStore.moduleConfig.setting.saveSpamerStatus.saveSpamerStatusList
    const index = list.findIndex((item) => item.roomid === roomId)

    if (enabled) {
        if (index === -1) {
            list.push({ uname: uname ?? '未知主播', roomid: roomId, modules: [moduleName] })
            return
        }
        const entry = list[index]
        if (!entry.modules.includes(moduleName)) {
            list[index] = { ...entry, modules: [...entry.modules, moduleName] }
        }
        return
    }

    if (index === -1) return
    const entry = list[index]
    const next = entry.modules.filter((m) => m !== moduleName)
    if (next.length === 0) {
        list.splice(index, 1)
    } else {
        list[index] = { ...entry, modules: next }
    }
}
