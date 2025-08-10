import { useEffect, useRef, useState } from "react";
import { avTmplSegment, SmuleMidiData, SmuleUserSinging } from "smule.js";
import Settings from "@/lib/settings";
import LyricLine from "./LyricLine";

export default function Lyrics({ lyrics, audioTime, part, pause, resume, setTime, avTmplSegments = [], preview = false, fill = false, dontScroll = false }: { lyrics: SmuleMidiData, audioTime: number, part: SmuleUserSinging, pause: any, resume: any, setTime: any, avTmplSegments?: avTmplSegment[], preview?: boolean, fill?: boolean, dontScroll?: boolean }) {
    part = part == 0 ? 3 : part // convert 0 to 3 since both are BOTH
    
    const showLyricSegments = Settings.get().showLyricSegments

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

    useEffect(() => {
        if (Settings.get().developerMode && Settings.get().logLyrics) console.log(lyrics)
    }, [lyrics])

    const [currentLyricIdx, setCurrentLyricIdx] = useState(-1)
    const [currentActiveSyllables, setCurrentActiveSyllables] = useState([] as number[])

    useEffect(() => {
        let currentLyric = -1
        let activeSyllables = []
        for (let i = 0; i < lyrics.lyrics.length; i++)
            if (lyrics.lyrics[i].startTime <= audioTime) {
                currentLyric = i
                for (let j = 0; j < lyrics.lyrics[i].text.length; j++) {
                    if (lyrics.lyrics[i].text[j].startTime <= audioTime) {
                        activeSyllables.push(j)
                    }
                }
            }
        if (currentLyric != currentLyricIdx) setCurrentLyricIdx(currentLyric)
        if (activeSyllables != currentActiveSyllables) setCurrentActiveSyllables(activeSyllables)

        const target = document.querySelector(`p[data-id="${currentLyric}"]`)
        if (lyricContainerRef.current && target && !scrolling) {
            const elRect = target.getBoundingClientRect()
            const containerRect = lyricContainerRef.current.getBoundingClientRect()

            const scrollTop = lyricContainerRef.current.scrollTop;
            const offsetTop = elRect.top - containerRect.top;
            const targetScrollTop = scrollTop + offsetTop - (lyricContainerRef.current.clientHeight / 2) + (target.clientHeight / 2);

            lyricContainerRef.current.scrollTo({
                top: targetScrollTop,
                behavior: "smooth"
            })
        }
    }, [audioTime])

    const lyricContainerRef = useRef<HTMLDivElement>()

    return (
        <div ref={lyricContainerRef} className={`lyrics p-16 ${preview ? "preview" : ""} ${fill ? "fill" : ""}`} onWheel={() => {
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
                let lyricMarginClass = preview ? "preview" : index == 0 && !(showLyricSegments && segments[index]) ? "top" : index == lyrics.lyrics.length - 1 ? "bottom" : ""
                let marginClass = index == 0 ? "top" : ""
                return (
                <>
                    {segments[index] && showLyricSegments ? <p key={index + "-seg"} className={`lyric text-gray-400 mt-8 font-bold ${marginClass}`}>{segments[index].type}</p> : ""}
                    <LyricLine lyric={lyric} key={index} part={part} index={index} preview={preview} isCurrentLyric={index == currentLyricIdx} isNextPrevLyric={index == currentLyricIdx - 1 || index == currentLyricIdx + 1} marginClass={lyricMarginClass} setTime={setTime} activeSyllables={index == currentLyricIdx ? currentActiveSyllables : []} isSyllable={lyrics.isSyllable}/>
                </>
                )
            })}
        </div>
    )
}
