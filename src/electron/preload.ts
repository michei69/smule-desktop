import { contextBridge, ipcRenderer } from "electron";
import { ArrResult, CategorySongsResult, PerformanceByKeysResult, PerformanceIcon, PerformanceList, PerformanceReq, PerformanceResult, PerformancesByUserResult, PerformancesFillStatus, PerformancesSortOrder, ProfileResult, SongbookResult, UsersLookupResult } from "../api/smule-types";
import { SmuleMIDI } from "../api/smule";

export const storage = {
  get: <T>(key: string) => ipcRenderer.invoke("get-store", key) as Promise<T>,
  set: (key: string, data) => ipcRenderer.invoke("set-store", key, data),
  has: (key: string) => ipcRenderer.invoke("has-store", key),

  download: (url: string) => ipcRenderer.invoke("download", url),
  convert: (filePath: string, format = "mp3") => ipcRenderer.invoke("convert", filePath, format)
}

function smuleRequest<T>(method: string, ...args: any[]): Promise<T> {
  return ipcRenderer.invoke("smule", method, ...args)
}
export const smule = {
  loginGuest: () => smuleRequest<boolean>("loginGuest"),
  login: (email: string, password: string) => smuleRequest<boolean>("login", email, password),
  refreshLogin: () => smuleRequest<boolean>("refreshLogin"),
  getSongbook: () => smuleRequest<SongbookResult>("getSongbook"),
  fetchSong: (key: string) => smuleRequest<ArrResult>("fetchSong", key),
  requestListsOfPerformances: (requests: PerformanceReq[]) => smuleRequest<{perfLists: PerformanceList[]}>("requestListsOfPerformances", requests),
  fetchLyrics: (url: string) => smuleRequest<SmuleMIDI.SmuleLyrics[]>("fetchLyrics", url),
  lookUpUserByEmail: (email: string) => smuleRequest<ProfileResult>("lookUpUserByEmail", email),
  lookUpUsersByIds: (accountIds: number[]) => smuleRequest<UsersLookupResult>("lookUpUsersByIds", accountIds),
  lookUpUserById: (accountId: number) => smuleRequest<ProfileResult>("lookUpUserById", accountId),
  getSongsFromCategory: (category: string) => smuleRequest<CategorySongsResult>("getSongsFromCategory", category),
  lookUpPerformancesByKeys: (performanceKeys: string[]) => smuleRequest<PerformanceByKeysResult>("lookUpPerformancesByKeys", performanceKeys),
  lookUpPerformanceByKey: (performanceKey: string) => smuleRequest<PerformanceIcon>("lookUpPerformanceByKey", performanceKey),
  lookUpPerformancesByUser: (accountId: number, limit = 20, offset = 0) => smuleRequest<PerformancesByUserResult>("lookUpPerformancesByUser", accountId, limit, offset),
  listPerformances: (sort = PerformancesSortOrder.SUGGESTED, fillStatus = PerformancesFillStatus.ACTIVESEED, limit = 20, offset = 0) => smuleRequest<PerformanceList>("listPerformances", sort, fillStatus, limit, offset),
  fetchSelf: () => smuleRequest<ProfileResult>("fetchSelf"),
  fetchPerformance: (performanceKey: string) => smuleRequest<PerformanceResult>("fetchPerformance", performanceKey),
}

contextBridge.exposeInMainWorld("storage", storage);
contextBridge.exposeInMainWorld("smule", smule);