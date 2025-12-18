import React from 'react'
import { Link, useLocation } from 'react-router-dom'

function Header() {
  const location = useLocation()

  const linkStyle = (path) => ({
    padding: '0.5rem 1rem',
    borderRadius: '0.5rem',
    fontWeight: 500,
    background: location.pathname === path ? 'var(--primary)' : 'transparent',
    color: location.pathname === path ? 'white' : 'var(--text-secondary)',
    transition: 'all 0.2s'
  })

  return (
    <header style={{ background: 'white', boxShadow: '0 1px 3px rgb(0 0 0 / 0.1)', position: 'sticky', top: 0, zIndex: 100 }}>
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 1.5rem' }}>
        <Link to="/" style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--primary)' }}>
          Tour Booking
        </Link>
        <nav style={{ display: 'flex', gap: '0.5rem' }}>
          <Link to="/" style={linkStyle('/')}>Главная</Link>
          <Link to="/bookings" style={linkStyle('/bookings')}>Мои бронирования</Link>
        </nav>
      </div>
    </header>
  )
}

export default Header
