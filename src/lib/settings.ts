import { AccountIcon } from "@/api/smule-types"

export default class Settings {
    public developerMode = false
    public markSongPlay = true
    public markPerformancePlay = true
    public markPerformanceListen = true
    public showSyllableLyricProgress = true

    /**
     * Saves the current settings to local storage
     */
    public save() {
        localStorage.setItem("settings", JSON.stringify(this))
    }
    /**
     * Loads the settings from local storage
     *
     * If the settings are not found in local storage, this is a no-op
     */
    public load() {
        let data = localStorage.getItem("settings")
        if (data) {
            Object.assign(this, JSON.parse(data))
        }
    }
    /**
     * Resets the settings to their default values
     */
    public reset() {
        localStorage.removeItem("settings")
        Object.assign(this, new Settings())
        return this
    }

    /**
     * Returns the current settings
     *
     * If the settings are not found in local storage, this will return a new
     * instance of the Settings class with default values
     */
    public static get() {
        let settings = new Settings()
        settings.load()
        return settings
    }

    /**
     * Gets the current (saved) profile
     * @returns The current profile
     */
    public static getProfile(): AccountIcon {
        return JSON.parse(localStorage.getItem("profile") || "{}")
    }

    /**
     * Sets the current (saved) profile
     * @param profile The profile to set
     */
    public static setProfile(profile: any) {
        if (!profile) localStorage.setItem("profile", null)
        else localStorage.setItem("profile", JSON.stringify(profile))
    }
}