declare namespace LiveInfoData {
    namespace SendMsg {
        interface Data {
            mode_info: ModeInfo
            dm_v2: any
        }
        interface ModeInfo {
            mode: number
            show_player_type: number
            extra: string
            user: User
        }
        interface User {
            uid: number
            base: Base
            medal: Medal | null
            wealth: any | null
            title: Title
            guard: any | null
            uhead_frame: any | null
            guard_leader: GuardLeader
        }
        interface Base {
            name: string
            face: string
            name_color: number
            is_mystery: boolean
            risk_ctrl_info: any | null
            origin_info: OriginInfo
            official_info: OfficialInfo
            name_color_str: string
        }
        interface OriginInfo {
            name: string
            face: string
        }
        interface OfficialInfo {
            role: number
            title: string
            desc: string
            type: number
        }
        interface Medal {
            name: string
            level: number
            color_start: number
            color_end: number
            color_border: number
            color: number
            id: number
            typ: number
            is_light: number
            ruid: number
            guard_level: number
            score: number
            guard_icon: string
            honor_icon: string
            v2_medal_color_start: string
            v2_medal_color_end: string
            v2_medal_color_border: string
            v2_medal_color_text: string
            v2_medal_color_level: string
            user_receive_count: number
        }
        interface Title {
            old_title_css_id: string
            title_css_id: string
        }
        interface GuardLeader {
            is_guard_leader: boolean
        }
    }

    namespace GetEmoticons {
        interface Data {
            fans_brand: number
            data: EmotionData[]
            purchase_url: any
        }
        interface EmotionData {
            emoticons: Emoticons[]
            pkg_id: number
            pkg_name: string
            pkg_type: number
            pkg_descript: string
            pkg_perm: number
            unlock_identity: number
            unlock_need_gift: number
            current_cover: string
            recently_used_emoticons: any[]
            top_show: TopShow[]
            top_show_recent: TopShowRecent[]
        }
        interface Emoticons {
            emoji: string
            descript: string
            url: string
            is_dynamic: number
            in_player_area: number
            width: number
            height: number
            identity: number
            unlock_need_gift: number
            perm: number
            unlock_need_level: number
            emoticon_value_type: number
            bulge_display: number
            unlock_show_text: string
            unlock_show_color: string
            emoticon_unique: string
            unlock_show_image: string
            emoticon_id: number
        }
        interface TopShow {
            top_left: TopShowTopLeft
            top_right: TopShowTopRight
        }
        interface TopShowTopLeft {
            image: string
            text: string
        }
        interface TopShowTopRight {
            image: string
            text: string
        }
        interface TopShowRecent {
            top_left: TopShowRecentTopLeft
            top_right: TopShowRecentTopRight
        }
        interface TopShowRecentTopLeft {
            image: string
            text: string
        }
        interface TopShowRecentTopRight {
            image: string
            text: string
        }
    }
}

declare namespace UserData {
    namespace Nav {
        interface Data {
            isLogin: boolean
            email_verified: number
            face: string
            face_nft: number
            face_nft_type: number
            level_info: LevelInfo
            mid: number
            mobile_verified: number
            money: number
            moral: number
            official: Official
            officialVerify: OfficialVerify
            pendant: Pendant
            scores: number
            uname: string
            vipDueDate: number
            vipStatus: number
            vipType: number
            vip_pay_type: number
            vip_theme_type: number
            vip_label: VipLabel
            vip_avatar_subscript: number
            vip_nickname_color: string
            vip: Vip
            wallet: Wallet
            has_shop: boolean
            shop_url: string
            allowance_count: number
            answer_status: number
            is_senior_member: number
            wbi_img: WbiImg
            is_jury: boolean
            name_render: any
        }

        interface LevelInfo {
            current_level: number
            current_min: number
            current_exp: number
            next_exp: string
        }

        interface Official {
            role: number
            title: string
            desc: string
            type: number
        }

        interface OfficialVerify {
            type: number
            desc: string
        }

        interface Pendant {
            pid: number
            name: string
            image: string
            expire: number
            image_enhance: string
            image_enhance_frame: string
            n_pid: number
        }

        interface VipLabel {
            path: string
            text: string
            label_theme: string
            text_color: string
            bg_style: number
            bg_color: string
            border_color: string
            use_img_label: boolean
            img_label_uri_hans: string
            img_label_uri_hant: string
            img_label_uri_hans_static: string
            img_label_uri_hant_static: string
        }

        interface Vip {
            type: number
            status: number
            due_date: number
            vip_pay_type: number
            theme_type: number
            label: Label
            avatar_subscript: number
            nickname_color: string
            role: number
            avatar_subscript_url: string
            tv_vip_status: number
            tv_vip_pay_type: number
            tv_due_date: number
        }
        interface Label {
            path: string
            text: string
            label_theme: string
            text_color: string
            bg_style: number
            bg_color: string
            border_color: string
            use_img_label: boolean
            img_label_uri_hans: string
            img_label_uri_hant: string
            img_label_uri_hans_static: string
            img_label_uri_hant_static: string
        }

        interface Wallet {
            mid: number
            bcoin_balance: number
            coupon_balance: number
            coupon_due_time: number
        }

        interface WbiImg {
            img_url: string
            sub_url: string
        }
    }
}

export { LiveInfoData, UserData }
