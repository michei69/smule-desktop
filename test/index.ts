import { readFile } from "fs"
import { Smule, SmuleMIDI } from "../src/api/smule"

(async()=>{
    const smule = new Smule()
    await smule.loginAsGuest()
    let data = {"perfRequests":[{"app":"sing_google","arrKey":"15480580_15480580","fillStatus":"SEED","limit":25,"offset":0,"sort":"RECENT","video":false},{"app":"sing_google","arrKey":"15480580_15480580","fillStatus":"ACTIVESEED","limit":25,"offset":0,"sort":"HOT","video":false}]}
    // let res = await smule._createRequest("https://api-sing.smule.com/v2/performance/lists", data, true, false, true)
    // smule._handleNon200(res)
    // console.log(smule._getResponseData(res))
})()