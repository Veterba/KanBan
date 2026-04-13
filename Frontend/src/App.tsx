import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ContactModal from './components/ContactModal'
import LandingPage from './pages/Landing/LandingPage'
import SignIn from './pages/Auth/SignIn'
import SignUp from './pages/Auth/SignUp'
import WorkflowPage from './pages/Workflow/WorkflowPage'
import AccountPage from './pages/Account/AccountPage'

function App() {
  const location = useLocation()
  const [contactOpen, setContactOpen] = useState(false)

  const isWorkflow = location.pathname === '/workflow'

  return (
    <>
      {!isWorkflow && (
        <Navbar onContactClick={() => setContactOpen(true)} />
      )}

      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth/signin" element={<SignIn />} />
          <Route path="/auth/signup" element={<SignUp />} />
          <Route path="/workflow" element={<WorkflowPage />} />
          <Route path="/account" element={<AccountPage />} />
        </Routes>
      </AnimatePresence>

      {!isWorkflow && location.pathname !== '/auth/signin' && location.pathname !== '/auth/signup' && (
        <Footer onContactClick={() => setContactOpen(true)} />
      )}

      <AnimatePresence>
        {contactOpen && (
          <ContactModal onClose={() => setContactOpen(false)} />
        )}
      </AnimatePresence>
    </>
  )
}

export default App
