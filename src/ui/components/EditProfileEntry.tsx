export default function EditProfileEntry({ label, value, callback }: { label: string, value: any, callback: (...args: any) => void }) {
    return (
        <div className="flex flex-row gap-2 items-center">
            <label>{label}:</label>
            <input type="text" value={value} className="ml-auto p-1" onChange={(e) => {
                callback(e.target.value)
            }}/>
        </div>
    )
}