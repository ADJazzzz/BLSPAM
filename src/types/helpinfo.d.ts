import { VNodeChild } from 'vue'

interface HelpInfoItem {
    title: string
    content: string | (() => VNodeChild)
}

interface HelpInfo {
    SettingView: {
        saveSpamerStatus: HelpInfoItem
        autoCheckUpdate: HelpInfoItem
        danmakuModules: HelpInfoItem
    }
}

export { HelpInfoItem, HelpInfo }
