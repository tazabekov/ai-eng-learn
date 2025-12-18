import React, { useState } from 'react'

const API_URL = 'http://localhost:8000'

function BookingForm({ tourId, onSuccess }) {
  const [formData, setFormData] = useState({ client_name: '', client_email: '', client_phone: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)
  const [errors, setErrors] = useState({})

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }))
  }

  const validate = () => {
    const newErrors = {}
    if (!formData.client_name.trim()) newErrors.client_name = 'Введите имя'
    if (!formData.client_email.trim()) newErrors.client_email = 'Введите email'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.client_email)) newErrors.client_email = 'Некорректный email'
    if (!formData.client_phone.trim()) newErrors.client_phone = 'Введите телефон'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return

    try {
      setLoading(true)
      setError(null)
      const response = await fetch(`${API_URL}/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tour_id: tourId, ...formData })
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.detail || 'Ошибка бронирования')
      }

      setSuccess(true)
      setFormData({ client_name: '', client_email: '', client_phone: '' })
      setTimeout(() => { if (onSuccess) onSuccess() }, 2000)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const inputStyle = (hasError) => ({
    width: '100%',
    padding: '0.875rem 1rem',
    border: `2px solid ${hasError ? 'var(--error)' : 'var(--border)'}`,
    borderRadius: '0.5rem',
    fontSize: '1rem',
    transition: 'all 0.2s',
    outline: 'none'
  })

  return (
    <div style={{ maxWidth: '600px' }}>
      {success && <div className="success" style={{ marginBottom: '1rem' }}><h4>Бронирование успешно!</h4><p>Подтверждение отправлено на email</p></div>}
      {error && <div className="error" style={{ marginBottom: '1rem' }}><h4>Ошибка</h4><p>{error}</p></div>}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div>
          <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem', fontSize: '0.875rem', textTransform: 'uppercase' }}>Полное имя *</label>
          <input type="text" name="client_name" value={formData.client_name} onChange={handleChange} placeholder="Иван Иванов" disabled={loading} style={inputStyle(errors.client_name)} />
          {errors.client_name && <span style={{ color: 'var(--error)', fontSize: '0.875rem' }}>{errors.client_name}</span>}
        </div>

        <div>
          <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem', fontSize: '0.875rem', textTransform: 'uppercase' }}>Email *</label>
          <input type="email" name="client_email" value={formData.client_email} onChange={handleChange} placeholder="ivan@example.com" disabled={loading} style={inputStyle(errors.client_email)} />
          {errors.client_email && <span style={{ color: 'var(--error)', fontSize: '0.875rem' }}>{errors.client_email}</span>}
        </div>

        <div>
          <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem', fontSize: '0.875rem', textTransform: 'uppercase' }}>Телефон *</label>
          <input type="tel" name="client_phone" value={formData.client_phone} onChange={handleChange} placeholder="+7 (999) 123-45-67" disabled={loading} style={inputStyle(errors.client_phone)} />
          {errors.client_phone && <span style={{ color: 'var(--error)', fontSize: '0.875rem' }}>{errors.client_phone}</span>}
        </div>

        <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%', justifyContent: 'center' }}>
          {loading ? <><div className="spinner" style={{ width: 20, height: 20 }}></div> Обработка...</> : 'Подтвердить бронирование'}
        </button>
      </form>
    </div>
  )
}

export default BookingForm
