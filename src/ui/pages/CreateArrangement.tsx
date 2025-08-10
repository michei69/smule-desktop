import { Button } from "@/components/ui/button";
import PaddedBody from "../components/PaddedBody";
import { Outlet, useLocation } from "react-router";
import { ArrowRight } from "lucide-react";
import { useState } from "react";
import { SDCArr } from "smule.js";

export default function CreateArrangementPage() {
    const location = useLocation()
    const [currentArr, setCurrentArr] = useState(null as SDCArr)

    const visible = {opacity:"100"}
    return (
        <PaddedBody className="flex flex-col gap-4 max-w-7xl">
            <div className="flex flex-row justify-center items-center gap-4">
                <Button disabled={true} className={`${location.pathname == "/create-arr" ? "selected" : ""} ignore-disabled`} style={visible}>Login</Button>
                <ArrowRight className="w-4"/>
                <Button disabled={true} className={`${location.pathname == "/create-arr/upload" ? "selected" : ""} ignore-disabled`} style={visible}>Upload</Button>
                <ArrowRight className="w-4"/>
                <Button disabled={true} className={`${location.pathname == "/create-arr/customize" ? "selected" : ""} ignore-disabled`} style={visible}>Customize</Button>
                <ArrowRight className="w-4"/>
                <Button disabled={true} className={`${location.pathname == "/create-arr/lyrics" ? "selected" : ""} ignore-disabled`} style={visible}>Lyrics</Button>
                <ArrowRight className="w-4"/>
                <Button disabled={true} className={`${location.pathname == "/create-arr/sync" ? "selected" : ""} ignore-disabled`} style={visible}>Sync</Button>
                <ArrowRight className="w-4"/>
                <Button disabled={true} className={`${location.pathname == "/create-arr/segments" ? "selected" : ""} ignore-disabled`} style={visible}>Segments</Button>
                <ArrowRight className="w-4"/>
                <Button disabled={true} className={`${location.pathname == "/create-arr/publish" ? "selected" : ""} ignore-disabled`} style={visible}>Publish</Button>
            </div>
            <Outlet context={[currentArr, setCurrentArr]}/>
        </PaddedBody>
    )
}