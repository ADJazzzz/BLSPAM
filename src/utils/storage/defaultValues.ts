import { modulesConfig, uiConfig } from '../../types'

interface defaultValues {
    ui: uiConfig
    modules: modulesConfig
}

export default {
    ui: {
        activeMenuIndex: 'TextView',
        isShowPanel: false,
        isCollapsed: false,
        theme: 'light'
    },
    modules: {
        TextSpam: {
            enable: false,
            msg: '车了可能会被禁，但不车就等于一直被禁',
            timeinterval: 3,
            textinterval: 20,
            timelimit: 0
        },
        EmotionSpam: {
            enable: false,
            timeinterval: 3,
            emotionViewSelectedID: 1,
            msg: [],
            timelimit: 0
        },
        TextGroupSpam: {
            enable: false,
            timeinterval: 3,
            textGroupTabsValue: 1,
            textGroupTabPanels: [
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
                enable: false
            }
        }
    }
} as defaultValues
