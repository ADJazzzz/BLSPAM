import { h } from 'vue'
import { HelpInfo } from '../../types'

const spHelpInfo: HelpInfo = {
    SettingView: {
        saveSpamerStatus: {
            title: '保持独轮车开关状态',
            content: () =>
                h('p', [
                    h('span', '启用后，独轮车开关状态将会被保持，下次启动时会自动恢复。'),
                    h('br'),
                    h('span', '该功能默认关闭。')
                ])
        }
    }
}

export default spHelpInfo
