declare namespace BiliAPIResponse {
    namespace MsgSend {
        interface Response {
            code: number
            msg: string
            message: string
            data: Data
        }
        interface Data {
            mode_info: ModeInfo
            dm_v2: null | any
        }
        interface ModeInfo {
            mode: number
            show_player_type: number
            extra: string
            user: User
        }
        interface User {
            uid: number
            base: UserBase
            medal: UserMedal | null
            wealth: any | null
            title: UserTitle
            guard: any | null
            uhead_frame: any | null
            guard_leader: GuardLeader
        }
        interface UserBase {
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
        interface UserMedal {
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
        interface UserTitle {
            old_title_css_id: string
            title_css_id: string
        }
        interface GuardLeader {
            is_guard_leader: boolean
        }
    }

    namespace GetEmoticons {
        interface Response {
            code: number
            message: string
            ttl: number
            data: Data
        }
        interface Data {
            fans_brand: number
            data: EmoticonPackage[]
            purchase_url: string | null
        }
        interface EmoticonPackage {
            emoticons: Emoticon[]
            pkg_id: number
            pkg_name: string
            pkg_type: number
            pkg_descript: string
            pkg_perm: number
            unlock_identity: number
            unlock_need_gift: number
            current_cover: string
            recently_used_emoticons: any[]
            top_show: TopShow
            top_show_recent: TopShow
        }
        interface Emoticon {
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
            top_left: TopShowItem
            top_right: TopShowItem
        }
        interface TopShowItem {
            image: string
            text: string
        }
    }

    namespace GetInfoByUser {
        interface Response {
            code: number
            message: string
            ttl: number
            data: Data
        }
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
            lpl_info: LplInfo
            cd: Cd
            notice: Notice
            show_animation: boolean
            play_together_info: any | null
            like_user_info_v3: LikeUserInfoV3
            function_card: FunctionCard
            ab: Ab
            play_together_info_v2: PlayTogetherInfoV2
            wealth: Wealth
            br: Br
            watermark: string
            group_medal: any | null
            uinfo: Uinfo
            qoe_show: QoeShow
            popular_rank_guide_card: any | null
            super_chat_message_extend: SuperChatMessageExtend
            v2_watermark: V2Watermark
            forbid_live: ForbidLive
            super_bag_entrance: SuperBagEntrance
            all_gift_bag_entrance_list: any | null
            super_power_rank: SuperPowerRank
            is_show_other_edit: number
            tab_icons: any[]
            is_show_other_edit_record: number
            fans_club_poke_gift_notice: any | null
            cny_quiz_guide_pop_up: boolean
            other_edit_info: OtherEditInfo
            multi_voice_info: MultiVoiceInfo
            game_shop: GameShop
            is_show_edit_policy: number
            guard_notice: GuardNotice
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
            buy_guard_notice: any | null
            sub_level: number
            notice_status: number
            expired_time: string
            auto_renew: number
            renew_remind: any | null
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
            danmu: Danmu
            bubble_color: string
            bubble_id: number
        }
        interface Danmu {
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
            curr_weared: any | null
            up_medal: UpMedal | null
            lookup: any | null
            up_medal_v2: boolean
            lookup_v2: any | null
            curr_weared_v2: any | null
            curr_show: any | null
        }
        interface UpMedal {
            uid: number
            medal_name: string
            medal_color: number
            level: number
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
            entry_effect: EntryEffect
            welcome: Welcome
        }
        interface EntryEffect {
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
        interface Welcome {
            allow_mock: number
        }
        interface ShieldInfo {
            shield_user_list: any[]
            keyword_list: any[]
            shield_rules: ShieldRules
            is_block: boolean
            block_expired: number
        }
        interface ShieldRules {
            rank: number
            verify: number
            level: number
        }
        interface SuperChatMessage {
            list: any[]
        }
        interface LplInfo {
            lpl: number
        }
        interface Cd {
            guide_free_medal_cost: number
            guide_light_medal: number
            guide_follow: number
            guard_compensate: number
            interact_toasts: any[]
        }
        interface Notice {
            gift_red_dot: GiftRedDot
            user_head_dot: UserHeadDot
            glory_dress_on: boolean
        }
        interface GiftRedDot {
            module: string
            num: number
        }
        interface UserHeadDot {
            module: string
            num: number
        }
        interface LikeUserInfoV3 {
            hit_ab: number
        }
        interface FunctionCard {
            send_gift_card: SendGiftCard
            wish_list_card: any | null
        }
        interface SendGiftCard {
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
            gift_list: number[]
        }
        interface Ab {
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
        interface Br {
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
            base: UinfoBase
            medal: any | null
            wealth: UinfoWealth
            title: any | null
            guard: UinfoGuard
            uhead_frame: any | null
            guard_leader: any | null
        }
        interface UinfoBase {
            name: string
            face: string
            name_color: number
            is_mystery: boolean
            risk_ctrl_info: any | null
            origin_info: any | null
            official_info: any | null
            name_color_str: string
        }
        interface UinfoWealth {
            level: number
            dm_icon_key: string
        }
        interface UinfoGuard {
            level: number
            expired_str: string
        }
        interface QoeShow {
            show: boolean
            qoe_info: any | null
        }
        interface SuperChatMessageExtend {
            in_audit_list: any | null
            audit_info: AuditInfo
            entrance_mode: number
        }
        interface AuditInfo {
            ids: any | null
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
        interface GuardNotice {
            url: string
            delay_second: number
            red_alarm: number
        }
    }

    namespace Nav {
        interface Response {
            code: number
            message: string
            ttl: number
            data: Data
        }
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
            answer_status: number
            is_senior_member: number
            wbi_img: WbiImg
            is_jury: boolean
            name_render: any | null
            legal_region: string
            ip_region: string
        }
        interface LevelInfo {
            current_level: number
            current_min: number
            current_exp: number
            next_exp: string | number
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
            label_id: number
            label_goto: any | null
        }
        interface Vip {
            type: number
            status: number
            due_date: number
            vip_pay_type: number
            theme_type: number
            label: VipLabel
            avatar_subscript: number
            nickname_color: string
            role: number
            avatar_subscript_url: string
            tv_vip_status: number
            tv_vip_pay_type: number
            tv_due_date: number
            avatar_icon: AvatarIcon
            ott_info: OttInfo
            super_vip: SuperVip
        }
        interface AvatarIcon {
            icon_resource: Record<string, any>
        }
        interface OttInfo {
            vip_type: number
            pay_type: number
            pay_channel_id: string
            status: number
            overdue_time: number
        }
        interface SuperVip {
            is_super_vip: boolean
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

export { BiliAPIResponse }
