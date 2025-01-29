import { SmuleMIDI } from "../../api/smule";

// TODO: definitely improve lmfao
export default function Lyrics({ lyrics, audioTime, part }: { lyrics: SmuleMIDI.SmuleLyrics[], audioTime: number, part: number }) {
    return (
        <div className="lyrics p-16">
            {lyrics.map((lyric, index) => {
                let clsName = lyric.singPart == part ? "text-blue-500" : lyric.singPart == 0 ? "text-yellow-500" : "text-gray-500"
                let currentLyric = lyric.startTime <= audioTime && lyric.endTime >= audioTime
                let brightenedClass =  currentLyric ? "brightness-100" : "brightness-50"
                return (
                    <p ref={currentLyric ? (el) => el?.scrollIntoView({block: "center"}) : null} key={index} className={`${clsName} lyric ${brightenedClass}`}>{lyric.text}</p>
                )
            })}
        </div>
    )
}
