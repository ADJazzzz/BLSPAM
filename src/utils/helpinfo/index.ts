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
        },
        autoCheckUpdate: {
            title: '自动检测更新',
            content: () =>
                h('p', [
                    h(
                        'span',
                        '启用后，将会在脚本启动时自动检测更新，当然也可以手动检测更新。若检测到新版本，将会弹出通知。'
                    ),
                    h('br'),
                    h('span', '该功能默认开启。')
                ])
        }
    }
}

export default spHelpInfo
