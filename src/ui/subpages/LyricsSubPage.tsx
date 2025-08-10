import { useNavigate, useOutletContext } from "react-router"
import { SDCArr } from "smule.js"
import LanguageList from "../../../public/language-list.json"
import { useEffect, useState } from "react"

export default function LyricsSubPage() {
    const navigate = useNavigate()

    const [arr, setArr] = useOutletContext() as [SDCArr, (arr: SDCArr) => void]
    const [language, setLanguage] = useState(arr.language?.id || "en")
    const [suggestion, setSuggestion] = useState(null)
    const [suggested, setSuggested]  = useState(false)

    useEffect(() => {
        setArr({
            ...arr,
            language: LanguageList.find(lang => lang.id == language)
        })
    }, [language])

    return (
        <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-bold">area under construction. for now just paste the lyrics here, and youll set the parts from the sync page</h1>
            <p>Note: The first line is going to be automatically deleted by smule. That's why <i>"(Intro)"</i> is inserted there. Place all your actual lyrics data after it, on the next line.</p>
            <audio src={arr.audioData.url} controls className="ml-auto mr-auto" />
            <textarea onChange={(e) => {
                setArr({
                    ...arr,
                    lyrics: {
                        ...arr.lyrics,
                        lines: e.target.value.split("\n").map(line => ({
                            group_parts: [],
                            part: "",
                            ts: Infinity,
                            text: line
                        }))
                    }
                })
                if (!suggested) {
                    smuleDotCom.detectLanguage(e.target.value).then(res => res).then(res => {
                        if (res.detected_language.reliable) {
                            setSuggestion(LanguageList.find(lang => lang.id == res.detected_language.code))
                            setSuggested(true)
                        }
                    })
                }
            }} value={arr.lyrics.lines.map(line => line.text).join("\n")} className="h-128 card outline"></textarea>
            <select onSelect={(e) => setLanguage(e.currentTarget.value)} value={language} className="card rounded-xl">
                {LanguageList.sort((a, b) => a.enName.localeCompare(b.enName)).map((lang, i) => 
                    <option key={i} value={lang.id}>{lang.enName}</option>
                )}
            </select>
            {suggestion ? <div className="flex flex-col items-center gap-2">
                <p>is this in {suggestion.enName}?</p>
                <div className="flex flex-row items-center gap-1">
                    <button onClick={() => {setLanguage(suggestion.id); setSuggestion(null)}}>yes</button>
                    <button onClick={() => setSuggestion(null)}>no</button>
                </div>
            </div> : <></>}
            <button onClick={() => navigate("/create-arr/sync")}>next</button>
        </div>
    )
}