import _ from 'lodash'
import { GM_getValue, GM_setValue } from '$'
import defaultValues from './defaultValues'
import { modulesConfig, uiConfig } from '../../types'

class Storage {
    private static mergeConfigs(current_config_item: any, default_config_item: any): any {
        const mergedConfig = _.merge({}, default_config_item, current_config_item)
        return _.omitBy(mergedConfig, _.isUndefined)
    }

    public static setUiConfig(uiConfig: uiConfig) {
        GM_setValue('ui', uiConfig)
    }

    public static getUiConfig(): uiConfig {
        const currentUiConfig = GM_getValue('ui', {})
        return this.mergeConfigs(currentUiConfig, defaultValues.ui)
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
