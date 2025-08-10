import { memo } from "react"
import LyricSyllable from "./LyricSyllable"
import { SmuleLyric, SmuleUserSinging } from "smule.js"

export default memo(function LyricLine({ lyric, part, index, preview, isCurrentLyric, isNextPrevLyric, marginClass, setTime, activeSyllables, isSyllable }: { lyric: SmuleLyric, part: SmuleUserSinging, index: number, preview: boolean, isCurrentLyric: boolean, isNextPrevLyric: boolean, marginClass: string, setTime: any, activeSyllables: number[], isSyllable: boolean }) {
    // part == 3 means all lyrics should be sang
    const clsName = lyric.part == part || part == 3 ? "text-blue-500" : lyric.part == 0 ? "text-yellow-500" : "text-gray-500"
    
    const brightenedClass = isCurrentLyric || preview ? "brightness-100" :
                            isNextPrevLyric ? "brightness-75" : "brightness-50"

    return (
        <p data-id={index} className={`${clsName} lyric ${brightenedClass} ${marginClass}`} onClick={() => setTime(lyric.startTime)}>
            {lyric.text.map((text, idx) => 
                <LyricSyllable text={text.text} isSyllable={isSyllable} isActive={activeSyllables.includes(idx)} />
            )}
        </p>
    )
})