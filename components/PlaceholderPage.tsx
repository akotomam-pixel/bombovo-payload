'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import TopBar from './TopBar'
import Header from './Header'
import Footer from './Footer'

interface PlaceholderPageProps {
  title?: string
}

export default function PlaceholderPage({ title }: PlaceholderPageProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <TopBar />
      <Header />
      
      <main className="flex-grow flex items-center justify-center bg-white px-4">
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.h1 
            className="text-6xl md:text-8xl font-bold text-bombovo-dark mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            Pripravujeme
          </motion.h1>
          
          {title && (
            <motion.p 
              className="text-2xl md:text-3xl text-bombovo-blue mb-8 font-handwritten"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              {title}
            </motion.p>
          )}
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            <Link href="/">
              <motion.button
                className="px-8 py-4 bg-bombovo-blue text-white font-bold text-lg rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                Späť na domovskú stránku
              </motion.button>
            </Link>
          </motion.div>
        </motion.div>
      </main>
      
      <Footer />
    </div>
  )
}



