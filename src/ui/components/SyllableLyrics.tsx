import { SmuleMIDI } from "@/api/smule";

export default function SyllableLyrics({ lyrics, audioTime, part, pause, resume, setTime, preview = false }: { lyrics: SmuleMIDI.SmuleLyricsData, audioTime: number, part: number, pause: any, resume: any, setTime: any, preview?: boolean }) {
    let lyr: {time: number, part: number, text: SmuleMIDI.SmuleLyrics[]}[] = []
    let currentLyric = []
    for (let line of lyrics.lyrics) {
        if (line.text == "") continue
        if (line.text.includes("\\n")) {
            currentLyric.push({
                ...line,
                text: line.text.replace("\\n", "")
            })
            lyr.push({
                time: line.startTime,
                part: line.singPart,
                text: currentLyric
            })
            currentLyric = []
        } else {
            currentLyric.push(line)
        }
    }
    
    let currentLyricIdx = -1
    for (let i = 0; i < lyr.length; i++) {
        // if (lyr[i].text == "") continue
        if (lyr[i].text[0].startTime <= audioTime) currentLyricIdx = i
    }

    return (
        <div className={`lyrics p-16 ${preview ? "preview" : ""}`}>
            {lyr.map((lyric, idx) => {
                let clsName = lyric.part == part || part == 3 ? "text-blue-500" : lyric.part == 0 ? "text-yellow-500" : "text-gray-500"
                let marginClass = idx == 0 ? "top" : idx == lyr.length - 1 ? "bottom" : ""
                
                let brightenedClass = currentLyricIdx == idx || preview ? "brightness-100" :
                                      currentLyricIdx == idx - 1 || currentLyricIdx == idx + 1 ? "brightness-75" : "brightness-50"


                return (
                    <p data-id={idx} key={idx} className={`lyric ${clsName} ${marginClass} ${brightenedClass}`}>
                        {lyric.text.map((text, idx) => {
                            // TODO: make italic better (or check how * is used on the app lmfao)
                            let italic = lyric.text[idx - 1]?.text == "*" ? "italic" : ""
                            let underlined = text.startTime <= audioTime ? "underline" : ""

                            return (
                                <span className={`${underlined}`}>{text.text}</span>
                            )
                        })}
                    </p>
                )
            })}
        </div>
    )
}