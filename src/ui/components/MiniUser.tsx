import { Crown, Verified } from "lucide-react";
import { useNavigate } from "react-router";
import { AccountIcon, SmuleUtil } from "smule.js";

export default function MiniUser({ account, verified = false }: { account: AccountIcon, verified?: boolean }) {
    // is there any problem if i use navigate on a p instead of a Link?
    // prolly not, but im too lazy to style for now
    const navigate = useNavigate()

    return (
        <div className="flex flex-row gap-1 items-center">
        <img src={account?.picUrl} className="h-4 aspect-square rounded-xl mt-0.5"/>
        <p className="font-light cursor-pointer username" onClick={() => navigate("/account/" + account?.accountId)}>@{account?.handle || "INVALID USER"}</p>
        {verified || SmuleUtil.isVerified(account?.verifiedType) ? (
            <Verified className="w-4 mt-0.5" style={{
                color: account.verifiedType == "PARTNER_ARTIST" ? "yellow" : account.verifiedType == "STAFF" ? "purple" : "white"
            }}/>
        ) : ""} {
            SmuleUtil.isVIP(account.subApps) ? <Crown className="w-4 mt-auto"/> : ""
        }
        </div>
    )
}