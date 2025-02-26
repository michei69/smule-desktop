import { app, dialog, ipcMain, IpcMainInvokeEvent, shell } from "electron";
import { PerformanceIcon, PerformanceReq, PerformancesFillStatus, PerformanceSortMethod, PerformancesSortOrder, SearchResultSort, SearchResultType, SmuleSession } from "../api/smule-types";
import { Smule } from "../api/smule";
import { SmuleMIDI } from "../api/smule-midi";
import { SmuleEffects } from "../api/smule-effects";
import { tmpdir } from "os";
import axios from "axios";
import { v4 } from "uuid";
import { join } from "path";
import { createWriteStream, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "fs";
import Store from "./store";
import { PerformanceCreateRequest } from "@/api/smule-requests";

const ffmpeg = require("fluent-ffmpeg")
const ffmpegPath = require("ffmpeg-static").replace("app.asar", "app.asar.unpacked")
ffmpeg.setFfmpegPath(ffmpegPath)

const store = new Store({
  filepath: join(app.getPath("userData"), "store.json"),
  defaults: {
    session: new SmuleSession()
  }
})
app.on("quit", () => {
  store._write()
})

// this is redundant
if (store.get("session") == undefined) store.set("session", new SmuleSession())

//* set up smule & load saved session
const smule = new Smule()
smule.session = store.get("session")

//* enable external links
ipcMain.handle("external", async (_event: IpcMainInvokeEvent, url: string) => {
  if (!url.startsWith("http")) return
  shell.openExternal(url)
})

//* handle store related stuff
ipcMain.handle("get-store", async (_event: IpcMainInvokeEvent, key: string) => {
  return store.get(key)
})
ipcMain.handle("set-store", (_event: IpcMainInvokeEvent, key: string, data) => {
  return store.set(key, data)
})
ipcMain.handle("has-store", (_event: IpcMainInvokeEvent, key: string) => {
  return store.has(key)
})

//* handle smule stuff
const smuleEndpoint = {
  getTMPdir: () => {
    return join(tmpdir(), "smule-desktop")
  },
  loginGuest: () => {
    let res = smule.loginAsGuest()
    store.set("session", smule.session)
    store._write()
    return res
  },
  login: (email: string, password: string) => {
    let res = smule.login(email, password)
    store.set("session", smule.session)
    store._write()
    return res
  },
  logout: () => {
    let session = store.get<SmuleSession>("session")
    session.expired = true
    store.set("session", session)
    store._write()
    smule.session = session
  },
  refreshLogin: () => {
    return smule.refreshLogin()
  },
  getSongbook: (cursor = "start", limit = 10) => {
    return smule.getSongBook(cursor, limit)
  },
  fetchSong: (key: string) => {
    return smule.fetchSong(key)
  },
  requestListsOfPerformances: (requests: PerformanceReq[]) => {
    return smule.requestListsOfPerformances(requests)
  },
  fetchLyrics: async (path: string) => {
    let data = readFileSync(path)
    return SmuleMIDI.fetchLyricsFromMIDI(data)
  },
  fetchPitches: async (path: string, lyrics: SmuleMIDI.SmuleLyric[]) => {
    let data = readFileSync(path)
    return SmuleMIDI.fetchPitchesFromMIDI(data, lyrics)
  },
  lookUpUserByEmail: (email: string) => {
    return smule.lookUpUserByEmail(email)
  },
  lookUpUsersByIds: (accountIds: number[]) => {
    return smule.lookUpUsersByIds(accountIds)
  },
  lookUpUserById: (accountId: number) => {
    return smule.lookUpUserById(accountId)
  },
  getSongsFromCategory: (cursor: string, category: number, limit = 10) => {
    return smule.getSongsFromCategory(cursor, category, limit)
  },
  lookUpPerformancesByKeys: (performanceKeys: string[]) => {
    return smule.lookUpPerformancesByKeys(performanceKeys)
  },
  lookUpPerformanceByKey: (performanceKey: string) => {
    return smule.lookUpPerformanceByKey(performanceKey)
  },
  lookUpPerformancesByUser: (accountId: number, limit = 20, offset = 0) => {
    return smule.lookUpPerformancesByUser(accountId, limit, offset)
  },
  listPerformances: (sort = PerformancesSortOrder.SUGGESTED, fillStatus = PerformancesFillStatus.ACTIVESEED, limit = 20, offset = 0) => {
    return smule.listPerformances(sort, fillStatus, limit, offset)
  },
  fetchSelf: () => {
    return smule.fetchSelf()
  },
  fetchPerformance: (performanceKey: string) => {
    return smule.fetchPerformance(performanceKey)
  },
  getTrendingSearches: () => {
    return smule.getTrendingSearches()
  },
  search: (query: string) => {
    return smule.search(query)
  },
  searchSpecific: (query: string, type: SearchResultType, sort = SearchResultSort.POPULAR, cursor = "start", limit = 25) => {
    return smule.searchSpecific(query, type, sort, cursor, limit)
  },
  getAutocomplete: (query: string, limit = 5) => {
    return smule.getAutocomplete(query, limit)
  },
  fetchAccount: (accountId: number) => {
    return smule.fetchAccount(accountId)
  },
  fetchPerformancesFromAccount: (accountId: number, fillStatus = PerformancesFillStatus.FILLED, sortMethod: PerformanceSortMethod = PerformanceSortMethod.NEWEST_FIRST, limit = 20, offset = 0) => {
    return smule.fetchPerformancesFromAccount(accountId, fillStatus, sortMethod, limit, offset)
  },
  isFollowing: (accountId: number) => {
    return smule.isFollowingUser(accountId)
  },
  follow: (accountId: number) => {
    return smule.followUser(accountId)
  },
  unfollow: (accountId: number) => {
    return smule.unfollowUser(accountId)
  },
  fetchAvTemplates: (limit = 25) => {
    return smule.fetchAvTemplates(limit)
  },
  processAvTemplateZip: (filePath: string) => {
    return SmuleEffects.processZipFile(filePath)
  },
  uploadPerformanceAutoMetadata: (createRequest: PerformanceCreateRequest, uploadType: "CREATE"|"JOIN", audioFile: string, coverFile?: string, updateThisPerformance?: PerformanceIcon|any) => {
    return smule.uploadPerformanceAutoMetadata(createRequest, uploadType, readFileSync(audioFile), readFileSync(coverFile), updateThisPerformance)
  },
  markSongAsPlayed: (arrKey: string) => {
    return smule.markSongAsPlayed(arrKey)
  },
  markPerformanceAsPlayed: (performanceKey: string) => {
    return smule.markPerformanceAsPlayed(performanceKey)
  },
  markPerformanceListenStart: (performanceKey: string) => {
    return smule.markPerformanceListenStart(performanceKey)
  },
  fetchComments: (performanceKey: string, offset = 0, limit = 25) => {
    return smule.fetchComments(performanceKey, offset, limit)
  },
  likeComment: (performanceKey: string, commentKey: string) => {
    return smule.likeComment(performanceKey, commentKey)
  },
  unlikeComment: (performanceKey: string, commentKey: string) => {
    return smule.unlikeComment(performanceKey, commentKey)
  },
  markPerformanceAsLoved: (performanceKey: string) => {
    return smule.markPerformanceAsLoved(performanceKey)
  }
}

ipcMain.handle("smule", (_event, method, ...args) => {
  let func = smuleEndpoint[method]
  if (!func) {
    console.error("Unknown smule method: " + method)
    return null
  }
  return func(...args)
})

//* other stuff
ipcMain.handle("download", async (_event, url: string) => {
    const uuid = v4()
    const ext = url.split(".").pop()
    if (!existsSync(join(tmpdir(), "smule-desktop"))) mkdirSync(join(tmpdir(), "smule-desktop"))
    const path = join(tmpdir(), "smule-desktop", `${uuid}.${ext}`)
    const writer = createWriteStream(path)

    try {
      console.log("got request for " + url)
      const response = await axios({
        url,
        method: "GET",
        responseType: "stream"
      })
      response.data.pipe(writer)
      await new Promise((resolve, reject) => {
        writer.on("finish", () => {resolve("")})
        writer.on("error", reject)
      })
      console.log("downloaded to " + path)
      return path
    } catch (e) {
      throw e
    }
})
ipcMain.handle("open", async (_event, options) => {
  return dialog.showOpenDialogSync(null, options)
})
ipcMain.handle("convert", async (_event, filePath: string, format = "mp3") => {
  if (!filePath) return null
  console.log(`[convert] from ${filePath} to ${format}`)
  const uuid = v4()
  const path = join(tmpdir(), `${uuid}.${format}`)
  return await new Promise((resolve) => {
    ffmpeg(filePath).output(path).on("end", () => {
      console.log(`[convert] ${filePath} -> ${path}`)
      resolve(path)
    }).run()
  })
})
ipcMain.handle("save", async (_event, fileName: string, content: Uint8Array) => {
  writeFileSync(join(tmpdir(), "smule-desktop", fileName), content)
})

// clear out the temp folder every time we start lol
if (existsSync(join(tmpdir(), "smule-desktop"))) {
  rmSync(join(tmpdir(), "smule-desktop"), {recursive: true, force: true})
  mkdirSync(join(tmpdir(), "smule-desktop"))
}