// shadcn's one is broken because of my styles so im doing my own
import * as Switch from "@radix-ui/react-switch"

// so im writing my own lol
export function SwitchComponent({className = null, ...props}) {
    return (
    <Switch.Root className={"SwitchRoot " + className} {...props}>
        <Switch.Thumb className="SwitchThumb"/>
    </Switch.Root>
    )
}