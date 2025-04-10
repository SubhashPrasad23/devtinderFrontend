"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useNavigate } from "react-router-dom"

const Onboarding = () => {
  const navigate = useNavigate()
  const [showParticles, setShowParticles] = useState(true)
  const [showBackground, setShowBackground] = useState(true)

  
  // Generate random particles
  const particles = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 5 + 2,
    duration: Math.random() * 20 + 10,
    delay: Math.random() * 2,
  }))

  useEffect(() => {
    const token=document.cookie
    const timer = setTimeout(() => {
      setShowParticles(false)

      // Navigate after animation completes
      setTimeout(() => {
        navigate(token ? "/app" : "/login")
      }, 1000)
    }, 4000)

    return () => clearTimeout(timer)
  }, [navigate])

 

  return (
    <div className="min-h-screen overflow-hidden bg-black  relative flex flex-col items-center justify-center">
      {/* Split background animation - left half */}
      <motion.div
        className="absolute inset-y-0 left-0 w-1/2 z-0 bg-gradient-to-b from-gray-900 to-black "
        initial={{ x: "-100%" }}
        animate={{ x: 0 }}
        transition={{
          type: "spring",
          stiffness: 100,
          damping: 20,
          duration: 0.8,
        }}
        style={{
          opacity: showBackground ? 1 : 0,
          transition: "opacity 0.5s",
        }}
      />

      {/* Split background animation - right half */}
      <motion.div
        className="absolute inset-y-0 right-0 w-1/2 z-0 bg-gradient-to-b from-gray-900 to-black "
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        transition={{
          type: "spring",
          stiffness: 100,
          damping: 20,
          duration: 0.8,
        }}
        style={{
          opacity: showBackground ? 1 : 0,
          transition: "opacity 0.5s",
        }}
      />

      {/* Animated particles */}
      {showParticles &&
        particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute rounded-full bg-white opacity-70 z-10"
            initial={{
              x: `${particle.x}vw`,
              y: `${particle.y}vh`,
              opacity: 0,
              scale: 0,
            }}
            animate={{
              opacity: [0, 0.8, 0],
              scale: [0, 1, 0],
              x: `${particle.x + (Math.random() * 20 - 10)}vw`,
              y: `${particle.y + (Math.random() * 20 - 10)}vh`,
            }}
            transition={{
              duration: particle.duration,
              delay: particle.delay,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "loop",
            }}
            style={{
              width: particle.size,
              height: particle.size,
              filter: "blur(1px)",
            }}
          />
        ))}

      {/* Animated glow effect */}
      <motion.div
        className="absolute w-[500px] h-[500px] rounded-full bg-purple-500 opacity-20 z-0"
        initial={{ scale: 0.8 }}
        animate={{
          scale: [0.8, 1.2, 0.8],
          opacity: [0.1, 0.2, 0.1],
        }}
        transition={{
          duration: 8,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "reverse",
        }}
        style={{ filter: "blur(100px)" }}
      />

      {/* Content */}
      <motion.div
        className="relative z-20 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="mb-4"
        >
          <motion.div
            className="inline-block"
            animate={{
              rotateZ: [0, 5, 0, -5, 0],
              scale: [1, 1.1, 1, 1.1, 1],
            }}
            transition={{
              duration: 5,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "loop",
            }}
          >
            <span className="text-6xl font-extrabold">
              <span className="bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent">
                Dev
              </span>
              <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                Tinder
              </span>
            </span>
          </motion.div>
        </motion.div>

        <motion.p
          className="text-xl text-white/80 mt-6 max-w-md mx-auto"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
        >
          <span className="font-light">Where</span>
          <span className="font-bold mx-2 text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">
            code
          </span>
          <span className="font-light">meets</span>
          <span className="font-bold mx-2 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
            connection
          </span>
        </motion.p>

     
      </motion.div>

      {/* Animated rings */}
      <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
        {[1, 2, 3].map((ring) => (
          <motion.div
            key={ring}
            className="absolute rounded-full border border-white/10"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{
              scale: [0.8, 1.5],
              opacity: [0, 0.2, 0],
            }}
            transition={{
              duration: 3 + ring,
              delay: ring * 0.5,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "loop",
            }}
            style={{
              width: `${200 + ring * 100}px`,
              height: `${200 + ring * 100}px`,
            }}
          />
        ))}
      </div>
    </div>
  )
}

export default Onboarding

