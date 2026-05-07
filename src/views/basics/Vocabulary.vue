<template>
  <div class="vocabulary-page">
    <div class="page-header">
      <h1>词汇基础</h1>
      <p class="subtitle">词根词缀 + 核心词汇 + 搭配用法，建立科学的词汇体系</p>
    </div>

    <div class="search-box">
      <input 
        v-model="searchQuery" 
        type="text" 
        placeholder="搜索词根（如：spect, duct, vert）..."
        class="search-input"
      />
    </div>

    <div class="roots-nav">
      <button 
        v-for="root in filteredRoots" 
        :key="root"
        @click="selectedRoot = root"
        class="root-btn"
        :class="{ active: selectedRoot === root }"
      >
        {{ root }}
      </button>
    </div>

    <div v-if="selectedFamily" class="word-family-detail">
      <div class="family-header">
        <div class="family-root">
          <span class="root-word">{{ selectedFamily.root }}</span>
          <span class="root-meaning">{{ selectedFamily.meaning }}</span>
          <span class="root-origin">{{ selectedFamily.origin }}</span>
        </div>
        <div class="family-stats">
          共 {{ selectedFamily.words.length }} 个派生词
        </div>
      </div>

      <div class="words-grid">
        <div v-for="word in selectedFamily.words" :key="word.word" class="word-card">
          <div class="word-header">
            <span class="word">{{ word.word }}</span>
            <span class="freq-tag" :class="word.examFreq">{{ word.examFreq }}频</span>
          </div>
          <div class="meaning">{{ word.meaning }}</div>
          <div class="example">{{ word.usage }}</div>
        </div>
      </div>

      <div class="family-note card">
        <h3>💡 学习提示</h3>
        <p>掌握词根 <strong>{{ selectedFamily.root }}</strong> 后，你可以轻松识别和记忆 {{ selectedFamily.words.length }}+ 个派生词汇。例如：</p>
        <ul>
          <li>看到 <strong>spec/t/</strong> 开头的词，就知道与"看"有关</li>
          <li>前缀 <strong>ex-</strong> = 向外，<strong>pro-</strong> = 向前，<strong>retro-</strong> = 向后</li>
          <li>后缀 <strong>-or</strong> = 人/物，<strong>-tion</strong> = 名词化</li>
        </ul>
      </div>
    </div>

    <div v-else class="empty-state">
      <p>👈 从上方选择一个词根开始学习</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'

const roots = ref([])
const selectedRoot = ref('')
const searchQuery = ref('')
const selectedFamily = ref(null)

const filteredRoots = computed(() => {
  if (!searchQuery.value) return roots.value
  return roots.value.filter(r => 
    r.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

const loadRoots = async () => {
  try {
    const res = await axios.get('/api/basics/vocabulary/roots')
    roots.value = res.data.roots.map(r => r.root)
    if (roots.value.length > 0) {
      selectedRoot.value = roots.value[0]
    }
  } catch (err) {
    console.error('Failed to load roots:', err)
  }
}

const loadFamily = async (root) => {
  try {
    const res = await axios.get(`/api/basics/vocabulary/${root}`)
    selectedFamily.value = res.data
  } catch (err) {
    console.error('Failed to load family:', err)
  }
}

onMounted(async () => {
  await loadRoots()
  if (selectedRoot.value) {
    await loadFamily(selectedRoot.value)
  }
})

// 监听选择变化
import { watch } from 'vue'
watch(selectedRoot, (newRoot) => {
  if (newRoot) {
    loadFamily(newRoot)
  }
})
</script>

<style scoped>
.vocabulary-page {
  max-width: 1000px;
  margin: 0 auto;
}

.page-header {
  margin-bottom: 24px;
}

.page-header h1 {
  font-size: 2rem;
  color: var(--primary-color);
  margin-bottom: 8px;
}

.subtitle {
  color: #666;
  font-size: 1.1rem;
}

.search-box {
  margin-bottom: 16px;
}

.search-input {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid var(--border-color);
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.2s;
}

.search-input:focus {
  outline: none;
  border-color: var(--primary-color);
}

.roots-nav {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--border-color);
}

.root-btn {
  padding: 8px 16px;
  background: white;
  border: 1px solid var(--border-color);
  border-radius: 20px;
  cursor: pointer;
  font-family: 'Times New Roman', serif;
  font-weight: 600;
  color: var(--primary-color);
  transition: all 0.2s;
}

.root-btn:hover {
  background: #f0f4f8;
}

.root-btn.active {
  background: var(--primary-color);
  color: white;
  border-color: var(--primary-color);
}

.family-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background: linear-gradient(135deg, var(--primary-color) 0%, #2c5282 100%);
  border-radius: 12px;
  color: white;
  margin-bottom: 24px;
}

.family-root {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.root-word {
  font-size: 2rem;
  font-family: 'Times New Roman', serif;
  font-weight: bold;
}

.root-meaning {
  font-size: 1.1rem;
}

.root-origin {
  font-size: 0.9rem;
  opacity: 0.8;
}

.family-stats {
  background: rgba(255,255,255,0.2);
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 0.9rem;
}

.words-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
}

.word-card {
  background: white;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  transition: transform 0.2s;
}

.word-card:hover {
  transform: translateY(-2px);
}

.word-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.word {
  font-weight: 600;
  font-size: 1.2rem;
  color: var(--primary-color);
}

.freq-tag {
  font-size: 0.75rem;
  padding: 2px 8px;
  border-radius: 10px;
}

.freq-tag.高 {
  background: #ffe6e6;
  color: #c0392b;
}

.freq-tag.中 {
  background: #fff3e6;
  color: #e67e22;
}

.freq-tag.低 {
  background: #e8f5e9;
  color: #27ae60;
}

.meaning {
  color: #555;
  margin-bottom: 8px;
}

.example {
  font-style: italic;
  color: #888;
  font-size: 0.9rem;
  padding: 8px;
  background: #f8f9fa;
  border-radius: 4px;
}

.family-note {
  margin-top: 24px;
}

.family-note h3 {
  color: var(--primary-color);
  margin-bottom: 12px;
}

.family-note ul {
  margin-top: 12px;
  padding-left: 20px;
}

.family-note li {
  margin-bottom: 8px;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #888;
}
</style>
