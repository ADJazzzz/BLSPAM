import { modulesConfig, uiConfig } from '../../types'

interface defaultValues {
    ui: uiConfig
    modules: modulesConfig
}

export default {
    ui: {
        activeMenuIndex: 'TextView',
        isShowPanel: false,
        isCollapsed: false
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
            timeinterval: 3000,
            emotionViewSelectedID: 100,
            msg: [],
            timelimit: 0
        }
    }
} as defaultValues
