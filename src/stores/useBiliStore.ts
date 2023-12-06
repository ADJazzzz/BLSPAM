import { defineStore } from 'pinia'
import { ref } from 'vue'
import { BiliCookies, UserData, LiveInfoData } from '../types'

export const useBiliStore = defineStore('bili', () => {
    const cookies = ref<BiliCookies | null>(null)
    const userInfo = ref<UserData.Nav.Data | null>(null)
    const emotionData = ref<LiveInfoData.GetEmoticons.EmotionData[]>([])
    const BilibiliLive = ref<Window['BilibiliLive'] | null>(null)

    return { cookies, userInfo, emotionData, BilibiliLive }
})
