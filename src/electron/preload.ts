import { contextBridge, ipcRenderer, OpenDialogSyncOptions } from "electron";
import { ArrResult, AutocompleteResult, AvTemplateCategoryListResult, CategorySongsResult, FollowingResult, PerformanceByKeysResult, PerformanceCommentsResult, PerformanceIcon, PerformanceList, PerformancePartsResult, PerformanceReq, PerformanceResult, PerformancesByUserResult, PerformancesFillStatus, PerformanceSortMethod, PerformancesSortOrder, ProfileResult, SearchResult, SearchResultType, SongbookResult, TrendingSearchResult, UsersLookupResult } from "../api/smule-types";
import { SmuleMIDI } from "@/api/smule-midi";
import { SmuleEffects } from "@/api/smule-effects";
import { PerformanceCreateRequest } from "@/api/smule-requests";

export const storage = {
  get: <T>(key: string) => ipcRenderer.invoke("get-store", key) as Promise<T>,
  set: (key: string, data) => ipcRenderer.invoke("set-store", key, data),
  has: (key: string) => ipcRenderer.invoke("has-store", key),

  download: (url: string) => ipcRenderer.invoke("download", url),
  save: (fileName: string, content: Uint8Array) => ipcRenderer.invoke("save", fileName, content),
  convert: (filePath: string, format = "mp3") => ipcRenderer.invoke("convert", filePath, format),
  open: (options: OpenDialogSyncOptions) => ipcRenderer.invoke("open", options),
}

function smuleRequest<T>(method: string, ...args: any[]): Promise<T> {
  return ipcRenderer.invoke("smule", method, ...args)
}
export const smule = {
  getTMPDir: () => smuleRequest<string>("getTMPdir"),
  loginGuest: () => smuleRequest<boolean>("loginGuest"),
  login: (email: string, password: string) => smuleRequest<boolean>("login", email, password),
  refreshLogin: () => smuleRequest<boolean>("refreshLogin"),
  getSongbook: (cursor = "start", limit = 10) => smuleRequest<SongbookResult>("getSongbook", cursor, limit),
  fetchSong: (key: string) => smuleRequest<ArrResult>("fetchSong", key),
  requestListsOfPerformances: (requests: PerformanceReq[]) => smuleRequest<{perfLists: PerformanceList[]}>("requestListsOfPerformances", requests),
  fetchLyrics: (url: string) => smuleRequest<SmuleMIDI.SmuleMidiData>("fetchLyrics", url),
  fetchPitches: (url: string, lyrics: SmuleMIDI.SmuleLyric[]) => smuleRequest<SmuleMIDI.SmulePitchesData>("fetchPitches", url, lyrics),
  lookUpUserByEmail: (email: string) => smuleRequest<ProfileResult>("lookUpUserByEmail", email),
  lookUpUsersByIds: (accountIds: number[]) => smuleRequest<UsersLookupResult>("lookUpUsersByIds", accountIds),
  lookUpUserById: (accountId: number) => smuleRequest<ProfileResult>("lookUpUserById", accountId),
  getSongsFromCategory: (cursor: string, category: number, limit = 10) => smuleRequest<CategorySongsResult>("getSongsFromCategory", cursor, category, limit),
  lookUpPerformancesByKeys: (performanceKeys: string[]) => smuleRequest<PerformanceByKeysResult>("lookUpPerformancesByKeys", performanceKeys),
  lookUpPerformanceByKey: (performanceKey: string) => smuleRequest<PerformanceIcon>("lookUpPerformanceByKey", performanceKey),
  lookUpPerformancesByUser: (accountId: number, limit = 20, offset = 0) => smuleRequest<PerformancesByUserResult>("lookUpPerformancesByUser", accountId, limit, offset),
  listPerformances: (sort = PerformancesSortOrder.SUGGESTED, fillStatus = PerformancesFillStatus.ACTIVESEED, limit = 20, offset = 0) => smuleRequest<PerformanceList>("listPerformances", sort, fillStatus, limit, offset),
  fetchSelf: () => smuleRequest<ProfileResult>("fetchSelf"),
  fetchPerformance: (performanceKey: string) => smuleRequest<PerformanceResult>("fetchPerformance", performanceKey),
  getTrendingSearches: () => smuleRequest<TrendingSearchResult>("getTrendingSearches"),
  search: (query: string) => smuleRequest<SearchResult>("search", query),
  searchSpecific: (query: string, type: SearchResultType, sort: "RECENT"|"POPULAR" = "POPULAR", cursor = "start", limit = 25) => smuleRequest<SearchResult>("searchSpecific", query, type, sort, cursor, limit),
  getAutocomplete: (query: string, limit = 5) => smuleRequest<AutocompleteResult>("getAutocomplete", query, limit),
  logout: async (nav = null) => {
    await smuleRequest("logout")
    nav?.("/login")
  },
  fetchAccount: (accountId: number) => smuleRequest<ProfileResult>("fetchAccount", accountId),
  fetchPerformancesFromAccount: (accountId: number, fillStatus = PerformancesFillStatus.FILLED, sortMethod: PerformanceSortMethod = PerformanceSortMethod.NEWEST_FIRST, limit: number = 20, offset: number = 0) => smuleRequest<PerformancePartsResult>("fetchPerformancesFromAccount", accountId, fillStatus, sortMethod, limit, offset),
  isFollowing: (accountId: number) => smuleRequest<FollowingResult>("isFollowing", accountId),
  follow: (accountId: number) => smuleRequest<null>("follow", accountId),
  unfollow: (accountId: number) => smuleRequest<null>("unfollow", accountId),
  fetchAvTemplates: (limit = 25) => smuleRequest<AvTemplateCategoryListResult>("fetchAvTemplates", limit),
  processAvTemplateZip: (filePath: string) => smuleRequest<SmuleEffects.AVFile>("processAvTemplateZip", filePath),
  uploadPerformanceAutoMetadata: (createRequest: PerformanceCreateRequest, uploadType: "CREATE"|"JOIN", audioFile: string, coverFile?: string, updateThisPerformance?: PerformanceIcon|any) => smuleRequest<PerformanceIcon>("uploadPerformanceAutoMetadata", createRequest, uploadType, audioFile, coverFile, updateThisPerformance),
  markSongAsPlayed: (arrKey: string) => smuleRequest<null>("markSongAsPlayed", arrKey),
  markPerformanceAsPlayed: (performanceKey: string) => smuleRequest<null>("markPerformanceAsPlayed", performanceKey),
  markPerformanceListenStart: (performanceKey: string) => smuleRequest<null>("markPerformanceListenStart", performanceKey),
  fetchComments: (performanceKey: string, offset = 0, limit = 25) => smuleRequest<PerformanceCommentsResult>("fetchComments", performanceKey, offset, limit),
  likeComment: (performanceKey: string, commentKey: string) => smuleRequest<null>("likeComment", performanceKey, commentKey),
  unlikeComment: (performanceKey: string, commentKey: string) => smuleRequest<null>("unlikeComment", performanceKey, commentKey),
  markPerformanceAsLoved: (performanceKey: string) => smuleRequest<null>("markPerformanceAsLoved", performanceKey),
}
export const openExternalLink = (url: string) => ipcRenderer.invoke("external", url)

contextBridge.exposeInMainWorld("storage", storage);
contextBridge.exposeInMainWorld("smule", smule);
contextBridge.exposeInMainWorld("openExternalLink", openExternalLink);