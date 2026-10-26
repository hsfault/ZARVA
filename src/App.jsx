import { useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import CartDrawer from './components/CartDrawer'
import PageTransition from './components/PageTransition'
import Home from './pages/Home'
import Shop from './pages/Shop'
import Product from './pages/Product'
import Fabrics from './pages/Fabrics'
import About from './pages/About'
import Contact from './pages/Contact'
import NotFound from './pages/NotFound'
import { startSmoothScroll } from './lib/smoothScroll'

export default function App() {
  const location = useLocation()

  useEffect(() => {
    startSmoothScroll()
  }, [])

  return (
    <>
      <Navbar />
      <CartDrawer />
      <AnimatePresence mode="wait">
        <PageTransition key={location.pathname}>
          <Routes location={location}>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/shop/:slug" element={<Product />} />
            <Route path="/fabrics" element={<Fabrics />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Footer />
        </PageTransition>
      </AnimatePresence>
    </>
  )
}