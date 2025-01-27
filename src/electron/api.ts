import { ipcMain, IpcMainInvokeEvent, session } from "electron";
import { PerformanceReq, SmuleSession } from "../api/smule-types";
import { Conf } from "electron-conf";
import { Smule } from "../api/smule";
import { tmpdir } from "os";
import axios from "axios";
import { v4 } from "uuid"
import { join } from "path";
import { createWriteStream } from "fs";


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
ipcMain.handle("s-login-guest", (_event) => {
  let res = smule.loginAsGuest()
  store.set("session", smule.session)
  return res
})
ipcMain.handle("s-login", (_event, email: string, password: string) => {
  let res = smule.login(email, password)
  store.set("session", smule.session)
  return res
})
ipcMain.handle("s-refresh-login", (_event) => {
  return smule.refreshLogin()
})

ipcMain.handle("s-songbook", (_event) => {
  return smule.getSongBook()
})
ipcMain.handle("s-song", (_event, key: string) => {
  return smule.fetchSong(key)
})
ipcMain.handle("s-request-performances-lists", (_event, requests: PerformanceReq[]) => {
  return smule.requestListsOfPerformances(requests)
})

ipcMain.handle("download", async (_event, url: string) => {
    const uuid = v4()
    const ext = url.split(".").pop()
    const path = join(tmpdir(), `${uuid}.${ext}`)
    const writer = createWriteStream(path)

    try {
      const response = await axios({
        url,
        method: "GET",
        responseType: "stream"
      })
      response.data.pipe(writer)
      await new Promise((resolve, reject) => {
        writer.on("finish", resolve)
        writer.on("error", reject)
      })
      return path
    } catch (e) {
      throw e
    }
})