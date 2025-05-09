import { contextBridge, ipcRenderer, OpenDialogSyncOptions } from "electron";
import { smule } from "./smule-ipc";
import { SmuleMIDI } from "@/api/smule-midi";
import { SmuleEffects } from "@/api/smule-effects";

export const storage = {
    get: <T>(key: string) => ipcRenderer.invoke("get-store", key) as Promise<T>,
    set: (key: string, data) => ipcRenderer.invoke("set-store", key, data),
    has: (key: string) => ipcRenderer.invoke("has-store", key),
}

export const openExternalLink = (url: string) => ipcRenderer.invoke("external", url)

function extraRequest<T>(method: string, ...args: any[]): Promise<T> {
    return ipcRenderer.invoke(`extra:${method}`, ...args)
}
export const extra = {
    getVersion: () => extraRequest<string>("getVersion"),
    getTMPDir: () => extraRequest<string>("getTMPDir"),
    
    download: (url: string) => extraRequest<string>("download", url),
    save: (fileName: string, content: Uint8Array) => extraRequest<void>("save", fileName, content),
    open: (options: OpenDialogSyncOptions) => extraRequest<string[]|undefined>("open", options),

    logout: () => extraRequest<void>("logout"),
    fetchLyrics: (path: string) => extraRequest<SmuleMIDI.SmuleMidiData>("fetchLyrics", path),
    fetchPitches: (url: string, lyrics: SmuleMIDI.SmuleLyric[]) => extraRequest<SmuleMIDI.SmulePitchesData>("fetchPitches", url, lyrics),
    processAvTemplateZip: (filePath: string) => extraRequest<SmuleEffects.AVFile>("processAvTemplateZip", filePath),

    createCallback: (name: string, value) => ipcRenderer.on("smule-chat:" + name, (_ev, ...args) => {value(...args)}),
}

contextBridge.exposeInMainWorld("storage", storage);
contextBridge.exposeInMainWorld("smule", smule);
contextBridge.exposeInMainWorld("extra", extra);
contextBridge.exposeInMainWorld("openExternalLink", openExternalLink);