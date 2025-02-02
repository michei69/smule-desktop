import { existsSync, readFileSync, writeFileSync } from "fs"

export type StoreSettings = {
    filepath: string,
    defaults?: object
}

export default class Store {
    filepath: string
    content: any

    constructor(settings: StoreSettings) {
        this.filepath = settings.filepath

        this._read()

        if (typeof settings.defaults == "object") {
            for (let key in Object.keys(settings.defaults)) {
                if (!this.content[key]) this.content[key] = settings.defaults[key]
            }
        }
    }

    _read() {
        if (!this.filepath) throw new Error("Read event called without a filepath set? What are we even supposed to read from?")
        if (!existsSync(this.filepath)) {
            this.content = {}
            return
        }
        let raw = readFileSync(this.filepath, "utf-8")
        if (!raw) {
            this.content = {}
            return
        }
        
        try {
            this.content = JSON.parse(raw)
        } catch (e) {
            console.error("[STORE] Failed to parse JSON in", this.filepath, "- starting off brand new")
            this.content = {}
        }
    }

    _write() {
        if (!this.filepath) throw new Error("Write event called without a filepath set? What are we even supposed to write to?")
        
        try {
            writeFileSync(this.filepath, JSON.stringify(this.content))
        } catch (e) {
            console.error("[STORE] Failed to write JSON to", this.filepath, "- data is NOT saved.")
        }
    }

    /**
     * Retrieves the value associated with the specified key from the store.
     *
     * @param key - The key to look up in the store.
     * @returns The value associated with the key, cast to the specified type.
     */
    get<T>(key: string) {
        return this.content[key] as T
    }

    /**
     * Sets the value associated with the specified key in the store.
     *
     * @param key - The key to set in the store.
     * @param data - The value to set for the specified key.
     */
    set(key: string, data: any) { 
        this.content[key] = data
    }

    /**
     * Checks if the specified key exists in the store.
     *
     * @param key - The key to check for existence in the store.
     * @returns A boolean indicating whether the key exists.
     */
    has(key: string) {
        return !!this.content[key]
    }
}