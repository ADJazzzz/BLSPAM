import { defineStore } from 'pinia'
import { reactive, watch } from 'vue'
import _ from 'lodash'
import mitt from 'mitt'
import { modulesConfig, moduleEmitter } from '../types'
import Storage from '../utils/storage'
import * as defaultModules from '../modules/default'
import * as otherModules from '../modules'
import Logger from '../utils/logger'

export const useModuleStore = defineStore('modules', () => {
    const moduleConfig: modulesConfig = reactive(Storage.getModuleConfig())
    const emitter = mitt<moduleEmitter>()

    function loadDefaultModules(): Promise<void[]> {
        const promiseArray: Promise<void>[] = []
        for (const [name, module] of Object.entries(defaultModules)) {
            promiseArray.push(new module(name).run())
        }
        return Promise.all<Promise<void>[]>(promiseArray)
    }

    function loadOtherModules(): Promise<void[]> {
        const promiseArray: Promise<void>[] = []
        for (const [name, module] of Object.entries(otherModules)) {
            promiseArray.push(new module(name).run())
        }
        return Promise.all<Promise<void>[]>(promiseArray)
    }

    async function loadModules(): Promise<void> {
        const logger = new Logger('LoadModules')
        let errorCount = 0
        let retryCount = 0
        const maxRetries = 2
        const retryDelay = 200
    
        while (retryCount <= maxRetries) {
            try {
                await loadDefaultModules()
                break
            } catch (error) {
                logger.error(`重试次数: ${retryCount + 1}`, error)
                errorCount++
                retryCount++
                if (retryCount <= maxRetries) {
                    await new Promise(resolve => setTimeout(resolve, retryDelay))
                } else {
                    logger.error('达到最大重试次数，终止运行')
                    break
                }
            }
        }
    
        if (errorCount < maxRetries) {
            try {
                await loadOtherModules()
            } catch (error) {
                logger.error('加载模块出错', error)
            }
        }
    }

    watch(
        moduleConfig,
        _.debounce(
            (newModuleConfig: modulesConfig) => Storage.setModuleConfig(newModuleConfig),
            350
        )
    )

    return { moduleConfig, loadModules, emitter }
})
