import { defineStore } from 'pinia'
import { reactive, watch } from 'vue'
import _ from 'lodash'
import mitt from 'mitt'
import { modulesConfig, moduleEmitter } from '../types'
import Storage from '../utils/storage'
import * as defaultModules from '../modules/default'
import * as otherModules from '../modules'
import Logger from '../utils/logger'
import BaseModule from '../modules/BaseModule'

export const useModuleStore = defineStore('modules', () => {
    const moduleConfig: modulesConfig = reactive(Storage.getModuleConfig())
    const emitter = mitt<moduleEmitter>()

    function loadDefaultModules(): Promise<void[]> {
        const promiseArray: Promise<void>[] = []
        for (const [name, module] of Object.entries(defaultModules)) {
            promiseArray.push(
                new (module as new (moduleName: string) => BaseModule)(name).run() as Promise<void>
            )
        }
        return Promise.all<Promise<void>[]>(promiseArray)
    }

    function loadOtherModules(): Promise<void[]> {
        const promiseArray: Promise<void>[] = []
        for (const [name, module] of Object.entries(otherModules)) {
            promiseArray.push(
                new (module as new (moduleName: string) => BaseModule)(name).run() as Promise<void>
            )
        }
        return Promise.all<Promise<void>[]>(promiseArray)
    }

    async function loadModules(): Promise<void> {
        const logger = new Logger('LoadModules')
        let errorCount = 0
        try {
            await loadDefaultModules()
        } catch (error) {
            logger.error('加载默认模块出错', error)
            errorCount++
        }
        if (!errorCount) {
            try {
                await loadOtherModules()
            } catch (error) {
                logger.error('加载模块出错', error)
            }
        }
    }

    watch(
        moduleConfig,
        _.debounce((newUiConfig: modulesConfig) => Storage.setModuleConfig(newUiConfig), 350)
    )

    return { moduleConfig, loadModules, emitter }
})
