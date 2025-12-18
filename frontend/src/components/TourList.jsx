import React, { useState, useEffect } from 'react'
import TourCard from './TourCard'

const API_URL = 'http://localhost:8000'

function TourList() {
  const [tours, setTours] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchTours()
  }, [])

  const fetchTours = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${API_URL}/tours`)
      if (!response.ok) throw new Error('Не удалось загрузить туры')
      const data = await response.json()
      setTours(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Загрузка туров...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container">
        <div className="error">
          <h3>Ошибка загрузки</h3>
          <p>{error}</p>
          <button className="btn btn-primary" onClick={fetchTours} style={{ marginTop: '1rem' }}>
            Попробовать снова
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="container">
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>Доступные туры</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.125rem' }}>Найдено туров: {tours.length}</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem' }}>
        {tours.map(tour => (
          <TourCard key={tour.id} tour={tour} />
        ))}
      </div>
    </div>
  )
}

export default TourList
