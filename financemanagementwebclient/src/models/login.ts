export interface loggedInStatusResponse {
    loggedIn: boolean
}

export interface bearerTokenResponse {
    access_token: string,
    token_type: string
}

export interface loggedInStatus {
    loggedIn: boolean,
    privileges?: string[]
}