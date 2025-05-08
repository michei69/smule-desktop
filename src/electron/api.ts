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
import { initializeIPCHandler } from "./smule-handler";

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
initializeIPCHandler(smule)

//* other stuff
const extra = {
    download: async (_event: IpcMainInvokeEvent, url: string) => {
        const uuid = v4()
        const ext = url.split(".").pop()
        if (!existsSync(join(tmpdir(), "smule-desktop"))) mkdirSync(join(tmpdir(), "smule-desktop"))
        const path = join(tmpdir(), "smule-desktop", `${uuid}.${ext}`)
        const writer = createWriteStream(path)

        console.log("got request for " + url)
        const response = await axios({
            url,
            method: "GET",
            responseType: "stream"
        })
        response.data.pipe(writer)
        await new Promise((resolve, reject) => {
            writer.on("finish", () => { resolve("") })
            writer.on("error", reject)
        })
        console.log("downloaded to " + path)
        return path
    },
    open: (_event: IpcMainInvokeEvent, options) => {
        return dialog.showOpenDialogSync(null, options)
    },
    save: (_event: IpcMainInvokeEvent, fileName: string, content: Uint8Array) => {
        return writeFileSync(join(tmpdir(), "smule-desktop", fileName), content)
    },

    getVersion: (_event: IpcMainInvokeEvent) => app.getVersion(),
    getTMPDir: (_event: IpcMainInvokeEvent) => {
        return join(tmpdir(), "smule-desktop")
    },

    logout: (_event: IpcMainInvokeEvent) => {
        let session = store.get<SmuleSession>("session")
        session.expired = true
        store.set("session", session)
        store._write()
        smule.session = session
    },
    fetchLyrics: async (_event: IpcMainInvokeEvent, path: string) => {
        let data = readFileSync(path)
        return SmuleMIDI.fetchLyricsFromMIDI(data)
    },
    fetchPitches: async (_event: IpcMainInvokeEvent, path: string, lyrics: SmuleMIDI.SmuleLyric[]) => {
        let data = readFileSync(path)
        return SmuleMIDI.fetchPitchesFromMIDI(data, lyrics)
    },
    processAvTemplateZip: (_event: IpcMainInvokeEvent, filePath: string) => {
        return SmuleEffects.processZipFile(filePath)
    },
}

for (const [key, value] of Object.entries(extra)) {
    ipcMain.handle(`extra:${key}`, value)
}

// clear out the temp folder every time we start lol
if (existsSync(join(tmpdir(), "smule-desktop"))) {
    rmSync(join(tmpdir(), "smule-desktop"), { recursive: true, force: true })
    mkdirSync(join(tmpdir(), "smule-desktop"))
}