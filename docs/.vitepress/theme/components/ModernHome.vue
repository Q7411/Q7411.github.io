<script setup>
import { onMounted, ref, onUnmounted } from 'vue'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const heroRef = ref(null)
const videoRef = ref(null)
const contentRef = ref(null)
const featuresRef = ref(null)
let ctx

onMounted(() => {
  // 确保视频内联播放
  if (videoRef.value) {
    videoRef.value.play().catch(e => console.log('Auto-play prevented:', e))
  }

  // GSAP 视差动画
  ctx = gsap.context(() => {
    // 英雄区视频视差滚动
    gsap.to('.hero-video', {
      yPercent: 30,
      ease: 'none',
      scrollTrigger: {
        trigger: heroRef.value,
        start: 'top top',
        end: 'bottom top',
        scrub: true
      }
    })

    // 标题入场动画
    gsap.fromTo('.hero-title', 
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 1.2, ease: 'power4.out', delay: 0.2 }
    )
    gsap.fromTo('.hero-subtitle', 
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 1, ease: 'power3.out', delay: 0.5 }
    )
    gsap.fromTo('.hero-actions', 
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out', delay: 0.8 }
    )

    // 特性卡片视差滚动与错开入场
    gsap.fromTo('.feature-card', 
      { opacity: 0, y: 80, scale: 0.95 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.8,
        stagger: 0.15,
        ease: 'back.out(1.2)',
        scrollTrigger: {
          trigger: featuresRef.value,
          start: 'top 85%',
          toggleActions: 'play none none reverse'
        }
      }
    )
  })
})

onUnmounted(() => {
  if (ctx) ctx.revert()
})

const features = [
  {
    title: '4K Ultra HD',
    desc: '原生支持 4K 级超清素材，为 120Hz 高刷屏提供极致丝滑的微交互体验。',
    icon: `<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="15" rx="2" ry="2"></rect><polyline points="17 2 12 7 7 2"></polyline></svg>`
  },
  {
    title: 'Glassmorphism',
    desc: '引入前沿玻璃拟态设计语言，配合光影渲染，带来深邃沉浸的视觉空间。',
    icon: `<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>`
  },
  {
    title: 'Performance',
    desc: 'Lighthouse 95+ 评分，CLS <0.05，FID <50ms，性能优化无处不在。',
    icon: `<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v20"></path><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>`
  }
]
</script>

<template>
  <div class="modern-home">
    <!-- Hero Section -->
    <section ref="heroRef" class="hero-section">
      <div class="video-container">
        <!-- 占位 4K 视频，这里用一个公开免费的超高清短视频演示 -->
        <video 
          ref="videoRef"
          class="hero-video gpu-accel" 
          autoplay 
          loop 
          muted 
          playsinline
          poster="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop"
        >
          <!-- WebM 格式优先 -->
          <source src="https://cdn.pixabay.com/video/2023/10/22/186115-877114413_large.mp4" type="video/mp4" />
        </video>
        <div class="video-overlay"></div>
      </div>

      <div ref="contentRef" class="hero-content">
        <h1 class="hero-title gpu-accel">
          <span class="gradient-text">极简主义</span><br/>
          探索未来视界
        </h1>
        <p class="hero-subtitle gpu-accel">
          结合深色渐变、玻璃拟态与 3D 视差滚动，为您呈现 4K 级 120Hz 丝滑体验。
        </p>
        <div class="hero-actions gpu-accel">
          <a href="/posts/first-post" class="btn btn-primary">开始探索</a>
          <a href="/about" class="btn btn-secondary">关于我们</a>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section ref="featuresRef" class="features-section">
      <div class="features-grid">
        <div 
          v-for="(feat, index) in features" 
          :key="index"
          class="feature-card glass-card gpu-accel"
        >
          <div class="icon-wrapper" v-html="feat.icon"></div>
          <h3 class="feature-title">{{ feat.title }}</h3>
          <p class="feature-desc">{{ feat.desc }}</p>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.modern-home {
  width: 100%;
  background-color: var(--vp-c-bg);
  color: #fff;
  overflow: hidden;
}

/* Hero Section */
.hero-section {
  position: relative;
  height: 100vh;
  min-height: 800px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.video-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
}

.hero-video {
  width: 100%;
  height: 120%; /* 留出视差滚动空间 */
  object-fit: cover;
  position: absolute;
  top: -10%;
  left: 0;
}

.video-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    to bottom,
    rgba(10, 10, 11, 0.4) 0%,
    rgba(10, 10, 11, 0.8) 70%,
    rgba(10, 10, 11, 1) 100%
  );
  z-index: 1;
}

.hero-content {
  position: relative;
  z-index: 2;
  text-align: center;
  max-width: 900px;
  padding: 0 24px;
}

.hero-title {
  font-family: var(--vp-font-family-base);
  font-size: clamp(3.5rem, 8vw, 6rem);
  font-weight: 800;
  line-height: 1.1;
  letter-spacing: -0.04em;
  margin-bottom: 24px;
  color: #fff;
}

.gradient-text {
  background: linear-gradient(135deg, #fff 30%, var(--vp-c-brand-1) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 0 0 60px rgba(212, 175, 55, 0.3);
}

.hero-subtitle {
  font-size: clamp(1.2rem, 3vw, 1.5rem);
  color: rgba(255, 255, 255, 0.7);
  max-width: 600px;
  margin: 0 auto 48px;
  line-height: 1.6;
}

.hero-actions {
  display: flex;
  gap: 20px;
  justify-content: center;
  flex-wrap: wrap;
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 16px 40px;
  border-radius: 100px;
  font-weight: 600;
  font-size: 1.1rem;
  text-decoration: none;
  transition: all 0.4s cubic-bezier(0.2, 0.8, 0.2, 1);
}

.btn-primary {
  background-color: var(--vp-c-brand-1);
  color: #0A0A0B;
  box-shadow: 0 0 20px rgba(212, 175, 55, 0.4);
}

.btn-primary:hover {
  background-color: var(--vp-c-brand-2);
  transform: translateY(-4px) scale(1.02);
  box-shadow: 0 10px 30px rgba(212, 175, 55, 0.6);
}

.btn-secondary {
  background-color: rgba(255, 255, 255, 0.1);
  color: #fff;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.btn-secondary:hover {
  background-color: rgba(255, 255, 255, 0.2);
  transform: translateY(-4px);
}

/* Features Section */
.features-section {
  position: relative;
  padding: 120px 24px;
  max-width: 1280px;
  margin: 0 auto;
  z-index: 2;
  margin-top: -100px; /* Overlap with hero slightly */
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 32px;
}

.feature-card {
  padding: 48px 32px;
  border-radius: 24px;
  transition: all 0.5s cubic-bezier(0.2, 0.8, 0.2, 1);
}

.feature-card:hover {
  transform: translateY(-10px) scale(1.02) !important;
  border-color: rgba(212, 175, 55, 0.5);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4), 0 0 40px rgba(212, 175, 55, 0.15) inset;
}

.icon-wrapper {
  color: var(--vp-c-brand-1);
  margin-bottom: 24px;
  transition: transform 0.5s ease;
}

.feature-card:hover .icon-wrapper {
  transform: scale(1.1);
}

.feature-title {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 16px;
  color: #fff;
  letter-spacing: -0.02em;
}

.feature-desc {
  font-size: 1.05rem;
  line-height: 1.7;
  color: rgba(255, 255, 255, 0.6);
}

/* Responsive */
@media (max-width: 768px) {
  .features-section {
    padding: 60px 24px;
    margin-top: 0;
  }
  .btn {
    width: 100%;
  }
}
</style>