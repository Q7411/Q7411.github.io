import { defineConfig } from 'vitepress'

export default defineConfig({
  base: '/CTF-Reverse/',
  title: "Q7411's Blog",
  description: "CTF 与逆向工程学习记录",
  themeConfig: {
    siteTitle: 'Q7411 | CTF-Reverse',
    search: {
      provider: 'local'
    },
    nav: [
      { text: '🏠 首页', link: '/' },
      { text: '📝 博客文章', link: '/posts/first-post' },
      { text: '🙋‍♂️ 关于我', link: '/about' }
    ],
    sidebar: [
      {
        text: '🎯 逆向工程 (Reverse)',
        items: [
          { text: '第一篇文章', link: '/posts/first-post' },
          { text: 'BASE64 加密原理与逆向', link: '/CTF-Reverse/BASE64' }
        ]
      }
    ],
    socialLinks: [
      { icon: 'github', link: 'https://github.com/Q7411/CTF-Reverse' }
    ],
    footer: {
      message: '探索二进制的奥秘',
      copyright: 'Copyright © 2024-present Q7411'
    },
    outline: {
      label: '页面导航',
      level: [2, 3]
    }
  }
})
