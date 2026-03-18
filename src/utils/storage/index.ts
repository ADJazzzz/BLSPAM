import _ from 'lodash'
import { GM_getValue, GM_setValue } from '$'
import defaultValues from './defaultValues'
import { modulesConfig, uiConfig, roomInfoItem } from '@/types'

class Storage {
    private static normalizeRoomInfo(roomInfo: any): roomInfoItem[] {
        if (!Array.isArray(roomInfo)) return []

        return roomInfo
            .map((item) => {
                if (!item || typeof item !== 'object') return null
                const uname = (item as { uname?: string }).uname
                const roomid = (item as { roomid?: number }).roomid
                const statusText = (item as { statusText?: string }).statusText
                if (typeof uname !== 'string' || uname.length === 0) return null
                if (typeof roomid !== 'number' || !Number.isFinite(roomid)) return null
                return {
                    uname,
                    roomid,
                    statusText:
                        typeof statusText === 'string' && statusText.length > 0
                            ? statusText
                            : '空闲中'
                }
            })
            .filter((item): item is roomInfoItem => item !== null)
    }

    private static mergeConfigs(current_config_item: any, default_config_item: any): any {
        // 只保留默认配置中存在的键
        const cleanConfig = _.pick(current_config_item, Object.keys(default_config_item))
        const result: Record<string, any> = {}
        // 递归处理
        Object.keys(default_config_item).forEach((key) => {
            if (_.isPlainObject(default_config_item[key])) {
                // 对嵌套对象递归合并
                result[key] = this.mergeConfigs(cleanConfig[key], default_config_item[key])
            } else {
                // 非对象类型，优先使用当前配置值，否则使用默认值
                result[key] =
                    cleanConfig[key] !== undefined ? cleanConfig[key] : default_config_item[key]
            }
        })

        return _.omitBy(result, _.isUndefined)
    }

    public static setUiConfig(uiConfig: uiConfig) {
        GM_setValue('ui', {
            ...uiConfig,
            roomInfo: this.normalizeRoomInfo(uiConfig.roomInfo)
        })
    }

    public static getUiConfig(): uiConfig {
        const currentUiConfig = GM_getValue('ui', {})
        const mergedUiConfig = this.mergeConfigs(currentUiConfig, defaultValues.ui) as uiConfig
        return {
            ...mergedUiConfig,
            roomInfo: this.normalizeRoomInfo(mergedUiConfig.roomInfo)
        }
    }

    public static setModuleConfig(moduleConfig: modulesConfig) {
        GM_setValue('modules', moduleConfig)
    }

    public static getModuleConfig(): modulesConfig {
        const currentModuleConfig = GM_getValue('modules', {})
        return this.mergeConfigs(currentModuleConfig, defaultValues.modules)
    }
}

export default Storage
