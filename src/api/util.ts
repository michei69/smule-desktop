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

    export function formatTime(ms: number, showMS = false) {
        if (!ms) return showMS ? "00:00.000": "00:00"
        let sec: number|string = Math.floor(ms / 1000)
        let min: number|string = Math.floor(sec / 60)
        sec %= 60
        if (sec < 10) sec = "0" + sec
        if (min < 10) min = "0" + min
        if (showMS) return `${min}:${sec}.${ms % 1000}`
        return `${min}:${sec}`
    }
    export function formatValue(value: number) {
        if (value >= 1000) {
            if (value >= 1_000_000) return Math.round(value / 100_000) / 10 + "M"
            return Math.round(value / 100) / 10 + "K"
        }
        return value + ""
    }
}

export namespace SmuleUtil {
    export function checkLoggedIn(session: SmuleSession) {
        return !session.expired && session.sessionToken != ""
    }

    export function isVerified(verifiedType: string) {
        return ["STAFF", "PARTNER_ARTIST", "VERIFIED_BASIC"].includes(verifiedType)
    }
}