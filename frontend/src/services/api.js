// Prefer explicit VITE_API_BASE_URL, otherwise use relative `/api` so Vite
// dev-server proxy (configured in vite.config.js) can forward requests.
const BASE = import.meta.env.VITE_API_BASE_URL || '/api'

export async function planSafeRoutes({ origin, destination, mode = "WALK" }) {
    let res
    try {
        res = await fetch(`${BASE}/routes/safe`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ origin, destination, mode }),
        })
    } catch (err) {
        // Network error or connection refused — normalize error for UI
        throw new Error(`Network error: ${err?.message ?? err}`)
    }

    if (!res.ok) {
        const text = await res.text()
        throw new Error(`API error ${res.status}: ${text}`)
    }

    const data = await res.json()
    return data
}

export async function fetchPlaceSuggestions(query) {
    if (!query || query.length < 2) return []
    const url = `${BASE}/places/autocomplete?query=${encodeURIComponent(query)}`
    try {
        const res = await fetch(url)
        if (!res.ok) return []
        const data = await res.json()
        return data.suggestions ?? []
    } catch (err) {
        return []
    }
}

export default { planSafeRoutes, fetchPlaceSuggestions }
