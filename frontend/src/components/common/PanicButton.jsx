import { useState, useEffect } from 'react'
import Button from './Button.jsx'

export default function PanicButton({ phoneNumber = '', onPanic = null, className = '' }) {
  const [showModal, setShowModal] = useState(false)

  // Close modal on Escape
  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') setShowModal(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  async function handleConfirm() {
    setShowModal(false)

    if (typeof onPanic === 'function') {
      try {
        await onPanic()
      } catch (e) {
        console.error('onPanic handler failed', e)
      }
      return
    }

    if (phoneNumber) {
      // sanitize to digits and build tel: link
      const digits = phoneNumber.replace(/\D/g, '')
      let tel = ''
      if (digits.length === 10) tel = `tel:+1${digits}`
      else if (digits.length > 0) tel = `tel:+${digits}`
      else tel = phoneNumber.match(/^tel:/i) ? phoneNumber : `tel:${phoneNumber}`

      // open dialer (on mobile) or attempt to use default handler
      window.location.href = tel
      return
    }

    // Fallback: inform developer/user
    // eslint-disable-next-line no-alert
    alert('Panic triggered — no phone number or handler configured. Please configure `phoneNumber` or `onPanic`.')
  }

  return (
    <div className={className}>
      <Button
        variant="danger"
        onClick={() => setShowModal(true)}
        className="inline-flex items-center gap-2"
        aria-label="Panic - open confirmation modal"
      >
        <span className="text-sm font-semibold">SOS</span>
      </Button>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setShowModal(false)}
            aria-hidden
          />

          <div className="relative z-10 w-full max-w-md rounded-xl bg-night-900/90 p-6 shadow-lg">
            <h3 className="text-lg font-semibold text-white">Confirm SOS Call</h3>
            <p className="mt-2 text-sm text-slate-300">
              This will initiate a call to police.
            </p>

            {phoneNumber ? (
              <p className="mt-3 text-sm text-slate-200">Calling: {phoneNumber}</p>
            ) : (
              <p className="mt-3 text-sm text-slate-400">No phone number configured.</p>
            )}

            <div className="mt-6 flex items-center justify-end gap-3">
              <Button
                variant="secondary"
                onClick={() => setShowModal(false)}
                aria-label="Cancel panic"
              >
                Cancel
              </Button>

              <Button
                variant="danger"
                onClick={handleConfirm}
                aria-label="Confirm panic call"
              >
                Confirm call
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
