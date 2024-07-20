interface modulesConfig {
    TextSpam: {
        enable: boolean
        msg: string
        timeinterval: number
        textinterval: number
        timelimit: number
    }

    EmotionSpam: {
        enable: boolean
        timeinterval: number
        emotionViewSelectedID: number
        msg: string[]
        timelimit: number
    }

    TextGroupSpam: {
        enable: boolean
        timeinterval: number
        textGroupTabsValue: number
        textGroupTabPanels: textGroupTabPanels[]
    }

    setting: {
        saveSpamerStatus: {
            enable: boolean
        }
        autoCheckUpdate: {
            enable: boolean
        }
    }
}

interface uiConfig {
    activeMenuIndex: menuIndex
    isShowPanel: boolean
    isCollapsed: boolean
}

type textGroupTabPanels = {
    key: number
    name: number
    tab: string
    msg: string
}

type menuIndex = 'TextView' | 'EmotionView' | 'TextGroupView' | 'SettingView'

type moduleEmitter = {
    TextSpam: {
        module: string
    }
    EmotionSpam: {
        module: string
    }
    TextGroupSpam: {
        module: string
    }
}

export { modulesConfig, uiConfig, menuIndex, moduleEmitter }
