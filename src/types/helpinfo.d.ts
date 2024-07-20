import { VNodeChild } from 'vue'

interface HelpInfoItem {
    title: string
    content: string | (() => VNodeChild)
}

interface HelpInfo {
    SettingView: {
        saveSpamerStatus: HelpInfoItem
        autoCheckUpdate: HelpInfoItem
    }
}

export { HelpInfoItem, HelpInfo }
