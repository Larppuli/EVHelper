export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const date = searchParams.get("date")
    const hour = searchParams.get("hour")

    if (!date || !hour) {
        return Response.json({ error: "Missing date or hour parameter" }, { status: 400 })
    }

    try {
        const res = await fetch(`https://api.porssisahko.net/v1/price.json?date=${date}&hour=${hour}`, {
            headers: { 'Content-Type': 'application/json' },
        })

        if (!res.ok) {
            return Response.json({ error: `API request failed with status ${res.status}` }, { status: res.status })
        }

        const data = await res.json()
        return Response.json({ data })
    } catch (error) {
        return Response.json({ error: "Failed to fetch electricity price" }, { status: 500 })
    }
}