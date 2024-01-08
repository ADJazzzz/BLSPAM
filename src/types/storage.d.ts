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
}

type menuIndex = 'TextView' | 'EmotionView'

interface uiConfig {
    activeMenuIndex: menuIndex
    isShowPanel: boolean
    isCollapsed: boolean
}

type moduleEmitter = {
    TextSpam: {
        module: string
    }
    EmotionSpam: {
        module: string
    }
}

export { modulesConfig, uiConfig, menuIndex, moduleEmitter }
