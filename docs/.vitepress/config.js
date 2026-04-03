import { defineConfig } from 'vitepress'

export default defineConfig({
  base: '/CTF-Reverse/',
  title: "我的博客",
  description: "基于 VitePress 构建的个人博客",
  themeConfig: {
    nav: [
      { text: '首页', link: '/' },
      { text: '关于', link: '/about' }
    ],
    sidebar: [
      {
        text: '博客文章',
        items: [
          { text: '第一篇文章', link: '/posts/first-post' }
        ]
      }
    ],
    socialLinks: [
      { icon: 'github', link: 'https://github.com/your-username' }
    ]
  }
})
