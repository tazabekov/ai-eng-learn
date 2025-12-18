import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import BookingForm from './BookingForm'

const API_URL = 'http://localhost:8000'

function TourDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [tour, setTour] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    fetchTour()
  }, [id])

  const fetchTour = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${API_URL}/tours/${id}`)
      if (!response.ok) throw new Error('Тур не найден')
      const data = await response.json()
      setTour(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', minimumFractionDigits: 0 }).format(price)
  }

  const defaultImage = 'https://images.unsplash.com/photo-1488085061387-422e29b40080?w=1200'

  if (loading) {
    return <div className="loading"><div className="spinner"></div><p>Загрузка...</p></div>
  }

  if (error) {
    return (
      <div className="container">
        <div className="error">
          <h3>Ошибка</h3>
          <p>{error}</p>
          <button className="btn btn-primary" onClick={() => navigate('/')} style={{ marginTop: '1rem' }}>
            Вернуться к списку
          </button>
        </div>
      </div>
    )
  }

  if (!tour) return null

  return (
    <div>
      <div style={{ position: 'relative', height: '400px', overflow: 'hidden' }}>
        <img
          src={tour.image_url || defaultImage}
          alt={tour.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          onError={(e) => { e.target.src = defaultImage }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.7))', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '2rem', color: 'white' }}>
          <div className="container">
            <button onClick={() => navigate('/')} style={{ background: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.3)', color: 'white', padding: '0.5rem 1rem', borderRadius: '0.5rem', cursor: 'pointer', marginBottom: '1rem' }}>
              ← Назад
            </button>
            <h1 style={{ fontSize: '3rem', fontWeight: 700, marginBottom: '1rem' }}>{tour.name}</h1>
            <div style={{ display: 'flex', gap: '2rem', fontSize: '1.125rem' }}>
              <span>📍 {tour.destination}</span>
              <span>⏱️ {tour.duration_days} дней</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container" style={{ marginTop: '2rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '2rem', alignItems: 'start' }}>
          <div>
            <div className="card" style={{ padding: '2rem', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '1.5rem' }}>Описание тура</h2>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: '1.125rem' }}>{tour.description}</p>
            </div>

            {showForm ? (
              <div className="card" style={{ padding: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                  <h2 style={{ fontSize: '1.75rem', fontWeight: 700 }}>Забронировать тур</h2>
                  <button className="btn" style={{ background: 'var(--text-secondary)', color: 'white' }} onClick={() => setShowForm(false)}>
                    Отмена
                  </button>
                </div>
                <BookingForm tourId={tour.id} onSuccess={() => { setShowForm(false); navigate('/bookings') }} />
              </div>
            ) : (
              <button className="btn btn-primary" style={{ width: '100%', padding: '1rem', fontSize: '1.125rem' }} onClick={() => setShowForm(true)}>
                Забронировать тур
              </button>
            )}
          </div>

          <div className="card" style={{ padding: '1.75rem', position: 'sticky', top: '6rem' }}>
            <div style={{ textAlign: 'center', paddingBottom: '1.5rem', marginBottom: '1.5rem', borderBottom: '2px solid var(--border)' }}>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>Цена тура</div>
              <div style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--primary)' }}>{formatPrice(tour.price)}</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <span style={{ fontSize: '2rem' }}>⏱️</span>
                <div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Длительность</div>
                  <div style={{ fontWeight: 600 }}>{tour.duration_days} дней</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <span style={{ fontSize: '2rem' }}>📍</span>
                <div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Направление</div>
                  <div style={{ fontWeight: 600 }}>{tour.destination}</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <span style={{ fontSize: '2rem' }}>💺</span>
                <div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Свободных мест</div>
                  <div style={{ fontWeight: 600 }}>{tour.available_seats}</div>
                </div>
              </div>
            </div>
            {!showForm && (
              <button className="btn btn-primary" style={{ width: '100%' }} onClick={() => setShowForm(true)}>
                Забронировать
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default TourDetails
