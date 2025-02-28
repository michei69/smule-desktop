export default function SettingsSection({ text, children }: { text: string, children: React.ReactNode }) {
    return (
        <section className="flex flex-col gap-2 p-4 items-start justify-center">
            <h1 className="text-2xl">{text}</h1>
            <hr className="w-full rounded-2xl"/>
            {children}
        </section>
    )
}