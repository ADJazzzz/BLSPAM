import { defineStore } from 'pinia'
import { ref } from 'vue'
import { BiliCookies, BiliAPIResponse } from '../types'

export const useBiliStore = defineStore('bili', () => {
    const cookies = ref<BiliCookies | null>(null)
    const loginInfo = ref<BiliAPIResponse.Nav.Data | null>(null)
    const emotionData = ref<BiliAPIResponse.GetEmoticons.EmoticonPackage[]>([])
    const BilibiliLive = ref<Window['BilibiliLive'] | null>(null)
    const infoByuser = ref<BiliAPIResponse.GetInfoByUser.Data | null>(null)

    return { cookies, loginInfo, emotionData, BilibiliLive, infoByuser }
})
