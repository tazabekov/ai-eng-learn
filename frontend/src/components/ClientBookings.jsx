import React, { useState } from 'react'

const API_URL = 'http://localhost:8000'

function ClientBookings() {
  const [email, setEmail] = useState('')
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [searched, setSearched] = useState(false)

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!email.trim()) { setError('Введите email'); return }

    try {
      setLoading(true)
      setError(null)
      setSearched(true)
      const response = await fetch(`${API_URL}/bookings/client/${encodeURIComponent(email)}`)
      if (!response.ok) throw new Error('Ошибка поиска')
      const data = await response.json()
      setBookings(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString) => {
    return new Intl.DateTimeFormat('ru-RU', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }).format(new Date(dateString))
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', minimumFractionDigits: 0 }).format(price)
  }

  const statusMap = {
    pending: { label: 'В ожидании', bg: '#fef3c7', color: '#92400e' },
    confirmed: { label: 'Подтверждено', bg: '#d1fae5', color: '#065f46' },
    cancelled: { label: 'Отменено', bg: '#fee2e2', color: '#991b1b' }
  }

  return (
    <div className="container" style={{ maxWidth: '900px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>Мои бронирования</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.125rem' }}>Введите email для просмотра бронирований</p>
      </div>

      <form onSubmit={handleSearch} className="card" style={{ display: 'flex', gap: '1rem', padding: '1.5rem', marginBottom: '2rem' }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }}>📧</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Введите ваш email"
            disabled={loading}
            style={{ width: '100%', padding: '0.875rem 1rem 0.875rem 3rem', border: '2px solid var(--border)', borderRadius: '0.5rem', fontSize: '1rem', outline: 'none' }}
          />
        </div>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? <><div className="spinner" style={{ width: 20, height: 20 }}></div> Поиск...</> : '🔍 Найти'}
        </button>
      </form>

      {error && <div className="error"><h4>Ошибка</h4><p>{error}</p></div>}

      {searched && !loading && bookings.length === 0 && (
        <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem', opacity: 0.5 }}>📋</div>
          <h2>Бронирования не найдены</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Для данного email нет бронирований</p>
        </div>
      )}

      {bookings.length > 0 && (
        <div>
          <div style={{ background: 'var(--primary)', color: 'white', padding: '0.75rem 1.5rem', borderRadius: '0.5rem', fontWeight: 600, marginBottom: '1.5rem', display: 'inline-block' }}>
            Найдено бронирований: {bookings.length}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {bookings.map(booking => (
              <div key={booking.id} className="card" style={{ padding: '1.75rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', paddingBottom: '1.25rem', borderBottom: '2px solid var(--border)' }}>
                  <div>
                    <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>{booking.tour?.name}</h3>
                    <p style={{ color: 'var(--text-secondary)' }}>📍 {booking.tour?.destination}</p>
                  </div>
                  <span style={{ background: statusMap[booking.status]?.bg, color: statusMap[booking.status]?.color, padding: '0.5rem 1rem', borderRadius: '2rem', fontSize: '0.875rem', fontWeight: 600, textTransform: 'uppercase' }}>
                    {statusMap[booking.status]?.label}
                  </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.25rem', marginBottom: '1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
                    <span style={{ fontSize: '1.5rem' }}>👤</span>
                    <div><div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Клиент</div><div style={{ fontWeight: 500 }}>{booking.client?.name}</div></div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
                    <span style={{ fontSize: '1.5rem' }}>⏱️</span>
                    <div><div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Длительность</div><div style={{ fontWeight: 500 }}>{booking.tour?.duration_days} дней</div></div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
                    <span style={{ fontSize: '1.5rem' }}>📅</span>
                    <div><div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Дата бронирования</div><div style={{ fontWeight: 500 }}>{formatDate(booking.booking_date)}</div></div>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1.25rem', borderTop: '2px solid var(--border)' }}>
                  <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', fontFamily: 'monospace' }}>ID: {booking.id}</span>
                  <span style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--primary)' }}>{formatPrice(booking.total_price)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default ClientBookings
