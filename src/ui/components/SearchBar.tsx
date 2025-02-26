import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";

export default function SearchBar() {
    const navigate = useNavigate()
    const [query, setQuery] = useState("")
    const [autocompletes, setAutocompletes] = useState([] as string[])
    const [isId, setIsId] = useState(false)

    useEffect(() => {
        return () => {
            setQuery("")
            setAutocompletes([])
        }
    }, [])

    useEffect(() => {
        setIsId(false)
        if (query == "") return setAutocompletes([])
        let q = query + ""
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
            <Input type="text" placeholder="search" className="w-full" onChange={(e) => setQuery(e.target.value.trim())} onKeyDown={(e) => {
                if (e.key == "Enter" && query != "") {
                    let temp = query.split("_")
                    if (temp.length == 2 && !Number.isNaN(Number(temp[0])) && !Number.isNaN(Number(temp[1]))) {
                        navigate("/what/"+query)
                        return
                    }
                    navigate("/search/" + query)
                }
            }}/>
            <div className="absolute top-full w-full bg-black rounded-bl-xl rounded-br-xl flex flex-col">
            {isId ? <>
                <Link to={"/song/" + query} className="p-2 text-left ml-1">Song</Link>
                <Link to={"/performance/" + query} className="p-2 text-left ml-1">Performance</Link>
            </> : <>
                {autocompletes.map((o, index) => (
                    <Link to={"/search/" + o} className="p-2 text-left ml-1" key={index}>{o}</Link>
                ))}
            </>}
            </div>
        </div>
    )
}