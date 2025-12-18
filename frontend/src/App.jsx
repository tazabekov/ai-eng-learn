import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import TourList from './components/TourList'
import TourDetails from './components/TourDetails'
import ClientBookings from './components/ClientBookings'

function App() {
  return (
    <Router>
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Header />
        <main style={{ flex: 1, padding: '2rem 0' }}>
          <Routes>
            <Route path="/" element={<TourList />} />
            <Route path="/tours/:id" element={<TourDetails />} />
            <Route path="/bookings" element={<ClientBookings />} />
          </Routes>
        </main>
        <footer style={{ background: '#1e293b', color: 'white', padding: '2rem', textAlign: 'center' }}>
          <p>2024 Tour Booking. Все права защищены.</p>
        </footer>
      </div>
    </Router>
  )
}

export default App
