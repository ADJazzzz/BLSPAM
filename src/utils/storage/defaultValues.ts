import { modulesConfig, uiConfig } from '@/types'

interface defaultValues {
    ui: uiConfig
    modules: modulesConfig
}

export default {
    ui: {
        activeMenuIndex: 'TextView',
        isShowPanel: false,
        isCollapsed: true,
        theme: 'light',
        roomInfo: []
    },
    modules: {
        TextSpam: {
            enable: false,
            msg: '车',
            timeinterval: 5,
            textinterval: 20,
            timelimit: 0
        },
        EmotionSpam: {
            enable: false,
            timeinterval: 5,
            emotionViewSelectedID: 1,
            msg: [],
            timelimit: 0
        },
        Favorites: {
            enable: false,
            timeinterval: 5,
            favoritesTabsValue: 1,
            favoritesTabPanels: [
                {
                    key: 1,
                    name: 1,
                    tab: '第一个',
                    msg: ''
                }
            ]
        },
        setting: {
            saveSpamerStatus: {
                enable: false
            },
            autoCheckUpdate: {
                enable: true
            },
            danmakuModules: {
                enable: false,
                mode: 'menu'
            },
            danmakuDetail: {
                enable: true
            }
        }
    }
} as defaultValues
