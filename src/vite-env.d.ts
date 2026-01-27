/// <reference types="vite/client" />
/// <reference types="vite-plugin-monkey/client" />
//// <reference types="vite-plugin-monkey/global" />
/// <reference types="vite-plugin-monkey/style" />
/// <reference types="vite-svg-loader" />

declare module '*.svg' {
    import type { DefineComponent } from 'vue'
    const component: DefineComponent
    export default component
}
