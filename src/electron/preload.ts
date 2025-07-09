import { contextBridge, ipcRenderer, OpenDialogSyncOptions } from "electron";
import { smule } from "./smule-ipc";

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

    createCallback: (name: string, value) => ipcRenderer.on("smule-chat:" + name, (_ev, ...args) => {value(...args)}),
    createCallbackLive: (name: string, value) => ipcRenderer.on("smule-live:" + name, (_ev, ...args) => {value(...args)}),
}

contextBridge.exposeInMainWorld("storage", storage);
contextBridge.exposeInMainWorld("smule", smule);
contextBridge.exposeInMainWorld("extra", extra);
contextBridge.exposeInMainWorld("openExternalLink", openExternalLink);