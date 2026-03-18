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

    Favorites: {
        enable: boolean
        timeinterval: number
        favoritesTabsValue: number
        favoritesTabPanels: favoritesTabPanels[]
    }

    setting: {
        saveSpamerStatus: {
            enable: boolean
        }
        autoCheckUpdate: {
            enable: boolean
        }
        danmakuModules: {
            enable: boolean
            mode: 'menu' | 'direct'
        }
        danmakuDetail: {
            enable: boolean
        }
    }
}

interface uiConfig {
    activeMenuIndex: menuIndex
    isShowPanel: boolean
    isCollapsed: boolean
    theme: 'dark' | 'light'
    roomInfo: roomInfoItem[]
}

type roomInfoItem = {
    uname: string
    roomid: number
    statusText: string
}

type favoritesTabPanels = {
    key: number
    name: number
    tab: string
    msg: string
}

type menuIndex = 'TextView' | 'EmotionView' | 'FavoritesView' | 'SettingView'

type moduleEmitter = {
    TextSpam: {
        module: string
    }
    EmotionSpam: {
        module: string
    }
    Favorites: {
        module: string
    }
}

export { modulesConfig, uiConfig, menuIndex, moduleEmitter, roomInfoItem }
