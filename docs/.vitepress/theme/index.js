import DefaultTheme from 'vitepress/theme'
import { onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vitepress'
import './custom.css'

export default {
  extends: DefaultTheme,
  setup() {
    const router = useRouter()

    onMounted(() => {
      // 移动端及性能降级模式下不执行 JS 动画
      if (window.matchMedia('(max-width: 768px)').matches || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return;
      }

      // 1. 视差滚动动画（背景与前景以不同速度移动）
      let ticking = false;
      const handleScroll = () => {
        if (!ticking) {
          window.requestAnimationFrame(() => {
            const scrolled = window.scrollY;
            const heroImageBg = document.querySelector('.VPHero .image-bg');
            if (heroImageBg) {
              // 背景图片轻微下移形成视差
              heroImageBg.style.transform = `translateY(${scrolled * 0.4}px)`;
            }
            ticking = false;
          });
          ticking = true;
        }
      };
      window.addEventListener('scroll', handleScroll, { passive: true });

      // 2. 首页文字逐字淡入动画 (持续 1.5 秒，仅执行一次)
      const initTextAnimation = () => {
        // VitePress 的名字部分通常包含一个 .clip 以应用渐变色
        const nameEl = document.querySelector('.VPHero .name .clip') || document.querySelector('.VPHero .name');
        if (nameEl && !nameEl.classList.contains('animated')) {
          const text = nameEl.innerText;
          nameEl.innerHTML = '';
          [...text].forEach((char, index) => {
            const span = document.createElement('span');
            span.textContent = char === ' ' ? '\u00A0' : char;
            span.className = 'char-fade-in';
            // 逐字延迟计算，确保总耗时约为 1.5s
            span.style.animationDelay = `${index * (1.5 / text.length)}s`;
            nameEl.appendChild(span);
          });
          nameEl.classList.add('animated');
        }
      };

      // 首次加载触发文字动画
      setTimeout(initTextAnimation, 100);

      // 路由切换回首页时触发文字动画
      router.onAfterRouteChanged = (to) => {
        if (to === '/') {
          setTimeout(initTextAnimation, 100);
        }
      };

      onUnmounted(() => {
        window.removeEventListener('scroll', handleScroll);
      });
    })
  }
}
