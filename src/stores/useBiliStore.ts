import { defineStore } from 'pinia'
import { ref } from 'vue'
import { BiliCookies, UserData, LiveInfoData } from '../types'

export const useBiliStore = defineStore('bili', () => {
    const cookies = ref<BiliCookies | null>(null)
    const loginInfo = ref<UserData.Nav.Data | null>(null)
    const emotionData = ref<LiveInfoData.GetEmoticons.EmotionData[]>([])
    const BilibiliLive = ref<Window['BilibiliLive'] | null>(null)
    const infoByuser = ref<LiveInfoData.GetInfoByUser.Data | null>(null)

    return { cookies, loginInfo, emotionData, BilibiliLive, infoByuser }
})
