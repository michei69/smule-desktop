import { SmuleSession } from "./smule-types"

export namespace Util {
    export function getParametersFromUrl(url: string) {
        return url.split("?")[1]
    }
    export function getHostFromFullUrl(url: string) {
        return url.split("/")[2]
    }
    export function getPathFromFullUrl(url: string) {
        let temp = url.replaceAll("://", "").split("/")
        temp.shift()
        return "/" + temp.join("/").split("?")[0]
    }
    export function queryToObject(query: string|URLSearchParams) {
        if (query instanceof URLSearchParams) return Object.fromEntries(query)
        return Object.fromEntries(new URLSearchParams(query))
    }
    export function objectToQuery(query: {[key: string]: string}) {
        return Object.entries(query).map(([key, value]) => `${key}=${value}`).join("&")
    }
}

export namespace SmuleUtil {
    export function checkLoggedIn(session: SmuleSession) {
        return !session.expired && session.sessionToken != ""
    }
}