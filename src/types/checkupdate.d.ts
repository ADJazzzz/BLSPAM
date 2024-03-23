declare namespace CheckUpdate {
    namespace MonkeyXMLHttpRequest {
        interface MonkeyXMLHttpRequestResponse {
            DONE?: number
            HEADERS_RECEIVED?: number
            LOADING?: number
            OPENED?: number
            RESPONSE_TYPE_ARRAYBUFFER?: string
            RESPONSE_TYPE_BLOB?: string
            RESPONSE_TYPE_DOCUMENT?: string
            RESPONSE_TYPE_JSON?: string
            RESPONSE_TYPE_STREAM?: string
            RESPONSE_TYPE_TEXT?: string
            UNSENT?: number
            finalUrl?: string
            readyState: number
            responseHeaders: string
            responseType?: string
            status: number
            statusText: string
            response: any
            responseText: string
            error?: string
            responseXML?: Document | null
        }
    }

    namespace GitHub {
        interface GithubAPI {
            url: string
            assets_url: string
            upload_url: string
            html_url: string
            id: number
            author: GithubAPI_Author
            node_id: string
            tag_name: string
            target_commitish: string
            name: string
            draft: boolean
            prerelease: boolean
            created_at: string
            published_at: string
            assets: GithubAPI_Asset[]
            tarball_url: string
            zipball_url: string
            body: string
        }
        interface GithubAPI_Author {
            login: string
            id: number
            node_id: string
            avatar_url: string
            gravatar_id: string
            url: string
            html_url: string
            followers_url: string
            following_url: string
            gists_url: string
            starred_url: string
            subscriptions_url: string
            organizations_url: string
            repos_url: string
            events_url: string
            received_events_url: string
            type: string
            site_admin: boolean
        }
        interface GithubAPI_Asset {
            url: string
            id: number
            node_id: string
            name: string
            label: string
            uploader: GithubAPI_Author
            content_type: string
            state: string
            size: number
            download_count: number
            created_at: string
            updated_at: string
            browser_download_url: string
        }
    }
}

export { CheckUpdate }
