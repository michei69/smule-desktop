import { contextBridge, ipcRenderer } from "electron";
import { ArrResult, PerformanceList, PerformanceReq, SongbookResult } from "../api/smule-types";
import { SmuleMIDI } from "../api/smule";

export const storage = {
  get: <T>(key: string) => ipcRenderer.invoke("get-store", key) as Promise<T>,
  set: (key: string, data) => ipcRenderer.invoke("set-store", key, data),
  has: (key: string) => ipcRenderer.invoke("has-store", key),

  download: (url: string) => ipcRenderer.invoke("download", url)
}

export const smule = {
  loginGuest: (): Promise<boolean> => ipcRenderer.invoke("s-login-guest"),
  login: (email: string, password: string): Promise<boolean> => ipcRenderer.invoke("s-login", email, password),
  refreshLogin: (): Promise<boolean> => ipcRenderer.invoke("s-refresh-login"),
  getSongbook: (): Promise<SongbookResult> => ipcRenderer.invoke("s-songbook"),
  fetchSong: (key: string): Promise<ArrResult> => ipcRenderer.invoke("s-song", key),
  requestListsOfPerformances: (requests: PerformanceReq[]): Promise<{perfLists: PerformanceList[]}> => ipcRenderer.invoke("s-request-performances-lists", requests),
  fetchLyrics: (url: string): Promise<SmuleMIDI.SmuleLyrics[]> => ipcRenderer.invoke("s-lyrics", url),
}

contextBridge.exposeInMainWorld("storage", storage);
contextBridge.exposeInMainWorld("smule", smule);