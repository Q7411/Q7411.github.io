<script setup>
import { onMounted, ref, onUnmounted } from 'vue'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const heroRef = ref(null)
const videoRef = ref(null)
const contentRef = ref(null)
const featuresRef = ref(null)
const skillsRef = ref(null)
const postsRef = ref(null)
const ctaRef = ref(null)
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

    // 技能标签入场动画
    gsap.fromTo('.skill-tag',
      { opacity: 0, scale: 0.8, y: 20 },
      {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.05,
        ease: 'back.out(1.5)',
        scrollTrigger: {
          trigger: skillsRef.value,
          start: 'top 80%',
          toggleActions: 'play none none reverse'
        }
      }
    )

    // 最新文章卡片入场动画
    gsap.fromTo('.post-card',
      { opacity: 0, x: -50 },
      {
        opacity: 1,
        x: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: postsRef.value,
          start: 'top 80%',
          toggleActions: 'play none none reverse'
        }
      }
    )

    // CTA 区域入场动画
    gsap.fromTo('.cta-content',
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power4.out',
        scrollTrigger: {
          trigger: ctaRef.value,
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

const skills = [
  '逆向工程 (Reverse)', '二进制安全 (Pwn)', 'Web 安全渗透', '密码学 (Crypto)',
  '汇编语言 (Assembly)', 'Python', 'C / C++', 'Vue 3 & Vite', 'GSAP 动效', 'UI/UX 设计'
]

const recentPosts = [
  {
    title: 'BASE64 加密原理与逆向',
    excerpt: '计算机以 8 位（bit）为一个字节，而 Base64 以 6 位为一个单元，探索其变表、魔改运算及爆破细节...',
    date: '2024-04-02',
    link: '/CTF-Reverse/BASE64',
    category: 'CTF-Reverse'
  },
  {
    title: '我的第一篇博客文章',
    excerpt: '记录技术成长，分享开发经验与安全研究的心得体会...',
    date: '2024-04-01',
    link: '/posts/first-post',
    category: '随笔'
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

    <!-- Skills Section -->
    <section ref="skillsRef" class="skills-section">
      <h2 class="section-title">Core Skills</h2>
      <div class="skills-container">
        <span 
          v-for="(skill, index) in skills" 
          :key="index"
          class="skill-tag gpu-accel"
        >
          {{ skill }}
        </span>
      </div>
    </section>

    <!-- Recent Posts Section -->
    <section ref="postsRef" class="posts-section">
      <h2 class="section-title">Recent Discoveries</h2>
      <div class="posts-grid">
        <a 
          v-for="(post, index) in recentPosts" 
          :key="index" 
          :href="post.link" 
          class="post-card glass-card gpu-accel"
        >
          <div class="post-meta">
            <span class="post-category">{{ post.category }}</span>
            <span class="post-date">{{ post.date }}</span>
          </div>
          <h3 class="post-title">{{ post.title }}</h3>
          <p class="post-excerpt">{{ post.excerpt }}</p>
          <div class="post-read-more">阅读全文 ➔</div>
        </a>
      </div>
    </section>

    <!-- CTA Section -->
    <section ref="ctaRef" class="cta-section">
      <div class="cta-content glass-card gpu-accel">
        <h2 class="cta-title">准备好探索二进制的奥秘了吗？</h2>
        <p class="cta-desc">跟随我一起深入 CTF 与逆向工程的世界，掌握底层安全技术。</p>
        <a href="/CTF-Reverse/BASE64" class="btn btn-primary cta-btn">开启极客之旅</a>
      </div>
    </section>
  </div>
</template>

<style scoped>
.modern-home {
  width: 100%;
  background-color: #0A0A0B; /* Force dark background */
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
  background: rgba(18, 18, 20, 0.6) !important;
  border: 1px solid rgba(255, 255, 255, 0.08) !important;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.2) !important;
}

.feature-card:hover {
  transform: translateY(-10px) scale(1.02) !important;
  border-color: rgba(212, 175, 55, 0.5) !important;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4), 0 0 40px rgba(212, 175, 55, 0.15) inset !important;
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

/* Section Title */
.section-title {
  text-align: center;
  font-size: clamp(2rem, 5vw, 3rem);
  font-weight: 800;
  margin-bottom: 60px;
  color: #fff;
  letter-spacing: -0.02em;
  background: linear-gradient(135deg, #fff 50%, rgba(255,255,255,0.4));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

/* Skills Section */
.skills-section {
  padding: 80px 24px;
  max-width: 1000px;
  margin: 0 auto;
}

.skills-container {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  justify-content: center;
}

.skill-tag {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 12px 24px;
  border-radius: 100px;
  font-size: 1rem;
  font-weight: 600;
  color: #fff;
  transition: all 0.3s ease;
  cursor: default;
}

.skill-tag:hover {
  background: var(--vp-c-brand-1);
  color: #0A0A0B;
  transform: translateY(-3px) scale(1.05);
  box-shadow: 0 10px 20px rgba(212, 175, 55, 0.3);
}

/* Recent Posts Section */
.posts-section {
  padding: 80px 24px;
  max-width: 1280px;
  margin: 0 auto;
}

.posts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 32px;
}

.post-card {
  display: block;
  text-decoration: none;
  padding: 40px 32px;
  border-radius: 20px;
  transition: all 0.5s cubic-bezier(0.2, 0.8, 0.2, 1);
  background: rgba(18, 18, 20, 0.4) !important;
  border: 1px solid rgba(255, 255, 255, 0.05) !important;
}

.post-card:hover {
  transform: translateY(-8px) !important;
  border-color: rgba(212, 175, 55, 0.3) !important;
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.5) !important;
}

.post-meta {
  display: flex;
  justify-content: space-between;
  font-size: 0.85rem;
  margin-bottom: 16px;
  color: rgba(255, 255, 255, 0.5);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.post-category {
  color: var(--vp-c-brand-1);
  font-weight: 600;
}

.post-title {
  font-size: 1.4rem;
  font-weight: 700;
  color: #fff;
  margin-bottom: 12px;
  line-height: 1.4;
  transition: color 0.3s ease;
}

.post-card:hover .post-title {
  color: var(--vp-c-brand-1);
}

.post-excerpt {
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.6);
  line-height: 1.6;
  margin-bottom: 24px;
}

.post-read-more {
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--vp-c-brand-1);
  display: flex;
  align-items: center;
  gap: 8px;
}

/* CTA Section */
.cta-section {
  padding: 100px 24px 160px;
  max-width: 900px;
  margin: 0 auto;
}

.cta-content {
  text-align: center;
  padding: 80px 40px;
  border-radius: 32px;
  background: linear-gradient(145deg, rgba(20, 20, 22, 0.8), rgba(10, 10, 11, 0.9)) !important;
  border: 1px solid rgba(212, 175, 55, 0.2) !important;
  box-shadow: 0 30px 60px rgba(0, 0, 0, 0.6), 0 0 80px rgba(212, 175, 55, 0.1) inset !important;
}

.cta-title {
  font-size: clamp(2rem, 4vw, 2.5rem);
  font-weight: 800;
  color: #fff;
  margin-bottom: 20px;
}

.cta-desc {
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 40px;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.cta-btn {
  font-size: 1.2rem;
  padding: 18px 48px;
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