import { useEffect, useRef, useState } from "react";
import { avTmplSegment, SmuleMidiData, SmuleUserSinging } from "smule.js";
import Settings from "@/lib/settings";

// TODO: definitely improve lmfao
export default function Lyrics({ lyrics, audioTime, part, pause, resume, setTime, avTmplSegments = [], preview = false, fill = false }: { lyrics: SmuleMidiData, audioTime: number, part: SmuleUserSinging, pause: any, resume: any, setTime: any, avTmplSegments?: avTmplSegment[], preview?: boolean, fill?: boolean }) {
    part = part == 0 ? 3 : part // convert 0 to 3 since both are BOTH
    
    let currentLyric = -1
    for (let i = 0; i < lyrics.lyrics.length; i++)
        if (lyrics.lyrics[i].startTime <= audioTime) 
            currentLyric = i

    const segments = {}
    for (const segment of avTmplSegments) {
        let startLyric = 0
        for (let i = 0; i < lyrics.lyrics.length; i++)
            if (lyrics.lyrics[i].startTime <= segment.start) 
                startLyric = i

        segments[startLyric] = segment
    }

    const [scrolling, setScrolling] = useState(false)
    const scrollRef = useRef<any>(null)
    const barRef = useRef<HTMLDivElement | null>(null)
    const shouldShowSyllableLyricProgress = Settings.get().showSyllableLyricProgress && lyrics.type == "RAVEN"

    useEffect(() => {
        if (Settings.get().developerMode) console.log(lyrics)
    }, [lyrics])

    return (
        <div className={`lyrics p-16 ${preview ? "preview" : ""} ${fill ? "fill" : ""}`} onWheel={() => {
            if (scrollRef.current) clearTimeout(scrollRef.current)
            setScrolling(true)
            pause()
            scrollRef.current = setTimeout(() => {
                setScrolling(false)

                if (barRef.current && !preview) {
                    const box = barRef.current.getBoundingClientRect()
                    const els = document.elementsFromPoint(box.x + box.width/2, box.y + box.height/2)
                    for (const el of els) {
                        if (el.tagName == "P" && el.getAttribute("data-id")) {
                            el.scrollIntoView({block: "center"})
                            setTime(lyrics.lyrics[el.getAttribute("data-id")].startTime)
                            break
                        }
                    }
                }

                resume()
                scrollRef.current = null
            }, 500)
        }}>
            <div ref={barRef} className={`middle-line ${scrolling ? "" : "hidden"}`} />
            {lyrics.lyrics.map((lyric, index) => {
                // part == 3 means all lyrics should be sang
                const clsName = lyric.part == part || part == 3 ? "text-blue-500" : lyric.part == 0 ? "text-yellow-500" : "text-gray-500"
                
                const marginClass = index == 0 ? "top" : index == lyrics.lyrics.length - 1 ? "bottom" : ""
                const brightenedClass = currentLyric == index || preview ? "brightness-100" :
                                        currentLyric == index - 1 || currentLyric == index + 1 ? "brightness-75" : "brightness-50"

                return (
                    <>
                    {segments[index] && Settings.get().showLyricSegments ? <p key={index + "-seg"} className={`lyric text-gray-400 mt-8 font-bold ${marginClass != "bottom" ? marginClass : ""}`}>{segments[index].type}</p> : ""}
                    <p data-id={index} ref={currentLyric == index ? (el) => {
                        if (scrolling) return
                        if (preview) return
                        el?.scrollIntoView({block: "center"})
                    } : null} key={index} className={`${clsName} lyric ${brightenedClass} ${preview ? "preview" : segments[index] && marginClass == "top" ? "" : marginClass} ${segments[index] && !Settings.get().showLyricSegments ? marginClass != "bottom" ? marginClass : "" : ""}`} onClick={() => setTime(lyric.startTime)}>
                        {lyric.text.map((text, idx) => {
                            const underlined = text.startTime <= audioTime && lyrics.isSyllable ? "underline" : "brightness-75"
                            let style = {}
                            if (shouldShowSyllableLyricProgress && text.startTime <= audioTime) {
                                style = {
                                    filter: `brightness(${Math.max(Math.min((audioTime - text.startTime) / (Math.min(text.endTime, lyrics.lyrics[index].text[idx + 1]?.endTime ?? Infinity) - text.startTime), 1), 0.5)})`
                                }
                            }
                            return (
                                <span key={idx + "-part-" + index} className={`${underlined}`} style={style}>{text.text}</span>
                            )
                        })}
                    </p>
                    </>
                )
            })}
        </div>
    )
}
