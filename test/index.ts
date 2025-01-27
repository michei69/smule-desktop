import { readFile } from "fs"
import { SmuleMIDI } from "../src/api/smule"

(async()=>{
    readFile("./test/22991359237", "base64", (err, data) => {
        console.log(SmuleMIDI.fetchLyricsFromMIDI(data))
    })
})()