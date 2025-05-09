import { useEffect, useRef, useState } from "react";
import LoadingTemplate from "../components/LoadingTemplate";
import { SmuleChatContainer, SmuleChatState, SmuleMessage, SmulePartnerStatus } from "@/api/smule-chat-types";
import { AccountIcon } from "@/api/smule-types";
import { SendHorizonal } from "lucide-react";
import MiniPerformanceFromKey from "../components/MiniPerformanceFromKey";
import TypingAnimationSVG from "../components/TypingAnimation";
import { useNavigate } from "react-router";

export default function Chat() {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(true)
    const [messages, setMessages] = useState([] as SmuleMessage[])
    const [chats, setChats] = useState({} as { [key: string]: SmuleChatContainer })
    const [currentPartnerId, setCurrentPartnerId] = useState("0")
    const [chatState, setChatState] = useState("disconnected" as SmuleChatState)
    const [idToAcc, setIdToAcc] = useState({} as { [key: string]: AccountIcon })
    const [me, setMe] = useState(0)
    const [written, setWritten] = useState("")
    const [typing, setTyping] = useState(false)
    const [stateChange, setStateChange] = useState({ id: 0, state: "active" } as { id: number, state: SmulePartnerStatus })
    const [idToState, setIdToState] = useState({} as { [key: string]: SmulePartnerStatus })
    const stateToFriendlyState = {
        "active": "active",
        "composing": "typing",
        "paused": "active",
        "inactive": "active",
        "gone": "offline"
    }

    useEffect(() => {
        extra.createCallback("state", (state) => setChatState(state))
        extra.createCallback("message", async (msg) => {
            await smule.social.chat.sendReceivedReceipt(await smule.social.chat.getJIDFromUserId(msg.sender), msg.id)
            let chat = await smule.social.chat.fetchChats()
            setChats(chat)
        })
        extra.createCallback("chatstate", ({ sender, state }: { sender: number, state: SmulePartnerStatus }) => {
            setStateChange({ id: sender, state })
        })
        smule.social.chat.connect().then(async () => {
            await smule.social.chat.fetchMessageHistory()
            let chats = await smule.social.chat.fetchChats()

            let ids = []
            for (let chat of Object.values(chats)) {
                for (let msg of chat.messages) {
                    if (ids.includes(msg.sender)) continue
                    ids.push(msg.sender)
                }
            }
            ids = ids.map(id => parseInt(id))
            let temp = await smule.account.lookup.byIds(ids)
            let temp2 = {}
            for (let acc of temp.accountIcons) {
                temp2[acc.accountId] = acc
            }
            setIdToAcc(temp2)

            let self = await smule.account.fetchSelf()
            setMe(self.profile.accountIcon.accountId)

            setChats(chats)
            setMessages(chats[Object.keys(chats)[0]].messages || [])
            setCurrentPartnerId(Object.keys(chats)[0])
            
            const lastChatPartner = localStorage.getItem("chatPartner")
            if (lastChatPartner && Object.keys(chats).includes(lastChatPartner)) {
                setCurrentPartnerId(lastChatPartner)
                setMessages(chats[lastChatPartner].messages)
            }

            setLoading(false)
        })
    }, [])

    useEffect(() => {
        if (!(currentPartnerId in chats)) return
        setMessages(chats[currentPartnerId].messages)
        localStorage.setItem("chatPartner", currentPartnerId)
    }, [currentPartnerId])

    useEffect(() => {
        if (msgScrollRef.current) {
            msgScrollRef.current.scrollTo({top: msgScrollRef.current.scrollHeight + 100, behavior: "smooth"})
        }
    }, [messages])
    useEffect(() => {
        if (!(currentPartnerId in chats)) {
            console.warn("currentPartnerId not in chats", currentPartnerId, chats)
            return
        }
        setMessages(chats[currentPartnerId].messages)
    }, [chats])
    useEffect(() => {
        setIdToState({ ...idToState, [stateChange.id + ""]: stateChange.state })
        if (stateChange.id + "" != currentPartnerId) return
        setTyping(stateChange.state === "composing")
        if (msgScrollRef.current) {
            if (msgScrollRef.current.scrollHeight - msgScrollRef.current.scrollTop < 550) {
                msgScrollRef.current.scrollTo({top: msgScrollRef.current.scrollHeight + 200, behavior: "smooth"})
            }
        }
    }, [stateChange])

    async function send() {
        smule.social.chat.sendTextMessage(await smule.social.chat.getJIDFromUserId(currentPartnerId), written)
        setWritten("")
    }

    const msgScrollRef = useRef<HTMLDivElement>(null)
    return (
        <>
        {loading ? 
        <div className="flex flex-col">
            <LoadingTemplate/>
            <p>state: {chatState}</p>
        </div> 
        : 
        <div className="flex flex-row gap-2">
            <div className="flex flex-col" style={{width: "30%"}}>
                {Object.keys(chats).map((id, idx) => {
                    const lastMessage = chats[id].messages[chats[id].messages.length - 1]
                    return <div key={idx} onClick={() => setCurrentPartnerId(id)} className={`flex flex-row h-fit card cute-border rounded-2xl select-none cursor-pointer ${currentPartnerId == id ? "bg-darker-accent" : ""}`} style={{transition: "background-color .25s"}}>
                        <img src={idToAcc[id].picUrl} className="rounded-xl aspect-square w-16 h-16"/>
                        <div className="flex flex-col text-nowrap overflow-hidden text-left ml-2 mr-1 justify-center">
                            <h1>@{idToAcc[id].handle}</h1>
                            <p className="text-ellipsis overflow-hidden font-normal">{lastMessage.performanceKey ? "Sent Performance" : lastMessage.content}</p>
                        </div>
                    </div>
                })}
            </div>
            <div ref={msgScrollRef} className="w-full overflow-scroll flex flex-col gap-1" style={{height: "80vh"}}>
                <div className="sticky top-0 chat-bar flex flex-row p-1 rounded-bl-sm rounded-br-sm items-center gap-2">
                    <img src={idToAcc[currentPartnerId].picUrl} className="rounded-xl aspect-square w-8 h-8"/>
                    <p className="-mt-1 cursor-pointer select-none" onClick={() => navigate("/account/" + idToAcc[currentPartnerId].accountId)}>@{idToAcc[currentPartnerId].handle}{idToState[currentPartnerId + ""] ? " - " + stateToFriendlyState[idToState[currentPartnerId + ""]] : ""}</p>
                </div>
                <div className="mb-auto"/>
                {messages.map((message, idx) => {
                    let cls = ""
                    if (message.sender == me) cls = "self-end bg-darker-accent"
                    return (
                    <div key={idx} data-id={message.id} data-sender={message.sender} style={{maxWidth: "45%"}} className={`card rounded-2xl text-wrap break-words w-fit ${cls} ${message.performanceKey ? "" : "p-2"}`}> 
                        {message.performanceKey ? <>
                            <MiniPerformanceFromKey performanceKey={message.performanceKey}/>
                        </> :
                            <p className={`text-wrap font-normal w-fit ${message.sender == me ? "text-right": "text-left"}`}>{message.content}</p>
                        }
                    </div>
                    )
                })}
                
                {typing ? 
                    <div className="card rounded-2xl w-fit h-12 flex items-center justify-center"><TypingAnimationSVG style={{marginTop: "-10px"}}/></div>
                : ""}
                <div className="sticky bottom-0 w-full flex flex-row mt-4">
                    <input type="text" className="w-full h-10 rounded-2xl p-2 card" placeholder="Message..." value={written} onChange={(e) => setWritten(e.target.value)} onKeyDown={(e) => {if (e.key == "Enter") send()}}/>
                    <button className="w-10 h-10 flex items-center justify-center" onClick={() => send()}>
                        <SendHorizonal className="w-4 h-4 shrink-0"/>
                    </button>
                </div>
            </div>
        </div>
        }
        </>
    )
}