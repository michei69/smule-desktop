import { AccountIcon } from "@/api/smule-types";
import { SmuleUtil } from "@/api/util";
import { Verified } from "lucide-react";

export default function MiniUser({ account, verified = false }: { account: AccountIcon, verified?: boolean }) {
    return (
        <>
        <img src={account.picUrl} className="h-4 aspect-square rounded-xl mt-0.5"/>
        <p className="font-light">@{account.handle}</p>
        {verified || SmuleUtil.isVerified(account.verifiedType) ? (
            <Verified className="w-4 mr-2 mt-0.5"/>
        ) : ""}
        </>
    )
}