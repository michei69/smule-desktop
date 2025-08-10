import { useNavigate } from "react-router";
import PaddedBody from "../components/PaddedBody";
import { useCallback, useEffect, useRef, useState } from "react";
import { SingUserProfileResult, SmuleUtil } from "smule.js";
import Croppie from "croppie";
import "croppie/croppie.css";
import { Loader2 } from "lucide-react";
import Settings from "@/lib/settings";
import EditProfileEntry from "../components/EditProfileEntry";
import LoadingTemplate from "../components/LoadingTemplate";

export default function EditProfile() {
    const navigate = useNavigate()

    const [loading, setLoading] = useState(true)
    const [uploading, setUploading] = useState(false)
    const [profile, setProfile] = useState({} as SingUserProfileResult)
    const [isVip, setIsVip] = useState(false)
    const [pfp, setPfp] = useState("")
    const [reload, setReload] = useState(true)
    const [original, setOriginal] = useState({} as SingUserProfileResult)

    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [handle, setHandle] = useState("")
    const [bio, setBio] = useState("")
    const [newEmail, setNewEmail] = useState("")
    const [newPassword, setNewPassword] = useState("")

    const croppieRef = useRef<Croppie>()

    useEffect(() => {
        if (!reload) return
        smule.account.fetchSelf().then((profile) => {
            setProfile(profile)
            setOriginal(profile)
            setPfp(profile.profile.accountIcon.picUrl)
            setIsVip(SmuleUtil.isVIP(profile.profile.accountIcon.subApps))

            setFirstName(profile.profile.accountIcon?.firstName || "")
            setLastName(profile.profile.accountIcon?.lastName || "")
            setHandle(profile.profile.accountIcon?.handle || "")
            setBio(profile.profile.accountIcon?.blurb || "")

            setLoading(false)
            setReload(false)
            if (!croppieRef.current)
            croppieRef.current = new Croppie(document.getElementById("croppie"), {
                viewport: {
                    width: 200,
                    height: 200,
                    type: "circle"
                },
                boundary: {
                    width: 800,
                    height: 700
                }
            })
        })

        
    }, [reload])

    const uploadProfilePicture = useCallback(async () => {
        if (croppieRef.current) {
            setUploading(true)
            const data = await croppieRef.current.result({
                type: "base64"
            })
            await smule.account.uploadProfilePicture(Uint8Array.from(atob(data.split("base64,")[1]), c => c.charCodeAt(0)))
            croppieDialog.current?.close()
            setReload(true)
            setUploading(false)
        }
    }, [croppieRef.current])

    const croppieDialog = useRef<HTMLDialogElement>()
    const fileDialog = useRef<HTMLInputElement>()

    return (
        <PaddedBody className="flex flex-col gap-4 max-w-7xl items-center justify-center">
        {loading ? <LoadingTemplate/> : <>
            <dialog ref={croppieDialog} className="absolute" style={{left: "50%", top: "50%", transform: "translate(-50%, -50%)", width: "800px", height: "800px"}}>
                <button className="absolute top-0 right-0 z-10" onClick={() => croppieDialog.current?.close()}>x</button>
                <div id="croppie" style={{height: "750px"}}></div>
                <button disabled={uploading} className="flex flex-row gap-1" onClick={uploadProfilePicture}>Save{uploading ? <Loader2 className="animate-spin"/> : ""}</button>
            </dialog>
            <img src={pfp} className="w-64 h-64 rounded-full fakelink" title="Change profile picture" onClick={() => {
                fileDialog.current.click()
            }}/>
            <input ref={fileDialog} type="file" hidden onInput={(e) => {
                if (e.currentTarget.files?.[0]) {
                    croppieDialog.current?.showModal()
                    croppieRef.current?.bind({
                        url: URL.createObjectURL(e.currentTarget.files[0])
                    })
                }
            }}/>
            <div className="card cute-border rounded-2xl flex flex-col gap-4 items-stretch" style={{padding: "16px"}}>
                <h1 className="text-2xl font-bold">Profile details</h1>
                <EditProfileEntry label="First Name" value={firstName} callback={setFirstName}/>
                <EditProfileEntry label="Last Name" value={lastName} callback={setLastName}/>
                <EditProfileEntry label="Handle" value={handle} callback={setHandle}/>
                <EditProfileEntry label="Bio" value={bio} callback={setBio}/>
            </div>
            <div className="card cute-border rounded-2xl flex flex-col gap-4 items-stretch" style={{padding: "16px"}}>
                <h1 className="text-2xl font-bold">Account details</h1>
                <EditProfileEntry label="New Email" value={newEmail} callback={setNewEmail}/>
                <EditProfileEntry label="New Password" value={newPassword} callback={setNewPassword}/>
            </div>
            
            {isVip ? <>
            {/* TODO: cover photo, profile color, display name, show mentions */}
            </> : ""}

            <button disabled={uploading} onClick={async () => {
                setUploading(true)
                if (original.profile.accountIcon.firstName?.trim() != firstName.trim() || original.profile.accountIcon.lastName?.trim() != lastName.trim()) {
                    await smule.account.changeFullName(firstName.trim(), lastName.trim())
                }
                if (original.profile.accountIcon.handle.trim() != handle.trim()) {
                    await smule.account.changeUsername(handle)
                    Settings.setProfile({
                        ...original.profile,
                        accountIcon: {
                            ...original.profile.accountIcon,
                            handle: handle
                        }
                    })
                }
                if (original.profile.accountIcon.blurb != bio.trim()) {
                    await smule.account.changeBio(bio)
                }
                if (newEmail.trim().length > 2) {
                    if (newEmail.includes("@") && newEmail.includes("."))
                        await smule.account.changeEmail(newEmail)
                    else
                        alert("Invalid email! Not changing.")
                }
                if (newPassword.trim().length > 2) {
                    if (newPassword.trim().length > 8) // TODO: proper pass checking (small char, large char, number)
                        await smule.account.changePassword(newPassword)
                    else 
                        alert("Password too short! Not changing.")
                }
                setUploading(false)
                navigate(`/account/${profile.profile.accountIcon.accountId}`)
            }} className="flex flex-row gap-1">Save{uploading ? <Loader2 className="animate-spin"/> : ""}</button>
            <button onClick={() => navigate(`/account/${profile.profile.accountIcon.accountId}`)}>Cancel</button>
        </>}
        </PaddedBody>
    )
}