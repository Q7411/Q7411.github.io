<template>
  <div class="share-wrapper" v-if="showShare">
    <div class="share-title">如果觉得有帮助，不妨分享给朋友：</div>
    <div class="share-buttons">
      <button @click="share('twitter')" class="share-btn twitter" title="分享到 Twitter">
        <svg viewBox="0 0 24 24" width="16" height="16"><path fill="currentColor" d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
        Twitter
      </button>
      <button @click="share('facebook')" class="share-btn facebook" title="分享到 Facebook">
        <svg viewBox="0 0 24 24" width="16" height="16"><path fill="currentColor" d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
        Facebook
      </button>
      <button @click="share('weibo')" class="share-btn weibo" title="分享到 Weibo">
        <svg viewBox="0 0 24 24" width="16" height="16"><path fill="currentColor" d="M10.117 18.665c-4.482 0-7.838-2.22-7.838-4.887 0-2.483 3.018-4.444 6.945-4.444 3.735 0 6.645 1.776 6.645 4.148 0 2.645-3.033 5.183-5.752 5.183zm-1.802-2.316c1.603.228 3.167-.406 3.473-1.436.311-1.042-.72-2.083-2.325-2.311-1.604-.228-3.168.406-3.474 1.436-.312 1.042.72 2.083 2.326 2.311zm-1.127-1.124c.484.053.948-.158 1.026-.474.077-.306-.231-.634-.707-.687-.476-.053-.948.158-1.026.474-.077.306.231.634.707.687zm8.398-9.082c-.896 0-1.802.261-2.617.766-.632.39-1.258.948-1.83 1.604-.378.435-.744.912-1.077 1.428-1.045.023-2.155.228-3.236.634C2.39 12.096 0 14.503 0 16.417c0 2.872 4.417 5.568 9.771 5.568 5.766 0 9.873-3.035 9.873-6.526 0-1.325-.568-2.527-1.54-3.513 1.106-1.515 1.62-2.906 1.62-4.015 0-1.107-.464-1.787-1.353-1.787zm4.35-3.666c-1.312-1.218-3.322-1.523-5.46-.838-.456.145-.698.634-.553 1.09.145.456.634.698 1.09.553 1.488-.474 2.872-.25 3.774.587.9.838 1.134 2.213.627 3.73-.174.583.155 1.206.738 1.38.583.174 1.206-.155 1.38-.738.73-2.146.4-4.22-1.596-5.764zm-2.072 2.14c-.694-.658-1.758-.823-2.887-.45-.436.145-.668.618-.523 1.054.145.436.618.668 1.054.523.587-.189 1.127-.101 1.488.232.35.326.444.863.24 1.464-.152.428.082.906.51.106.428-.152.906-.082.51.106-.777-.384-1.545-2.26-1.077-2.03zm0 0"/></svg>
        Weibo
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vitepress'

const route = useRoute()

// 仅在文章页显示分享按钮
const showShare = computed(() => {
  return route.path.includes('/posts/') || route.path.includes('/CTF-Reverse/')
})

const share = (platform) => {
  const url = encodeURIComponent(window.location.origin + route.path)
  const title = encodeURIComponent(document.title)
  let shareUrl = ''
  
  switch (platform) {
    case 'twitter':
      shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${title}`
      break
    case 'facebook':
      shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`
      break
    case 'weibo':
      shareUrl = `http://service.weibo.com/share/share.php?url=${url}&title=${title}`
      break
  }
  
  window.open(shareUrl, '_blank', 'width=600,height=400,toolbar=no,menubar=no,scrollbars=no')
}
</script>

<style scoped>
.share-wrapper {
  margin-top: 4rem;
  padding-top: 1.5rem;
  border-top: 1px dashed var(--vp-c-divider);
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.share-title {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--vp-c-text-2);
}

.share-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.share-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  background-color: var(--vp-c-bg-alt);
  border: 1px solid var(--vp-c-divider);
  color: var(--vp-c-text-1);
  transition: all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);
}

.share-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.dark .share-btn:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
}

.twitter:hover {
  background-color: #1DA1F2;
  border-color: #1DA1F2;
  color: white;
}

.facebook:hover {
  background-color: #4267B2;
  border-color: #4267B2;
  color: white;
}

.weibo:hover {
  background-color: #E6162D;
  border-color: #E6162D;
  color: white;
}
</style>
