import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";

export default function SearchBar() {
    const navigate = useNavigate()
    const [query, setQuery] = useState("")
    const [autocompletes, setAutocompletes] = useState([] as string[])

    useEffect(() => {
        if (query == "") return setAutocompletes([])
        let q = query + ""
        smule.getAutocomplete(query).then(res => {
            if (q != query) return
            setAutocompletes(res.options.map(o => o.text))
        })
    }, [query])

    return (
        <div className="searchbar">
            <Input type="text" placeholder="search" className="w-full" onChange={(e) => setQuery(e.target.value.trim())} onKeyDown={(e) => {
                if (e.key == "Enter" && query != "") {
                    navigate("/search/" + query)
                    console.log("what are we")
                }
            }}/>
            <div className="absolute top-full w-full bg-black rounded-bl-xl rounded-br-xl flex flex-col">
            {autocompletes.map((o, index) => (
                <Link to={"/search/" + o} className="p-2 text-left ml-1" key={index}>{o}</Link>
            ))}
            </div>
        </div>
    )
}