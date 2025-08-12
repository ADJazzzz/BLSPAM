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

    namespace GetInfoByUser {
        interface Data {
            user_level: UserLevel
            vip: Vip
            title: Title
            badge: Badge
            privilege: Privilege
            info: Info
            property: Property
            recharge: Recharge
            relation: Relation
            wallet: Wallet
            medal: Medal
            extra_config: ExtraConfig
            mailbox: Mailbox
            user_reward: UserReward
            shield_info: ShieldInfo
            super_chat_message: SuperChatMessage
            lpl_info: LPLInfo
            cd: CD
            notice: Notice
            show_animation: boolean
            play_together_info: any
            like_user_info_v3: LikeUserInfoV3
            function_card: FunctionCard
            ab: AB
            play_together_info_v2: PlayTogetherInfoV2
            wealth: Wealth
            br: BR
            watermark: string
            group_medal: any
            uinfo: Uinfo
            qoe_show: QoeShow
            popular_rank_guide_card: any
            super_chat_message_extend: SuperChatMessageExtend
            v2_watermark: V2Watermark
            forbid_live: ForbidLive
            super_bag_entrance: SuperBagEntrance
            all_gift_bag_entrance_list: any
            super_power_rank: SuperPowerRank
            is_show_other_edit: number
            tab_icons: any[]
            is_show_other_edit_record: number
            fans_club_poke_gift_notice: any
            cny_quiz_guide_pop_up: boolean
            other_edit_info: OtherEditInfo
            multi_voice_info: MultiVoiceInfo
            game_shop: GameShop
        }
        interface UserLevel {
            level: number
            next_level: number
            color: number
            level_rank: string
        }
        interface Vip {
            vip: number
            vip_time: string
            svip: number
            svip_time: string
        }
        interface Title {
            title: string
            source: string
        }
        interface Badge {
            is_room_admin: boolean
            admin_level: number
        }
        interface Privilege {
            target_id: number
            privilege_type: number
            privilege_uname_color: string
            buy_guard_notice: string | null
            sub_level: number
            notice_status: number
            expired_time: string
            auto_renew: number
            renew_remind: any
            benefit_alters: any[]
            guard_type: number
        }
        interface Info {
            uid: number
            uname: string
            uface: string
            main_rank: number
            bili_vip: number
            mobile_verify: number
            identification: number
        }
        interface Property {
            uname_color: string
            bubble: number
            danmu: Property_Danmu
            bubble_color: string
            bubble_id: number
        }
        interface Property_Danmu {
            mode: number
            color: number
            length: number
            room_id: number
        }
        interface Recharge {
            status: number
            type: number
            value: string
            color: string
            config_id: number
        }
        interface Relation {
            is_followed: boolean
            is_fans: boolean
            is_in_fansclub: boolean
            is_official_followed: boolean
        }
        interface Wallet {
            gold: number
            silver: number
        }
        interface Medal {
            cnt: number
            is_weared: boolean
            curr_weared: Medal_CurrWeared
            up_medal: Medal_UpMedal
            lookup: Medal_Lookup
            up_medal_v2: boolean
            lookup_v2: Medal_LookupV2
            curr_weared_v2: any
            curr_show: Medal_CurrShow
        }
        interface Medal_CurrWeared {
            target_id: number
            target_name: string
            medal_name: string
            target_roomid: number
            level: number
            intimacy: number
            next_intimacy: number
            day_limit: number
            today_feed: number
            is_union: number
            medal_color_start: number
            medal_color_end: number
            medal_color_border: number
            is_lighted: number
            guard_level: number
            icon_id: number
            score: number
        }
        interface Medal_UpMedal {
            uid: number
            medal_name: string
            medal_color: number
            level: number
        }
        interface Medal_Lookup {
            level: number
            is_lighted: boolean
        }
        interface Medal_LookupV2 {
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
        interface Medal_CurrShow {
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
        interface ExtraConfig {
            show_bag: boolean
            show_vip_broadcast: boolean
        }
        interface Mailbox {
            switch_status: number
            red_notice: number
        }
        interface UserReward {
            entry_effect: UserReward_EntryEffect
            welcome: UserReward_Welcome
        }
        interface UserReward_EntryEffect {
            id: number
            privilege_type: number
            priority: number
            web_basemap_url: string
            web_effective_time: number
            web_effect_close: number
            web_close_time: number
            copy_writing: string
            copy_color: string
            highlight_color: string
            mock_effect: number
            business: number
            face: string
            basemap_url: string
            show_avatar: number
            effective_time: number
            web_dynamic_url: string
        }
        interface UserReward_Welcome {
            allow_mock: number
        }
        interface ShieldInfo {
            shield_user_list: any[]
            keyword_list: any[]
            shield_rules: ShieldInfo_ShieldRules
            is_block: boolean
            block_expired: number
        }
        interface ShieldInfo_ShieldRules {
            rank: number
            verify: number
            level: number
        }
        interface SuperChatMessage {
            list: any[]
        }
        interface LPLInfo {
            lpl: number
        }
        interface CD {
            guide_free_medal_cost: number
            guide_light_medal: number
            guide_follow: number
            guard_compensate: number
            interact_toasts: any[]
        }
        interface Notice {
            gift_red_dot: Notice_GiftRedDot
            user_head_dot: Notice_UserHeadDot
            glory_dress_on: boolean
        }
        interface Notice_GiftRedDot {
            module: string
            num: number
        }
        interface Notice_UserHeadDot {
            module: string
            num: number
        }
        interface LikeUserInfoV3 {
            hit_ab: number
        }
        interface FunctionCard {
            send_gift_card: FunctionCard_SendGiftCard
            wish_list_card: any
        }
        interface FunctionCard_SendGiftCard {
            card_experiment: number
            card_duration: number
            title: string
            subtitle: string
            popup_title: string
            surplus_remind: number
            watch_live: number
            send_dm: number
            follow_watch_live: number
            follow_send_dm: number
            price_cap: number
            default_gift: number
            gift_list: any
        }
        interface AB {
            Giftpanel_touch: number
            bag_gift_support_batch_send: number
            blindbox_price_0227: number
            contribution_rank_show_exp: number
            gift_dynamic_panel: number
            hzscreen_gift_var: number
            live_gift_corner_color_bg: number
            mobile_gift_panel_top_area_v3: number
            pk_gift_pk: number
            popular_rank_card_ab: number
            room_hot_rank_v2: number
            room_hot_rank_v3: number
            room_rank_rearrange: number
            wealth: number
            web_moreLive: number
        }
        interface PlayTogetherInfoV2 {
            icon_status: number
            todo_num: number
            icon_url: string
            create_url: string
            card_level: number
            card_expire_time: number
            card_url_app: string
            card_url_web: string
            discount_url_web: string
            dispatch_url_web: string
        }
        interface Wealth {
            uid: number
            level: number
            level_total_score: number
            cur_score: number
            upgrade_need_score: number
            status: number
            dm_icon_key: string
        }
        interface BR {
            is_br: number
            show_icon: boolean
            red_dot: boolean
            icon_title: string
            jump_url: string
            icon_url: string
            biz_id: number
            badge_url: string
        }
        interface Uinfo {
            uid: number
            base: Uinfo_Base
            medal: any
            wealth: Uinfo_Wealth
            title: any
            guard: Uinfo_Guard
            uhead_frame: any
            guard_leader: any
        }
        interface Uinfo_Base {
            name: string
            face: string
            name_color: number
            is_mystery: boolean
            risk_ctrl_info: any
            origin_info: any
            official_info: any
            name_color_str: string
        }
        interface Uinfo_Wealth {
            level: number
            dm_icon_key: string
        }
        interface Uinfo_Guard {
            level: number
            expired_str: string
        }
        interface QoeShow {
            show: boolean
            qoe_info: any
        }
        interface SuperChatMessageExtend {
            in_audit_list: any
            audit_info: SuperChatMessageExtend_AuditInfo
            entrance_mode: number
        }
        interface SuperChatMessageExtend_AuditInfo {
            ids: any
            msg: string
        }
        interface V2Watermark {
            sawtooth_watermark: string
            icon_watermark: string
        }
        interface ForbidLive {
            is_forbid: boolean
            forbid_text: string
        }
        interface SuperBagEntrance {
            show_icon: boolean
            icon_title: string
            icon_url: string
            jump_url: string
            bag_type: number
        }
        interface SuperPowerRank {
            show_icon: boolean
            icon_url: string
            jump_url: string
        }
        interface OtherEditInfo {
            show_type: number
            text: string
        }
        interface MultiVoiceInfo {
            enable_asr: boolean
        }
        interface GameShop {
            visible: number
            icon_url: string
            promotion_page_url: string
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
            avatar_icon: AvatarIcon
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
        interface AvatarIcon {
            icon_resource: object
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
