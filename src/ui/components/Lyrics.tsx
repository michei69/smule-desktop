import { useRef, useState } from "react";
import { SmuleMIDI } from "../../api/smule";

// TODO: definitely improve lmfao
export default function Lyrics({ lyrics, audioTime, part, pause, resume, setTime }: { lyrics: SmuleMIDI.SmuleLyrics[], audioTime: number, part: number, pause: any, resume: any, setTime: any }) {
    let currentLyric = -1
    for (let i = 0; i < lyrics.length; i++) {
        if (lyrics[i].text == "") continue
        if (lyrics[i].startTime <= audioTime) currentLyric = i
    }

    const [scrolling, setScrolling] = useState(false)
    const scrollRef = useRef<any>(null)
    const barRef = useRef<HTMLDivElement | null>(null)

    return (
        <div className="lyrics p-16" onWheel={() => {
            if (scrollRef.current) clearTimeout(scrollRef.current)
            setScrolling(true)
            pause()
            scrollRef.current = setTimeout(() => {
                setScrolling(false)

                if (barRef.current) {
                    let box = barRef.current.getBoundingClientRect()
                    let els = document.elementsFromPoint(box.x + box.width/2, box.y + box.height/2)
                    for (let el of els) {
                        if (el.tagName == "P" && el.getAttribute("data-id")) {
                            el.scrollIntoView({block: "center"})
                            setTime(lyrics[el.getAttribute("data-id")].startTime)
                            break
                        }
                    }
                }

                resume()
                scrollRef.current = null
            }, 500)
        }}>
            <div ref={barRef} className={`middle-line ${scrolling ? "" : "hidden"}`} />
            {lyrics.map((lyric, index) => {
                // part == 3 means all lyrics should be sang
                let clsName = lyric.singPart == part || part == 3 ? "text-blue-500" : lyric.singPart == 0 ? "text-yellow-500" : "text-gray-500"
                
                let marginClass = index == 0 ? "top" : index == lyrics.length - 1 ? "bottom" : ""
                let brightenedClass = currentLyric == index ? "brightness-100" : "brightness-50"
                console.log(brightenedClass)
                return (
                    <p data-id={index} ref={currentLyric == index ? (el) => {
                        if (scrolling) return
                        el?.scrollIntoView({block: "center"})
                    } : null} key={index} className={`${clsName} lyric ${brightenedClass} ${marginClass}`}>{lyric.text}</p>
                )
            })}
        </div>
    )
}
