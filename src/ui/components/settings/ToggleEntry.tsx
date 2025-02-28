import { SwitchComponent } from "../SwitchComponent";

export default function ToggleEntry({ checked, onCheckedChange, children }: { checked: boolean, onCheckedChange: any, children: React.ReactNode}) {
    return (
        <div className="flex flex-row gap-2 items-center justify-center">
            <SwitchComponent checked={checked} onCheckedChange={onCheckedChange}/>
            <label>{children}</label>
        </div>
    )
}