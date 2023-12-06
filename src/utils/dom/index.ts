const dq = document.querySelector.bind(document)
const dqa = document.querySelectorAll.bind(document)
const dce = document.createElement.bind(document)

const pollingQuery = (
    element: Document | Element,
    selectors: string,
    interval: number,
    timeout: number,
    immediate: boolean
): Promise<Element> => {
    return new Promise((resolve, reject) => {
        if (immediate) {
            const ele = element.querySelector(selectors)
            if (ele) {
                resolve(ele)
                return
            }
        }
        const timerPolling = setInterval(() => {
            const ele: Element | null = element.querySelector(selectors)
            if (ele) {
                clearTimeout(timerPolling)
                resolve(ele)
            }
        }, interval)
        const timerTimeout = setTimeout(() => {
            clearTimeout(timerPolling)
            clearTimeout(timerTimeout)
            reject()
        }, timeout)
    })
}

export { dq, dqa, dce, pollingQuery }
