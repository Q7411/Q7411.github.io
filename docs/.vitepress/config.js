import { defineConfig } from 'vitepress'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  vite: {
    plugins: [
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['favicon.ico', 'robots.txt', 'apple-touch-icon.png'],
        manifest: {
          name: "Q7411's Blog",
          short_name: 'Q7411',
          description: 'CTF 与逆向工程学习记录',
          theme_color: '#0A0A0B',
          background_color: '#0A0A0B',
          icons: [
            {
              src: '/pwa-192x192.png',
              sizes: '192x192',
              type: 'image/png'
            },
            {
              src: '/pwa-512x512.png',
              sizes: '512x512',
              type: 'image/png'
            }
          ]
        }
      })
    ]
  },
  base: '/',
  title: "Q7411's Blog",
  description: "CTF 与逆向工程学习记录",
  head: [
    ['link', { rel: 'icon', href: '/favicon.ico' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.googleapis.com' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' }],
    ['link', { href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Fira+Code:wght@400;500;600&display=swap', rel: 'stylesheet' }]
  ],
  markdown: {
    image: {
      // 开启图片懒加载
      lazyLoading: true
    },
    lineNumbers: true // 开启代码行号
  },
  themeConfig: {
    siteTitle: 'Q7411 | CTF-Reverse',
    logo: null, // 可以配置一个 Logo
    search: {
      provider: 'local',
      options: {
        translations: {
          button: {
            buttonText: '搜索文档',
            buttonAriaLabel: '搜索文档'
          },
          modal: {
            noResultsText: '无法找到相关结果',
            resetButtonTitle: '清除查询条件',
            footer: {
              selectText: '选择',
              navigateText: '切换',
              closeText: '关闭'
            }
          }
        }
      }
    },
    nav: [
      { text: '🏠 首页', link: '/' },
      { text: '📝 博客文章', link: '/posts/first-post', activeMatch: '/posts/' },
      { text: '🎯 逆向工程', link: '/CTF-Reverse/BASE64', activeMatch: '/CTF-Reverse/' },
      { text: '🏷️ 标签云', link: '/tags' },
      { text: '🙋‍♂️ 关于我', link: '/about' }
    ],
    sidebar: {
      '/posts/': [
        {
          text: '🚀 最新文章',
          collapsed: false,
          items: [
            { text: '第一篇文章', link: '/posts/first-post' }
          ]
        },
        {
          text: '🏷️ 快速导航',
          collapsed: false,
          items: [
            { text: '标签云', link: '/tags' }
          ]
        }
      ],
      '/CTF-Reverse/': [
        {
          text: '🎯 逆向工程 (Reverse)',
          collapsed: false,
          items: [
            { text: 'BASE64 加密原理与逆向', link: '/CTF-Reverse/BASE64' }
          ]
        },
        {
          text: '🏷️ 快速导航',
          collapsed: false,
          items: [
            { text: '标签云', link: '/tags' }
          ]
        }
      ]
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/Q7411/CTF-Reverse' }
    ],
    footer: {
      message: '探索二进制的奥秘 | 基于 VitePress 构建',
      copyright: 'Copyright © 2024-present Q7411'
    },
    outline: {
      label: '📖 页面导航',
      level: [2, 3]
    },
    docFooter: {
      prev: '上一篇',
      next: '下一篇'
    },
    returnToTopLabel: '回到顶部',
    sidebarMenuLabel: '菜单',
    darkModeSwitchLabel: '主题',
    lightModeSwitchTitle: '切换到浅色模式',
    darkModeSwitchTitle: '切换到深色模式'
  }
})
