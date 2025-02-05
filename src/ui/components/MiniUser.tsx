import { AccountIcon } from "@/api/smule-types";
import { SmuleUtil } from "@/api/util";
import { Verified } from "lucide-react";
import { useNavigate } from "react-router";

export default function MiniUser({ account, verified = false }: { account: AccountIcon, verified?: boolean }) {
    // is there any problem if i use navigate on a p instead of a Link?
    // prolly not, but im too lazy to style for now
    const navigate = useNavigate()

    return (
        <>
        <img src={account.picUrl} className="h-4 aspect-square rounded-xl mt-0.5"/>
        <p className="font-light cursor-pointer" onClick={() => navigate("/account/" + account.accountId)}>@{account.handle}</p>
        {verified || SmuleUtil.isVerified(account.verifiedType) ? (
            <Verified className="w-4 mr-2 mt-0.5"/>
        ) : ""}
        </>
    )
}