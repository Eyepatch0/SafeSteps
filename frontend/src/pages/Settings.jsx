import { useEffect, useState } from 'react'
import Badge from '../components/common/Badge.jsx'
import Card from '../components/common/Card.jsx'
import AccessibilityToggle from '../components/controls/AccessibilityToggle.jsx'
import PanicButton from '../components/common/PanicButton.jsx'
import Button from '../components/common/Button.jsx'

const SAFE_CONTACTS_STORAGE_KEY = 'safesteps_safe_contacts'

export default function Settings({
  accessibilitySettings,
  onAccessibilityChange,
}) {
  const [safeContacts, setSafeContacts] = useState([])
  const [isContactModalOpen, setIsContactModalOpen] = useState(false)
  const [editingContactId, setEditingContactId] = useState(null)
  const [contactName, setContactName] = useState('')
  const [contactPhone, setContactPhone] = useState('')
  const [formErrors, setFormErrors] = useState({})

  useEffect(() => {
    if (typeof window === 'undefined') return

    try {
      const stored = window.localStorage.getItem(SAFE_CONTACTS_STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        if (Array.isArray(parsed)) {
          setSafeContacts(parsed)
        }
      }
    } catch (error) {
      console.error('Failed to read safe contacts from storage', error)
    }
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return

    try {
      window.localStorage.setItem(
        SAFE_CONTACTS_STORAGE_KEY,
        JSON.stringify(safeContacts),
      )
    } catch (error) {
      console.error('Failed to persist safe contacts', error)
    }
  }, [safeContacts])

  useEffect(() => {
    if (!isContactModalOpen || typeof window === 'undefined') return

    function handleKey(event) {
      if (event.key === 'Escape') {
        setIsContactModalOpen(false)
        setEditingContactId(null)
        setContactName('')
        setContactPhone('')
        setFormErrors({})
      }
    }

    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [isContactModalOpen])

  function openContactModal(contact = null) {
    if (contact) {
      setEditingContactId(contact.id)
      setContactName(contact.name)
      setContactPhone(contact.phone)
    } else {
      setEditingContactId(null)
      setContactName('')
      setContactPhone('')
    }
    setFormErrors({})
    setIsContactModalOpen(true)
  }

  function closeContactModal() {
    setIsContactModalOpen(false)
    setEditingContactId(null)
    setContactName('')
    setContactPhone('')
    setFormErrors({})
  }

  function handleSaveContact(event) {
    event.preventDefault()
    const trimmedName = contactName.trim()
    const trimmedPhone = contactPhone.trim()
    const errors = {}

    if (!trimmedName) {
      errors.name = 'Name is required.'
    }

    if (!trimmedPhone) {
      errors.phone = 'Phone number is required.'
    } else if (trimmedPhone.replace(/\D/g, '').length < 7) {
      errors.phone = 'Enter a valid phone number.'
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors)
      return
    }

    setSafeContacts((prev) => {
      if (editingContactId) {
        return prev.map((contact) =>
          contact.id === editingContactId
            ? { ...contact, name: trimmedName, phone: trimmedPhone }
            : contact,
        )
      }

      const newContact = {
        id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
        name: trimmedName,
        phone: trimmedPhone,
      }
      return [...prev, newContact]
    })

    closeContactModal()
  }

  function handleDeleteContact(contactId) {
    const confirmed =
      typeof window === 'undefined'
        ? true
        : // eslint-disable-next-line no-alert
          window.confirm('Remove this safe contact?')
    if (!confirmed) return

    setSafeContacts((prev) => prev.filter((contact) => contact.id !== contactId))
  }

  return (
    <section className="space-y-8">
      <div className="flex flex-col gap-3">
        <Badge tone="info" className="w-fit tracking-[0.35em]">
          Night Guide
        </Badge>
        <h1 className="font-heading text-4xl font-semibold text-white sm:text-5xl">
          Tune your experience.
        </h1>
        <p className="max-w-2xl text-base text-slate-300">
          Configure accessibility, visual focus, and upcoming safety alerts. Your
          preferences stay local so you can quickly personalize SafeSteps at any
          kiosk or device.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="bg-night-900/70">
          <div className="space-y-2">
            <p className="text-sm uppercase tracking-[0.35em] text-slate-400">
              Visual comfort
            </p>
            <p className="text-xl text-white">Accessibility controls</p>
            <p className="text-sm text-slate-400">
              Toggle contrast, glow, and typography to fit your needs. These
              settings will soon propagate across the entire routing experience.
            </p>
          </div>
          <div className="mt-6">
            <AccessibilityToggle
              value={accessibilitySettings}
              onChange={onAccessibilityChange}
            />
          </div>
        </Card>

        <Card className="bg-night-900/70">
          <div className="space-y-3">
            <p className="text-sm uppercase tracking-[0.35em] text-slate-400">
              Safety settings
            </p>
            <p className="text-xl text-white">Immediate help</p>
            <div className="mt-6">
              <p className="text-sm text-slate-300 mb-3">
                If you need immediate assistance, use the panic button below to
                initiate a call to campus police.
              </p>
              <div className="flex justify-center">
                <div className="w-48">
                  <PanicButton phoneNumber={"(410) 706-3333"} />
                </div>
              </div>
            </div>

            <div className="mt-10 border-t border-white/5 pt-6">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-1.5">
                  <p className="text-base text-white">Safe contacts</p>
                  <p className="text-sm text-slate-400">
                    Add trusted contacts you can reference while traveling.
                  </p>
                </div>
                <Button
                  type="button"
                  variant="secondary"
                  className="w-auto px-5 py-2 text-xs uppercase tracking-[0.3em]"
                  onClick={() => openContactModal()}
                  aria-label="Add a safe contact"
                >
                  Add contact
                </Button>
              </div>

              {safeContacts.length === 0 ? (
                <p className="mt-4 rounded-lg border border-dashed border-white/10 bg-night-950/40 p-4 text-sm text-slate-400">
                  No safe contacts yet. Save a friend, roommate, or parent so
                  their info is ready when you need it.
                </p>
              ) : (
                <ul className="mt-5 space-y-3" aria-label="Saved safe contacts">
                  {safeContacts.map((contact) => (
                    <li
                      key={contact.id}
                      className="flex flex-col gap-3 rounded-xl border border-white/10 bg-night-950/40 p-4 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div>
                        <p className="text-sm font-medium text-white">
                          {contact.name}
                        </p>
                        <p className="text-sm text-slate-400">
                          {contact.phone}
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <button
                          type="button"
                          className="text-xs font-semibold uppercase tracking-wide text-slate-300 transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember/60 focus-visible:ring-offset-2 focus-visible:ring-offset-night-900"
                          onClick={() => openContactModal(contact)}
                          aria-label={`Edit ${contact.name}`}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          className="text-xs font-semibold uppercase tracking-wide text-rose-400 transition hover:text-rose-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-2 focus-visible:ring-offset-night-900"
                          onClick={() => handleDeleteContact(contact.id)}
                          aria-label={`Delete ${contact.name}`}
                        >
                          Delete
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </Card>
      </div>

      {isContactModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={closeContactModal}
            aria-hidden
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="safe-contacts-modal-title"
            className="relative z-10 w-full max-w-md rounded-2xl border border-white/10 bg-night-900/90 p-6 shadow-2xl backdrop-blur"
          >
            <h3
              id="safe-contacts-modal-title"
              className="text-lg font-semibold text-white"
            >
              {editingContactId ? 'Edit contact' : 'Add contact'}
            </h3>
            <p className="mt-2 text-sm text-slate-400">
              Keep someone you trust just a tap away.
            </p>

            <form className="mt-6 space-y-4" onSubmit={handleSaveContact}>
              <div>
                <label
                  className="block text-sm text-slate-300"
                  htmlFor="safe-contact-name"
                >
                  Contact name
                  <input
                    id="safe-contact-name"
                    name="name"
                    type="text"
                    value={contactName}
                    onChange={(event) => setContactName(event.target.value)}
                    className="mt-1 w-full rounded-lg border border-white/10 bg-night-950/60 px-4 py-2 text-sm text-black placeholder:text-slate-500 focus:border-ember/60 focus:outline-none focus:ring-2 focus:ring-ember/40"
                    placeholder="e.g. Campus escort desk"
                    required
                  />
                </label>
                {formErrors.name && (
                  <p className="mt-1 text-xs text-rose-400">{formErrors.name}</p>
                )}
              </div>

              <div>
                <label
                  className="block text-sm text-slate-300"
                  htmlFor="safe-contact-phone"
                >
                  Contact phone number
                  <input
                    id="safe-contact-phone"
                    name="phone"
                    type="tel"
                    value={contactPhone}
                    onChange={(event) => setContactPhone(event.target.value)}
                    className="mt-1 w-full rounded-lg border border-white/10 bg-night-950/60 px-4 py-2 text-sm text-black placeholder:text-slate-500 focus:border-ember/60 focus:outline-none focus:ring-2 focus:ring-ember/40"
                    placeholder="(555) 123-4567"
                    required
                  />
                </label>
                {formErrors.phone && (
                  <p className="mt-1 text-xs text-rose-400">{formErrors.phone}</p>
                )}
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <Button
                  type="button"
                  variant="secondary"
                  className="w-auto px-4 py-2 text-xs uppercase tracking-[0.25em]"
                  onClick={closeContactModal}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="w-auto px-4 py-2 text-xs uppercase tracking-[0.25em]"
                >
                  Save
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  )
}


