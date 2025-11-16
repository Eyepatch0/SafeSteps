import { useState } from 'react'
import Card from '../common/Card.jsx'
import Button from '../common/Button.jsx'

const EMPTY_VALUES = {
  start: '',
  destination: '',
}

export default function RouteForm({ onSubmit, initialValues = EMPTY_VALUES, isSubmitting = false, onInputChange = null }) {
  const [formValues, setFormValues] = useState(() => ({
    start: initialValues?.start ?? '',
    destination: initialValues?.destination ?? '',
  }))

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
  }

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
            placeholder="e.g., McKeldin Library"
            className="w-full rounded-2xl border border-white/10 bg-night-900/60 px-4 py-3 text-base text-slate-100 placeholder:text-slate-500 focus:border-ember focus:outline-none focus:ring-2 focus:ring-ember/30"
            required
          />
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
            placeholder="e.g., University View"
            className="w-full rounded-2xl border border-white/10 bg-night-900/60 px-4 py-3 text-base text-slate-100 placeholder:text-slate-500 focus:border-ember focus:outline-none focus:ring-2 focus:ring-ember/30"
            required
          />
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


