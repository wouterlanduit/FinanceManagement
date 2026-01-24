export interface loggedInStatusResponse {
    loggedIn: boolean
}

export interface loggedInStatus {
    loggedIn: boolean,
    privileges?: string[]
}