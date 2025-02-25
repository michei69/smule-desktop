import { SmuleEffects } from "../src/api/smule-effects";
import { Smule, SmuleDigest } from "../src/api/smule";
import { PerformanceCreateRequest } from "../src/api/smule-requests";
import { CustomFormData } from "../src/api/util";
import axios from "axios";
import { readFileSync, writeFileSync } from "fs";

(async()=>{
    // console.log(SmuleDigest._calculateDigest("/v2/perf/upload", `appsing_googleappVariant1appVersion12.0.5jsonData{"file1ResourceInfo":{"hostname":"u-sf.smule.com","pop":"SF","resourceId":25349970859,"resourceType":"AUDIO"},"file2ResourceInfo":{"hostname":"u-sf.smule.com","pop":"SF","resourceId":25349970857,"resourceType":"IMAGE"},"file3ResourceInfo":{"hostname":"u-sf.smule.com","pop":"SF","resourceId":25349970858,"resourceType":"META"},"performanceKey":"2674240701_5023138599","trackKey":"2674240701_5094339410","uploadType":"CREATE"}msgId1003popSFsessiong4_6_Dy6Va7R8qnC5lgUSqVQcYs9QmkPbY5uFytBWnN0z/1IvJwCCgo7IEmBOThBQk0i6`))
    // let tmp = new CustomFormData()
    // tmp.set("jsonData", `{"file1ResourceInfo":{"hostname":"u-sf.smule.com","pop":"SF","resourceId":25349994313,"resourceType":"AUDIO"},"file2ResourceInfo":{"hostname":"u-sf.smule.com","pop":"SF","resourceId":25349994311,"resourceType":"IMAGE"},"file3ResourceInfo":{"hostname":"u-sf.smule.com","pop":"SF","resourceId":25349994312,"resourceType":"META"},"performanceKey":"2674240701_5023138154","trackKey":"2674240701_5094332377","uploadType":"CREATE"}`)
    // console.log(SmuleDigest.calculateDigest("/v2/perf/upload", {
    //     appVersion: "11.8.5",
    //     app: "sing_google",
    //     appVariant: "1",
    //     msgId: "669",
    //     session: decodeURIComponent("g4_6_9ptq3rps%2BXRpqVea5HUHCpCoykf%2F8amzmMOkDSI2Ks061qlRBR9zieg44i6JnGJV"),
    //     pop: "SF",
    //     jsonData: `{"file1ResourceInfo":{"hostname":"u-sf.smule.com","pop":"SF","resourceId":25349994313,"resourceType":"AUDIO"},"file2ResourceInfo":{"hostname":"u-sf.smule.com","pop":"SF","resourceId":25349994311,"resourceType":"IMAGE"},"file3ResourceInfo":{"hostname":"u-sf.smule.com","pop":"SF","resourceId":25349994312,"resourceType":"META"},"performanceKey":"2674240701_5023138154","trackKey":"2674240701_5094332377","uploadType":"CREATE"}`
    // }, null, true, false, tmp))
    // SmuleAudio.exportMetaFile("./temp.meta")
    let sml = new Smule()
    await sml.login("claudiumladin0723@gmail.com", "mamaie21")
    await sml.uploadPerformance(
        new PerformanceCreateRequest(
            "253551188_415019",
            "SOLO",
            652900,
            true,
            "rr",
            "ararararfedqfar",
            false,
            "ARR",
            0,
        ),
        "CREATE",
        "./test/untitled.ogg",
        "./test/pula copy.meta",
        "./test/cover.jpg"
    )
    // console.log(await sml.fetchPerformance("2703438790_4926756081"))
    // let caca = new CustomFormData()
    // caca.set("jsonData", `{"file1ResourceInfo":{"hostname":"u-sf.smule.com","pop":"SF","resourceId":25350139055,"resourceType":"AUDIO"},"file2ResourceInfo":{"hostname":"u-sf.smule.com","pop":"SF","resourceId":25350139053,"resourceType":"IMAGE"},"file3ResourceInfo":{"hostname":"u-sf.smule.com","pop":"SF","resourceId":25350139054,"resourceType":"META"},"performanceKey":"2674240701_5023160426","trackKey":"2674240701_5094355348","uploadType":"CREATE"}`, "application/json; charset=UTF-8")
    // caca.set("file1", readFileSync("./test/2.ogg"), "application/octet-stream", "7319a381-8a72-4cd8-8010-8f8931a73424..m4a")
    // caca.set("file2", readFileSync("./test/3.jpg"), "application/octet-stream", "962a4367-f51b-49af-8157-aded41bfd7a8..jpg")
    // caca.set("file3", readFileSync("./test/pula.meta"), "application/octet-stream", "962a4367-f51b-49af-8157-aded41bfd7a8..bin")
    // writeFileSync("m.bin", caca.serialize())
    // console.log(await axios.post("https://u-sf.smule.com/v2/perf/upload?pop=SF&session=g4_6_ai6gLnqmIct1qlDilp8NUiQr4lAClFoCmVPYgBpu14HPedAJPq00aHwynMuvg5Zq&msgId=413&appVersion=11.8.5&app=sing_google&appVariant=1&digest=9f55a3f932702f14eebb6c0bbb91f317117b8211", caca.serialize(), {
    //     headers: {
    //         "Accept-Encoding": "gzip",
    //         Connection: "keep-alive",
    //         "Content-Type": "multipart/form-data; boundary=1335a53d-7c46-4dd6-8e1e-c2f96c3987c5",
    //         "User-Agent": "com.smule.singandroid/11.8.5 (13,Redmi Note 7,en_GB)"
    //     }
    // }))
})()