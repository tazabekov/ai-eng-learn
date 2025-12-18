import React from 'react'
import { Link } from 'react-router-dom'

function TourCard({ tour }) {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', minimumFractionDigits: 0 }).format(price)
  }

  const defaultImage = 'https://images.unsplash.com/photo-1488085061387-422e29b40080?w=800'

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ position: 'relative', height: '200px', overflow: 'hidden' }}>
        <img
          src={tour.image_url || defaultImage}
          alt={tour.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s' }}
          onError={(e) => { e.target.src = defaultImage }}
        />
        <span style={{
          position: 'absolute', top: '1rem', right: '1rem',
          background: 'rgba(255,255,255,0.95)', padding: '0.375rem 0.875rem',
          borderRadius: '2rem', fontSize: '0.875rem', fontWeight: 600, color: 'var(--primary)'
        }}>
          {tour.destination}
        </span>
      </div>

      <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
        <h3 style={{ fontSize: '1.375rem', fontWeight: 700, marginBottom: '0.75rem' }}>{tour.name}</h3>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '1.25rem', flex: 1 }}>
          {tour.description?.length > 100 ? `${tour.description.substring(0, 100)}...` : tour.description}
        </p>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
          <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{tour.duration_days} дней</span>
          <span style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--primary)' }}>{formatPrice(tour.price)}</span>
        </div>

        <Link to={`/tours/${tour.id}`} className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
          Подробнее
        </Link>
      </div>
    </div>
  )
}

export default TourCard
