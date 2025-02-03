import { readFile, readFileSync } from "fs"
import { Smule, SmuleMIDI } from "../src/api/smule.js"
const midi = import("midifile-ts");

(async()=>{
    let properMidi = await midi
    const stuff = properMidi.read(readFileSync("./test/6ae1c8f3-d68d-47a8-bf15-c29818edf5ae.mid"))
    for (let track of stuff.tracks) {
        console.log(track[0], track[1])
    }
})()