type RoomSpamerStatus = {
    TextSpam: boolean
    EmotionSpam: boolean
    Favorites: boolean
}

interface modulesConfig {
    TextSpam: {
        enable: boolean
        msg: string
        timeinterval: number
        timeintervalMax: number
        randomize: boolean
        textinterval: number
        timelimit: number
    }

    EmotionSpam: {
        enable: boolean
        timeinterval: number
        timeintervalMax: number
        randomize: boolean
        emotionViewSelectedID: number
        msgByRoom: Record<string, string[]>
        timelimit: number
    }

    Favorites: {
        enable: boolean
        timeintervalMax: number
        timeinterval: number
        randomize: boolean
        favoritesTabsValue: number
        favoritesTabPanels: favoritesTabPanels[]
    }

    setting: {
        saveSpamerStatus: {
            enable: boolean
            saveSpamerStatusList: saveSpamerStatusListItem[]
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

type saveSpamerStatusListItem = {
    uname: string
    roomid: number
    modules: string[]
}

type roomInfoItem = {
    uname: string
    roomid: number
    statusText: string
    updateTime: number
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

export { modulesConfig, uiConfig, menuIndex, moduleEmitter, roomInfoItem, RoomSpamerStatus }
