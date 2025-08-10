export default function ErrorComponent({ error = "Something went wrong.", retry = "Retry" }) {
    return (
        <div className="flex flex-col gap-4 items-center mt-8">
            <h1 className="text-2xl font-bold">{error}</h1>
            <button onClick={() => window.location.reload()}>{retry}</button>
        </div>
    )
}