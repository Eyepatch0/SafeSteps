import { useState, useRef } from 'react'
import Card from '../common/Card.jsx'
import Button from '../common/Button.jsx'
import { fetchPlaceSuggestions } from '../../services/api'

const EMPTY_VALUES = {
  start: '',
  destination: '',
}

export default function RouteForm({ onSubmit, initialValues = EMPTY_VALUES, isSubmitting = false, onInputChange = null }) {
  const [formValues, setFormValues] = useState(() => ({
    start: initialValues?.start ?? '',
    destination: initialValues?.destination ?? '',
  }))
  const [suggestions, setSuggestions] = useState({ start: [], destination: [] })
  const [showSuggestions, setShowSuggestions] = useState({ start: false, destination: false })
  const debounceRef = useRef({ start: null, destination: null })

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormValues((prev) => ({ ...prev, [name]: value }))
    try {
      // notify parent that user edited the form so we can clear any old routes
      onInputChange?.()
    } catch (err) {
      console.error(err)
      // swallow errors from parent callback
    }

    // Debounced autocomplete
    if (debounceRef.current[name]) clearTimeout(debounceRef.current[name])
    if (!value || value.length < 2) {
      setSuggestions((s) => ({ ...s, [name]: [] }))
      return
    }

    debounceRef.current[name] = setTimeout(async () => {
      try {
        const preds = await fetchPlaceSuggestions(value)
        setSuggestions((s) => ({ ...s, [name]: preds }))
        setShowSuggestions((s) => ({ ...s, [name]: true }))
      } catch (err) {
        // ignore
      }
    }, 250)
  }

  const handleSelectSuggestion = (name, description) => {
    setFormValues((prev) => ({ ...prev, [name]: description }))
    setSuggestions((s) => ({ ...s, [name]: [] }))
    setShowSuggestions((s) => ({ ...s, [name]: false }))
    onInputChange?.()
  }

  const handleFocus = (name) => setShowSuggestions((s) => ({ ...s, [name]: true }))
  const handleBlur = (name) => setTimeout(() => setShowSuggestions((s) => ({ ...s, [name]: false })), 150)

  const handleSubmit = (event) => {
    event.preventDefault()
    onSubmit?.({
      start: formValues.start,
      destination: formValues.destination,
    })
  }

  return (
    <Card className="bg-night-900/70">
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <label className="text-sm text-slate-200" htmlFor="start">
            Starting point
          </label>
          <input
            id="start"
            name="start"
            value={formValues.start}
            onChange={handleChange}
            onFocus={() => handleFocus('start')}
            onBlur={() => handleBlur('start')}
            placeholder="e.g., McKeldin Library"
            className="w-full rounded-2xl border border-white/10 bg-night-900/60 px-4 py-3 text-base text-slate-100 placeholder:text-slate-500 focus:border-ember focus:outline-none focus:ring-2 focus:ring-ember/30"
            required
          />
          {showSuggestions.start && suggestions.start.length > 0 && (
            <ul className="max-h-48 overflow-auto rounded-lg bg-night-900/95 mt-1 border border-white/10">
              {suggestions.start.map((p, i) => (
                <li key={p.description ?? i}>
                  <button
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => handleSelectSuggestion('start', p.description)}
                    className="w-full text-left px-3 py-2 text-sm text-slate-100 hover:bg-white/5"
                  >
                    {p.description}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm text-slate-200" htmlFor="destination">
            Destination
          </label>
          <input
            id="destination"
            name="destination"
            value={formValues.destination}
            onChange={handleChange}
            onFocus={() => handleFocus('destination')}
            onBlur={() => handleBlur('destination')}
            placeholder="e.g., University View"
            className="w-full rounded-2xl border border-white/10 bg-night-900/60 px-4 py-3 text-base text-slate-100 placeholder:text-slate-500 focus:border-ember focus:outline-none focus:ring-2 focus:ring-ember/30"
            required
          />
          {showSuggestions.destination && suggestions.destination.length > 0 && (
            <ul className="max-h-48 overflow-auto rounded-lg bg-night-900/95 mt-1 border border-white/10">
              {suggestions.destination.map((p, i) => (
                <li key={p.description ?? i}>
                  <button
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => handleSelectSuggestion('destination', p.description)}
                    className="w-full text-left px-3 py-2 text-sm text-slate-100 hover:bg-white/5"
                  >
                    {p.description}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="space-y-3 pt-1">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Searching…' : 'Illuminate Route'}
          </Button>
        </div>
      </form>
    </Card>
  )
}


