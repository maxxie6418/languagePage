<template>
  <div class="user-progress">
    <div class="page-header">
      <h1>我的学习</h1>
      <p class="subtitle">追踪学习进度，查看错题本</p>
    </div>

    <div class="stats-overview">
      <div class="stat-card">
        <div class="stat-icon">📊</div>
        <div class="stat-content">
          <div class="stat-value">{{ progress.totalAttempts || 0 }}</div>
          <div class="stat-label">总答题数</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">✓</div>
        <div class="stat-content">
          <div class="stat-value">{{ progress.correctCount || 0 }}</div>
          <div class="stat-label">正确数</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">📈</div>
        <div class="stat-content">
          <div class="stat-value">{{ progress.accuracy || 0 }}%</div>
          <div class="stat-label">正确率</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">📝</div>
        <div class="stat-content">
          <div class="stat-value">{{ progress.wrongQuestions?.length || 0 }}</div>
          <div class="stat-label">错题数</div>
        </div>
      </div>
    </div>

    <div class="wrong-questions-section card">
      <h2>📚 错题本</h2>
      <p class="section-desc">这些是你曾经答错的题目，系统会根据你的错题生成个性化练习</p>
      
      <div v-if="wrongQuestions.length > 0" class="wrong-list">
        <div v-for="q in wrongQuestions" :key="q" class="wrong-item">
          <span class="wrong-id">{{ q }}</span>
          <router-link to="/practice/drill" class="btn btn-secondary btn-sm">
            重新练习
          </router-link>
        </div>
      </div>
      <div v-else class="empty-state">
        <p>🎉 暂无错题记录，继续保持！</p>
        <router-link to="/practice/drill" class="btn btn-primary">
          开始刷题
        </router-link>
      </div>
    </div>

    <div class="quick-actions">
      <h2>🚀 快速开始</h2>
      <div class="action-grid">
        <router-link to="/basics/vocabulary" class="action-card">
          <span class="action-icon">📖</span>
          <span class="action-title">词汇学习</span>
          <span class="action-desc">词根词缀记忆法</span>
        </router-link>
        <router-link to="/basics/grammar" class="action-card">
          <span class="action-icon">📝</span>
          <span class="action-title">语法体系</span>
          <span class="action-desc">从简单句到复杂句</span>
        </router-link>
        <router-link to="/practice/drill" class="action-card">
          <span class="action-icon">✍️</span>
          <span class="action-title">专项练习</span>
          <span class="action-desc">按题型强化训练</span>
        </router-link>
        <router-link to="/test/paper" class="action-card">
          <span class="action-icon">📋</span>
          <span class="action-title">真题模考</span>
          <span class="action-desc">全真模拟考试</span>
        </router-link>
      </div>
    </div>

    <div class="reset-section" v-if="progress.totalAttempts > 0">
      <button @click="resetProgress" class="btn btn-outline">
        重置学习进度
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const progress = ref({})
const wrongQuestions = ref([])

const loadProgress = async () => {
  try {
    const res = await axios.get('/api/user/progress')
    progress.value = res.data
    wrongQuestions.value = res.data.wrongQuestions || []
  } catch (err) {
    console.error('Failed to load progress:', err)
  }
}

const resetProgress = async () => {
  if (confirm('确定要重置所有学习进度吗？此操作不可恢复。')) {
    try {
      await axios.post('/api/user/reset')
      await loadProgress()
    } catch (err) {
      console.error('Failed to reset progress:', err)
    }
  }
}

onMounted(() => {
  loadProgress()
})
</script>

<style scoped>
.user-progress {
  max-width: 900px;
  margin: 0 auto;
}

.page-header {
  margin-bottom: 32px;
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

.stats-overview {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 32px;
}

.stat-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
}

.stat-icon {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, var(--primary-color) 0%, #2c5282 100%);
  color: white;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
}

.stat-value {
  font-size: 1.8rem;
  font-weight: bold;
  color: var(--primary-color);
}

.stat-label {
  color: #666;
  font-size: 0.9rem;
}

.wrong-questions-section {
  margin-bottom: 32px;
}

.wrong-questions-section h2 {
  color: var(--primary-color);
  margin-bottom: 8px;
}

.section-desc {
  color: #666;
  margin-bottom: 20px;
}

.wrong-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.wrong-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: #fff3cd;
  border-radius: 8px;
}

.wrong-id {
  font-family: monospace;
  color: #856404;
}

.btn-sm {
  padding: 6px 12px;
  font-size: 0.85rem;
}

.empty-state {
  text-align: center;
  padding: 40px;
  color: #888;
}

.empty-state p {
  margin-bottom: 16px;
  font-size: 1.1rem;
}

.quick-actions h2 {
  color: var(--primary-color);
  margin-bottom: 16px;
}

.action-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

.action-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  text-align: center;
  text-decoration: none;
  transition: all 0.3s;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
}

.action-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0,0,0,0.12);
}

.action-icon {
  font-size: 2.5rem;
  display: block;
  margin-bottom: 12px;
}

.action-title {
  display: block;
  font-weight: 600;
  color: var(--primary-color);
  margin-bottom: 4px;
}

.action-desc {
  display: block;
  font-size: 0.85rem;
  color: #888;
}

.reset-section {
  margin-top: 40px;
  text-align: center;
}

.btn-outline {
  background: transparent;
  color: #999;
  border: 1px solid #ddd;
  padding: 10px 20px;
}

.btn-outline:hover {
  background: #f5f5f5;
  color: #666;
}

@media (max-width: 768px) {
  .stats-overview,
  .action-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
