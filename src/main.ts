import { createApp } from 'vue'
import { createPinia } from 'pinia'
import naive from 'naive-ui'
import App from './App.vue'
import { dce } from './utils/dom'
import { unsafeWindow } from '$'
import { useModuleStore } from './stores/useModuleStore'

const pinia = createPinia()

unsafeWindow.onload = () => {
    const app = createApp(App)

    app.use(pinia)
    app.use(naive)

    const moduleStore = useModuleStore(pinia)
    moduleStore.loadModules()

    const div = dce('div')
    div.id = 'BLSPAM'
    document.body.append(div)
    app.mount(div)
}
