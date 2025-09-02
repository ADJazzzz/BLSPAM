import { createDiscreteApi, darkTheme, lightTheme } from 'naive-ui'
import type { ConfigProviderProps } from 'naive-ui'
import { computed } from 'vue'
import { useUIStore } from '../../stores/useUIStore'

export function useDiscreteApi<T extends ('message' | 'dialog' | 'notification' | 'loadingBar')[]>(
    apis: T
) {
    const uiStore = useUIStore()
    
    const discreteAPIConfig = computed<ConfigProviderProps>(() => ({
        theme: uiStore.uiConfig.theme === 'dark' ? darkTheme : lightTheme
    }))
    
    const options = {
        configProviderProps: discreteAPIConfig
    }
    
    return createDiscreteApi(apis, options)
}
