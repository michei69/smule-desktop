import { useEffect, useRef, useState } from "react"
import LoadingTemplate from "../components/LoadingTemplate"
import AgoraRTC, { IAgoraRTCClient } from "agora-rtc-sdk-ng"
import MiniUser from "../components/MiniUser"
import { AccountIcon } from "smule.js"

// TODO:
export default function LiveTest() {
    const [loading, setLoading] = useState(true)
    const [users, setUsers] = useState([])
    const [idToIcon, setIdToIcon] = useState({} as {[id: number]: AccountIcon})
    const [messages, setMessages] = useState([])

    const run = useRef(false)
    const agoraClient = useRef(null as IAgoraRTCClient)

    useEffect(() => {
        if (run.current) return
        agoraClient.current = AgoraRTC.createClient({mode: 'rtc', codec: 'vp8'})

        agoraClient.current.on("user-published", async (user, mediaType) => {
            console.log("user-published", user, mediaType)
            await agoraClient.current.subscribe(user, mediaType)

            if (mediaType == "audio") {
                const track = user.audioTrack
                // track.play()
            }
        })
        agoraClient.current.on("user-unpublished", (user, mediaType) => {
            console.log("user-unpublished", user, mediaType)
        })

        smule.explore.fetchLivestreams().then(async res => {
            const stream = res.campfires[0]
            console.log("Loading livestream", stream.id, " -", stream.title)
            const details = await smule.live.fetch(stream.id)
            console.log(details)
            await agoraClient.current.join(
                details.playStream.agoraStream.appId,
                details.playStream.agoraStream.channelName,
                details.playStream.agoraStream.token,
                details.playStream.agoraStream.userId
            )

            extra.createCallbackLive("presence", async (data) => {
                const users = await smule.live.chat.fetchUsers()
                setUsers(users)
                for (let user of users) {
                    if (!idToIcon[user.id]) {
                        setIdToIcon({[user.id]: (await smule.account.fetchOne(user.id)).profile.accountIcon})
                    }
                }
            })
            extra.createCallbackLive("message", async (data) => {
                console.log(await smule.live.chat.fetchChat())
            })
            await smule.live.chat.connect(stream.roomJid.replaceAll("conference.","").split("@")[1], stream.roomJid)

            run.current = true
            setLoading(false)
        })

        return () => {
            // if (agoraClient.current) {
            //     agoraClient.current.leave()
            // }
            // smule.live.chat.disconnect()
        }
    }, [])

    return <>
    {loading ? <LoadingTemplate/> : 
    <div>
        live!
        <div>
            {users.map((user, idx) => 
                <MiniUser key={idx} account={idToIcon[user.id]}/>
            )}
        </div>
        <div>
            {messages.map((message, idx) => 
                <div key={idx}>{message}</div>
            )}
        </div>
    </div>}
    </>
}