import Croppie from "croppie";
import { ArrowRight, Loader2 } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useOutletContext } from "react-router";
import { SDCArr } from "smule.js";
import AutocompletedField from "../components/AutocompletedField";
import PaddedBody from "../components/PaddedBody";
import { Button } from "@/components/ui/button";

// TODO: i dont like how this looks

export default function CustomizeArrSubPage() {
    const navigate = useNavigate()

    const [loading, setLoading] = useState(false)
    const [arr, setArr] = useOutletContext() as [SDCArr, (arr: SDCArr) => void]

    const croppieRef = useRef<Croppie>()
    const croppieDialog = useRef<HTMLDialogElement>()
    const fileDialog = useRef<HTMLInputElement>()

    const genreDialog = useRef<HTMLDialogElement>()

    useEffect(() => {
        if (!croppieRef.current)
            croppieRef.current = new Croppie(document.getElementById("croppie"), {
                viewport: {
                    width: 200,
                    height: 200,
                    type: "square"
                },
                boundary: {
                    width: 800,
                    height: 700
                }
            })
    }, [])

    const uploadCoverPicture = useCallback(async () => {
        if (croppieRef.current) {
            setLoading(true)
            const data = await croppieRef.current.result({
                type: "base64",
                format: "jpeg"
            })
            setArr({
                ...arr,
                coverUrl: {
                    ...arr.coverUrl,
                    url: data,
                }
            })
            croppieDialog.current?.close()
            setLoading(false)
        }
    }, [croppieRef.current])

    const [tempGenre, setTempGenre] = useState("")
    const [isTag, setIsTag] = useState(false)

    return (
        <div className="flex flex-row items-center mt-16 card rounded-2xl gap-8">
            <dialog ref={croppieDialog} className="absolute" style={{left: "50%", top: "50%", transform: "translate(-50%, -50%)", width: "800px", height: "800px"}}>
                <button className="absolute top-0 right-0 z-10" onClick={() => croppieDialog.current?.close()}>x</button>
                <div id="croppie" style={{height: "750px"}}></div>
                <button disabled={loading} className="flex flex-row gap-1" onClick={uploadCoverPicture}>Save{loading ? <Loader2 className="animate-spin"/> : ""}</button>
            </dialog>
            <dialog ref={genreDialog} className="absolute" style={{left: "50%", top:"50%", transform: "translate(-50%, -50%)", width: "800px", height: "800px"}}>
                <PaddedBody>
                    <h1>{isTag ? "Choose from the autocomplete list, or press the arrow to add a new tag." : "Choose from the autocomplete list. Custom genres are not allowed on smule"}</h1>
                    <div className="flex flex-row gap-4 items-center justify-center mt-8 mb-8">
                        <AutocompletedField text={tempGenre} setText={setTempGenre} setChosen={async (text) => {
                            if (isTag) {
                                setArr({
                                    ...arr,
                                    //@ts-ignore I am retarded and reused SDCGenre for tags, which is wrong. Tag ids are strings, not numbers.
                                    tags: [...arr.tags, {id: text, text: text}]
                                })
                            } else {
                                const res = await smuleDotCom.fetchGenreAutocomplete(text)
                                if (res) {
                                    const genre = res[0].value
                                    setArr({
                                        ...arr,
                                        genres: [...arr.genres, {id: genre.topicId, text: genre.name}]
                                    })
                                }
                            }
                            setTempGenre("")
                        }} getAutocomplete={async (q) => {
                            if (isTag) {
                                const res = await smuleDotCom.fetchTagAutocomplete(q)
                                return res.map(r => r.value)
                            } else {
                                const res = await smuleDotCom.fetchGenreAutocomplete(q)
                                return res.map(r => r.value.name)
                            }
                        }} className="w-[50%]"/>
                        {isTag ?
                        <button onClick={() => {
                            setArr({
                                ...arr,
                                //@ts-ignore I am retarded and reused SDCGenre for tags, which is wrong. Tag ids are strings, not numbers.
                                tags: [...arr.tags, {id: tempGenre, text: tempGenre}]
                            })
                            setTempGenre("")
                        }}><ArrowRight className="w-4"/></button>
                        : ""}
                        <div className="w-[50%] flex flex-row items-start gap-2 flex-wrap">
                            {isTag ? arr.tags.map((tag, i) => 
                                <span className="bg-darker-accent p-2 pt-1 pb-1 rounded-2xl select-none cursor-pointer darken-on-hover" key={i} onClick={() => {
                                    setArr({
                                        ...arr,
                                        tags: arr.tags.filter(t => t.id != tag.id)
                                    })
                                }}>{tag.text}</span>    
                            ) : arr.genres.map((genre, i) => 
                                <span className="bg-darker-accent p-2 pt-1 pb-1 rounded-2xl select-none cursor-pointer darken-on-hover" key={i} onClick={() => {
                                    setArr({
                                        ...arr,
                                        genres: arr.genres.filter(g => g.id != genre.id)
                                    })
                                }}>{genre.text}</span>
                            )}
                        </div>
                    </div>

                    <button onClick={() => {
                        genreDialog.current?.close()
                        setTempGenre("")
                    }}>Done</button>
                </PaddedBody>
            </dialog>
            <img src={arr.coverUrl.url} className="h-72 w-72 aspect-square rounded-xl" onClick={() => fileDialog.current?.click()} alt="Click here to change the cover picture" title="Click to change the cover picture"/>
            <input ref={fileDialog} type="file" hidden accept="image/*" onInput={(e) => {
                if (e.currentTarget.files?.[0]) {
                    croppieDialog.current?.showModal()
                    croppieRef.current?.bind({
                        url: URL.createObjectURL(e.currentTarget.files[0])
                    })
                }
            }}/>
            <div className="flex flex-col items-stretch justify-stretch gap-2">
                <div className="flex flex-row items-center gap-2 justify-between">
                    <label>Title:</label>
                    <AutocompletedField text={arr.title} setText={(text) => setArr({
                        ...arr,
                        title: text
                    })} getAutocomplete={async (q) => {
                        const res = await smuleDotCom.fetchTitleAutocomplete(q)
                        return res.map(r => r.title)
                    }}/>
                </div>

                <div className="flex flex-row items-center gap-2 justify-between">
                    <label>Artist:</label>
                    <AutocompletedField text={arr.artist} setText={(text) => setArr({
                        ...arr,
                        artist: text
                    })} getAutocomplete={async (q) => {
                        const res = await smuleDotCom.fetchArtistAutocomplete(q)
                        return res.map(r => r.value)
                    }}/>
                </div>

                <div className="flex flex-row items-center gap-2">
                    <label>Genre:</label>
                    <div className="flex flex-row items-center gap-2 flex-wrap">{arr.genres.map((genre, i) => 
                        <span className="bg-darker-accent p-2 pt-1 pb-1 rounded-2xl select-none cursor-pointer darken-on-hover" key={i} onClick={() => {
                            setArr({
                                ...arr,
                                genres: arr.genres.filter(g => g.id != genre.id)
                            })
                        }}>{genre.text}</span>
                    )}</div>
                    <button className="outlined" style={{padding: "4px 12px"}} onClick={() => {setIsTag(false); genreDialog.current?.showModal()}}>+</button>
                </div>

                <div className="flex flex-row items-center gap-2">
                    <label>Tags:</label>
                    <div className="flex flex-row items-center gap-2 flex-wrap">{arr.tags.map((tag, i) => 
                        <span className="bg-darker-accent p-2 pt-1 pb-1 rounded-2xl select-none cursor-pointer darken-on-hover" key={i} onClick={() => {
                            setArr({
                                ...arr,
                                tags: arr.tags.filter(g => g.id != tag.id)
                            })
                        }}>{tag.text}</span>
                    )}</div>
                    <button className="outlined" style={{padding: "4px 12px"}} onClick={() => {setIsTag(true); genreDialog.current?.showModal()}}>+</button>
                </div>
                <Button className="outlined" onClick={() => navigate("/create-arr/lyrics")}>Next</Button>
            </div>
        </div>
    )
}