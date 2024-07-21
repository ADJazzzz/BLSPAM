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
        danmakuModules: {
            title: '弹幕+1和弹幕复制',
            content: () => h('p',[
                h('span', '启用后，会在弹幕菜单中提供弹幕+1和弹幕复制功能。（点击弹幕列表即可触发弹幕菜单，该功能只支持文字弹幕）'),
                h('br'),
                h('span', { style: {color: '#FF0000', fontWeight: 'bold'} }, '温馨提示：B站的弹幕菜单有问题，如果你在太低的地方触发，它有可能会无法完全显示所有选项。'),
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
                        '启用后，将会在脚本启动时自动检测更新，当然也可以手动检测更新。检测到新版本，会在左上角弹出通知。'
                    ),
                    h('br'),
                    h('span', '该功能默认开启。')
                ])
        }
    }
}

export default spHelpInfo
