import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";

export default function SearchBar({ params = null }: { params?: any }) {
    const navigate = useNavigate()
    const [query, setQuery] = useState("")
    const [autocompletes, setAutocompletes] = useState([] as string[])
    const [isId, setIsId] = useState(false)
    const [selected, setSelected] = useState(-1)

    useEffect(() => {
        setQuery("")
        setAutocompletes([])
        setSelected(-1)
        return () => {
            setQuery("")
            setAutocompletes([])
            setSelected(-1)
        }
    }, [params])

    useEffect(() => {
        setSelected(-1)
        setIsId(false)
        if (query.trim() == "") return setAutocompletes([])
        let q = query.trim() + ""
        let temp = q.split("_")
        if (temp.length == 2 && !Number.isNaN(Number(temp[0])) && !Number.isNaN(Number(temp[1]))) {
            setAutocompletes([])
            setIsId(true)
            return
        }
        smule.getAutocomplete(query).then(res => {
            if (q != query) return
            setAutocompletes(res.options.map(o => o.text))
        })
    }, [query])

    return (
        <div className="searchbar">
            <Input type="text" placeholder="search" className="w-full" value={query} onChange={(e) => setQuery(e.target.value)} onKeyDown={(e) => {
                if (e.key == "ArrowUp" && selected > -1) {
                    e.preventDefault()
                    setSelected(selected - 1)
                }
                else if (e.key == "ArrowDown" && (selected < autocompletes.length - 1 || isId && selected < 1)) {
                    e.preventDefault()
                    setSelected(selected + 1)
                }
                console.log(selected)
                if (e.key == "Enter" && query != "") {
                    if (isId) {
                        switch (selected as number) {
                            case 1:
                                navigate("/performance/" + query)
                                break;
                            case 0:
                                navigate("/song/" + query)
                                break;
                            default:
                                navigate("/what/"+query)
                        }
                        return
                    }
                    if (selected != -1) {
                        navigate("/search/" + autocompletes[selected])
                        setQuery("")
                        return
                    }
                    navigate("/search/" + query)
                }
            }}/>
            <div className="absolute top-full w-full bg-black rounded-bl-xl rounded-br-xl flex flex-col">
            {isId ? <>
                <Link to={"/song/" + query} className={`p-2 text-left ml-1 ${selected == 0 ? "bg-gray-600" : ""}`}>Song</Link>
                <Link to={"/performance/" + query} className={`p-2 text-left ml-1 ${selected == 1 ? "bg-gray-600" : ""}`}>Performance</Link>
            </> : <>
                {autocompletes.map((o, index) => (
                    <Link to={"/search/" + o} className={`p-2 text-left ml-1 ${selected == index ? "bg-gray-600" : ""}`} key={index}>{o}</Link>
                ))}
            </>}
            </div>
        </div>
    )
}