import { Input } from "@/components/ui/input"
import { useEffect, useState } from "react"

export default function AutocompletedField({ text, setText, getAutocomplete, setChosen = (_) => {}, className }: { text: string, setText: (text: string) => void, getAutocomplete: (query: string) => Promise<string[]>, setChosen?: (arg: string) => void, className?: string }) {
    const [autocompletes, setAutocompletes] = useState([] as string[])
    const [selected, setSelected] = useState(-1)
    const [autocomplete, setAutocomplete] = useState(false)

    useEffect(() => {
        setSelected(-1)
        if (text.trim() == "" || !autocomplete) return setAutocompletes([])
        getAutocomplete(text).then(res => {
            if (autocomplete) setAutocompletes(res)
            else setAutocompletes([])
        })
    }, [text])

    return (
        <div className={`${className} h-10`}>
            <Input type="text" className="w-full" value={text} onChange={(e) => {setText(e.target.value); setAutocomplete(true)}} onKeyDown={(e) => {
                if (e.key == "ArrowUp" && selected > -1) {
                    e.preventDefault()
                    setSelected(selected - 1)
                }
                else if (e.key == "ArrowDown" && (selected < autocompletes.length - 1)) {
                    e.preventDefault()
                    setSelected(selected + 1)
                }
                if (e.key == "Enter" && text != "") {
                    if (selected != -1) {
                        setText(autocompletes[selected])
                        setChosen(autocompletes[selected])
                        setAutocomplete(false)
                    }
                    setSelected(-1)
                    setAutocompletes([])
                }
            }} onBlur={() => {setAutocomplete(false); setAutocompletes([])}}/>
            <div className="relative top-full -mt-10 w-full bg-black rounded-bl-xl rounded-br-xl flex flex-col">
                {autocomplete && autocompletes.map((o, index) => (
                    <p className={`p-2 text-left ml-1 select-none darken-on-hover cursor-pointer ${selected == index ? "bg-gray-600" : ""}`} key={index} onClick={() => {setText(o); setChosen(o); setAutocomplete(false); setAutocompletes([])}}>{o}</p>
                ))}
            </div>
        </div>
    )
}