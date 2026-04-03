<template>
  <div id="particles-bg" v-show="frontmatter.layout !== 'custom'">
    <canvas ref="canvas"></canvas>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useData } from 'vitepress'

const canvas = ref(null)
const { isDark, frontmatter } = useData()
let ctx = null
let particles = []
let animationFrameId = null
let mouse = { x: null, y: null, radius: 100 }

class Particle {
  constructor(canvasWidth, canvasHeight) {
    this.canvasWidth = canvasWidth
    this.canvasHeight = canvasHeight
    this.x = Math.random() * canvasWidth
    this.y = Math.random() * canvasHeight
    this.size = Math.random() * 2 + 0.5
    this.baseX = this.x
    this.baseY = this.y
    this.density = (Math.random() * 20) + 1
    this.vx = (Math.random() - 0.5) * 0.5
    this.vy = (Math.random() - 0.5) * 0.5
  }

  draw() {
    if (!ctx) return
    // 动态调整粒子颜色
    ctx.fillStyle = isDark.value ? 'rgba(56, 189, 248, 0.8)' : 'rgba(14, 165, 233, 0.6)'
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
    ctx.closePath()
    ctx.fill()
  }

  update() {
    this.x += this.vx
    this.y += this.vy

    // 边界反弹
    if (this.x < 0 || this.x > this.canvasWidth) this.vx *= -1
    if (this.y < 0 || this.y > this.canvasHeight) this.vy *= -1

    // 鼠标交互排斥效果
    if (mouse.x != null && mouse.y != null) {
      let dx = mouse.x - this.x
      let dy = mouse.y - this.y
      let distance = Math.sqrt(dx * dx + dy * dy)
      
      if (distance < mouse.radius) {
        const forceDirectionX = dx / distance
        const forceDirectionY = dy / distance
        const force = (mouse.radius - distance) / mouse.radius
        const directionX = forceDirectionX * force * this.density
        const directionY = forceDirectionY * force * this.density
        
        this.x -= directionX
        this.y -= directionY
      }
    }
    this.draw()
  }
}

const initParticles = () => {
  particles = []
  // 根据屏幕宽度调整粒子数量
  const numberOfParticles = window.innerWidth < 768 ? 40 : 80
  for (let i = 0; i < numberOfParticles; i++) {
    particles.push(new Particle(canvas.value.width, canvas.value.height))
  }
}

const animate = () => {
  if (!ctx || !canvas.value) return
  ctx.clearRect(0, 0, canvas.value.width, canvas.value.height)
  
  for (let i = 0; i < particles.length; i++) {
    particles[i].update()
    
    // 绘制粒子之间的连线
    for (let j = i; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x
      const dy = particles[i].y - particles[j].y
      const distance = Math.sqrt(dx * dx + dy * dy)
      
      if (distance < 120) {
        ctx.beginPath()
        const opacity = 1 - (distance / 120)
        ctx.strokeStyle = isDark.value 
          ? `rgba(56, 189, 248, ${opacity * 0.2})` 
          : `rgba(14, 165, 233, ${opacity * 0.2})`
        ctx.lineWidth = 1
        ctx.moveTo(particles[i].x, particles[i].y)
        ctx.lineTo(particles[j].x, particles[j].y)
        ctx.stroke()
        ctx.closePath()
      }
    }
  }
  animationFrameId = requestAnimationFrame(animate)
}

const handleResize = () => {
  if (!canvas.value) return
  canvas.value.width = window.innerWidth
  canvas.value.height = window.innerHeight
  initParticles()
}

const handleMouseMove = (event) => {
  mouse.x = event.x
  mouse.y = event.y
}

const handleMouseOut = () => {
  mouse.x = null
  mouse.y = null
}

onMounted(() => {
  // 性能降级：移动端或偏好减少动画时不渲染粒子
  if (window.matchMedia('(max-width: 768px)').matches || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return
  }

  if (canvas.value) {
    ctx = canvas.value.getContext('2d')
    canvas.value.width = window.innerWidth
    canvas.value.height = window.innerHeight
    
    initParticles()
    animate()

    window.addEventListener('resize', handleResize)
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseout', handleMouseOut)
  }
})

onUnmounted(() => {
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId)
  }
  window.removeEventListener('resize', handleResize)
  window.removeEventListener('mousemove', handleMouseMove)
  window.removeEventListener('mouseout', handleMouseOut)
})
</script>
