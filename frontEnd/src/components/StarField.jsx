import { useEffect, useRef } from 'react'

const STAR_COUNT   = 400
const PARTICLE_COUNT = 60
const SHOOTING_STAR_CHANCE = 0.015

export default function StarField() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx    = canvas.getContext('2d')
    let raf

    const resize = () => {
      canvas.width  = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    // Build stars
    const stars = Array.from({ length: STAR_COUNT }, () => ({
      x:    Math.random() * canvas.width,
      y:    Math.random() * canvas.height,
      r:    Math.random() * 1.5 + 0.3,
      a:    Math.random(),
      da:   (Math.random() - 0.5) * 0.003,
      twinkleSpeed: Math.random() * 0.02 + 0.005,
    }))

    // Build drifting particles
    const particles = Array.from({ length: PARTICLE_COUNT }, () => ({
      x:  Math.random() * canvas.width,
      y:  Math.random() * canvas.height,
      r:  Math.random() * 3 + 1,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      hue: Math.random() > 0.5 ? 271 : 186,  // purple or cyan
      a:  Math.random() * 0.5 + 0.2,
    }))

    // Shooting stars array
    let shootingStars = []

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Randomly spawn shooting stars
      if (Math.random() < SHOOTING_STAR_CHANCE) {
        shootingStars.push({
          x: Math.random() * canvas.width,
          y: -10,
          length: Math.random() * 80 + 40,
          speedX: Math.random() * 8 + 4,
          speedY: Math.random() * 8 + 4,
          life: 1, // goes from 1 to 0
          decay: Math.random() * 0.015 + 0.005,
          hue: Math.random() > 0.5 ? 271 : 186
        })
      }

      // Draw Stars
      for (const s of stars) {
        s.a += s.twinkleSpeed
        const alpha = 0.4 + 0.6 * (0.5 + 0.5 * Math.sin(s.a))
        ctx.beginPath()
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255,255,255,${alpha})`
        ctx.shadowBlur = s.r > 1.2 ? 6 : 0
        ctx.shadowColor = 'rgba(255,255,255,0.9)'
        ctx.fill()
      }

      // Draw Shooting Stars
      for (let i = shootingStars.length - 1; i >= 0; i--) {
        const ss = shootingStars[i]
        ss.x += ss.speedX
        ss.y += ss.speedY
        ss.life -= ss.decay

        if (ss.life <= 0) {
          shootingStars.splice(i, 1)
          continue
        }

        ctx.beginPath()
        const grad = ctx.createLinearGradient(ss.x, ss.y, ss.x - ss.length, ss.y - ss.length)
        grad.addColorStop(0, `hsla(${ss.hue}, 100%, 80%, ${ss.life})`)
        grad.addColorStop(1, `hsla(${ss.hue}, 100%, 80%, 0)`)
        
        ctx.strokeStyle = grad
        ctx.lineWidth = 2
        ctx.lineCap = 'round'
        ctx.moveTo(ss.x, ss.y)
        ctx.lineTo(ss.x - ss.length, ss.y - ss.length)
        ctx.shadowBlur = 10
        ctx.shadowColor = `hsla(${ss.hue}, 100%, 80%, ${ss.life})`
        ctx.stroke()
      }

      // Draw Particles
      for (const p of particles) {
        p.x += p.vx
        p.y += p.vy
        if (p.x < -10) p.x = canvas.width + 10
        if (p.x > canvas.width + 10) p.x = -10
        if (p.y < -10) p.y = canvas.height + 10
        if (p.y > canvas.height + 10) p.y = -10

        ctx.beginPath()
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 4)
        grad.addColorStop(0,   `hsla(${p.hue},80%,65%,${p.a})`)
        grad.addColorStop(1,   `hsla(${p.hue},80%,65%,0)`)
        ctx.arc(p.x, p.y, p.r * 4, 0, Math.PI * 2)
        ctx.fillStyle = grad
        ctx.shadowBlur = 12
        ctx.shadowColor = `hsla(${p.hue},80%,65%,0.6)`
        ctx.fill()
      }

      ctx.shadowBlur = 0
      raf = requestAnimationFrame(draw)
    }

    draw()
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return <canvas ref={canvasRef} id="star-canvas" />
}
