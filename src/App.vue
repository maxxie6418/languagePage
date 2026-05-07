<template>
  <div id="app" :class="{ 'practice-mode': isPracticeMode }">
    <header v-if="!isPracticeMode" class="main-header">
      <div class="header-content">
        <div class="logo">
          <router-link to="/">📚 英语学习平台</router-link>
        </div>
        <nav class="main-nav">
          <router-link to="/basics" class="nav-link">英语基础</router-link>
          <router-link to="/exam" class="nav-link">考研应用</router-link>
          <router-link to="/practice" class="nav-link">试题中心</router-link>
          <router-link to="/user" class="nav-link">我的学习</router-link>
        </nav>
      </div>
    </header>
    
    <main :class="{ 'main-content': !isPracticeMode, 'practice-content': isPracticeMode }">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const isPracticeMode = computed(() => route.path.startsWith('/practice') || route.path.startsWith('/test'))
</script>

<style>
:root {
  --primary-color: #1e3a5f;
  --secondary-color: #d4a84b;
  --bg-color: #faf9f7;
  --text-color: #333;
  --border-color: #e5e3df;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background-color: var(--bg-color);
  color: var(--text-color);
  line-height: 1.6;
}

#app {
  min-height: 100vh;
}

/* 头部样式 */
.main-header {
  background: white;
  border-bottom: 1px solid var(--border-color);
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 64px;
}

.logo a {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--primary-color);
  text-decoration: none;
}

.main-nav {
  display: flex;
  gap: 32px;
}

.nav-link {
  color: var(--text-color);
  text-decoration: none;
  padding: 8px 0;
  position: relative;
  transition: color 0.2s;
}

.nav-link:hover {
  color: var(--primary-color);
}

.nav-link.router-link-active {
  color: var(--primary-color);
}

.nav-link.router-link-active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: var(--primary-color);
}

/* 内容区域 */
.main-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 32px 24px;
}

.practice-content {
  max-width: 800px;
  margin: 0 auto;
  padding: 24px;
}

/* 试题模式 */
.practice-mode .main-header {
  display: none;
}

.practice-mode #app {
  background: #f5f5f5;
}

/* 通用卡片 */
.card {
  background: white;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.card-title {
  font-size: 1.25rem;
  color: var(--primary-color);
  margin-bottom: 16px;
}

/* 按钮样式 */
.btn {
  display: inline-block;
  padding: 10px 20px;
  border-radius: 6px;
  text-decoration: none;
  font-size: 0.95rem;
  cursor: pointer;
  border: none;
  transition: all 0.2s;
}

.btn-primary {
  background: var(--primary-color);
  color: white;
}

.btn-primary:hover {
  background: #152d4a;
}

.btn-secondary {
  background: white;
  color: var(--primary-color);
  border: 1px solid var(--primary-color);
}

.btn-secondary:hover {
  background: #f0f4f8;
}

/* 链接样式 */
a {
  color: var(--primary-color);
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}

/* 高亮标记 */
.highlight {
  background: linear-gradient(120deg, #ffeaa7 0%, #ffeaa7 100%);
  padding: 0 4px;
  border-radius: 2px;
}

/* 代码块 */
code {
  background: #f4f4f4;
  padding: 2px 6px;
  border-radius: 3px;
  font-family: 'SF Mono', Consolas, monospace;
  font-size: 0.9em;
}

/* 语法高亮 */
.grammar-tree {
  border-left: 3px solid var(--secondary-color);
  padding-left: 16px;
}

/* 词根卡片 */
.word-family {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
}

.word-family-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.word-root {
  font-size: 1.5rem;
  font-weight: bold;
  color: var(--primary-color);
  font-family: 'Times New Roman', serif;
}

.word-meaning {
  color: #666;
}

/* 单词条目 */
.word-item {
  padding: 12px;
  background: white;
  border-radius: 6px;
  margin-bottom: 8px;
}

.word-item:last-child {
  margin-bottom: 0;
}

.word-name {
  font-weight: 600;
  color: var(--primary-color);
  margin-right: 8px;
}

.word-translation {
  color: #555;
}

.word-example {
  margin-top: 8px;
  padding: 8px;
  background: #f8f9fa;
  border-radius: 4px;
  font-style: italic;
  color: #666;
  font-size: 0.9rem;
}

.word-freq {
  display: inline-block;
  font-size: 0.75rem;
  padding: 2px 6px;
  border-radius: 3px;
  margin-left: 8px;
}

.word-freq.high {
  background: #ffe6e6;
  color: #c0392b;
}

.word-freq.medium {
  background: #fff3e6;
  color: #e67e22;
}

.word-freq.low {
  background: #e8f5e9;
  color: #27ae60;
}
</style>
