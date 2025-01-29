import { ipcMain, IpcMainInvokeEvent, session } from "electron";
import { PerformanceReq, PerformancesFillStatus, PerformancesSortOrder, SmuleSession } from "../api/smule-types";
import { Conf } from "electron-conf";
import { Smule, SmuleMIDI } from "../api/smule";
import { tmpdir } from "os";
import axios from "axios";
import { v4 } from "uuid"
import { join } from "path";
import { createWriteStream, readFileSync } from "fs";

const ffmpeg = require("fluent-ffmpeg")
const ffmpegPath = require("ffmpeg-static").replace("app.asar", "app.asar.unpacked")
ffmpeg.setFfmpegPath(ffmpegPath)

const store = new Conf({
  defaults: {
    session: new SmuleSession()
  }
})
if (store.get("session") == undefined) store.set("session", new SmuleSession())

//* set up smule & load saved session
const smule = new Smule()
smule.session = store.get("session")

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
  loginGuest: () => {
    let res = smule.loginAsGuest()
    store.set("session", smule.session)
    return res
  },
  login: (email: string, password: string) => {
    let res = smule.login(email, password)
    store.set("session", smule.session)
    return res
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
  fetchLyrics: (path: string) => {
    let data = readFileSync(path, {
      encoding: "base64"
    })
    return SmuleMIDI.fetchLyricsFromMIDI(data)
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
  getSongsFromCategory: (category: string) => {
    return smule.getSongsFromCategory(category)
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
    const path = join(tmpdir(), `${uuid}.${ext}`)
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