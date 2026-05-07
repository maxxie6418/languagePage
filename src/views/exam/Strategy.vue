<template>
  <div class="strategy-page">
    <div class="page-header">
      <h1>考研英语策略</h1>
      <p class="subtitle">英语一 vs 英语二，分值拆解与阶段规划</p>
    </div>

    <div v-if="strategyData.overview" class="overview-section">
      <div class="exam-comparison">
        <div class="exam-card english1">
          <h2>{{ strategyData.overview.english1.name }}</h2>
          <p class="exam-target">{{ strategyData.overview.english1.target }}</p>
          <div class="exam-score">总分：{{ strategyData.overview.english1.总分 }}</div>
          <div class="exam-sections">
            <div v-for="s in strategyData.overview.english1.sections" :key="s" class="section-tag">
              {{ s }}
            </div>
          </div>
        </div>

        <div class="exam-card english2">
          <h2>{{ strategyData.overview.english2.name }}</h2>
          <p class="exam-target">{{ strategyData.overview.english2.target }}</p>
          <div class="exam-score">总分：{{ strategyData.overview.english2.总分 }}</div>
          <div class="exam-sections">
            <div v-for="s in strategyData.overview.english2.sections" :key="s" class="section-tag">
              {{ s }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="strategyData.differences" class="differences-section card">
      <h3 class="card-title">📊 英语一 vs 英语二 核心区别</h3>
      <table class="diff-table">
        <thead>
          <tr>
            <th>维度</th>
            <th>英语（一）</th>
            <th>英语（二）</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="d in strategyData.differences" :key="d.aspect">
            <td><strong>{{ d.aspect }}</strong></td>
            <td>{{ d.english1 }}</td>
            <td>{{ d.english2 }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="strategyData.phases" class="phases-section">
      <h3>🗓️ 三阶段备考规划</h3>
      <div class="phases-grid">
        <div v-for="phase in strategyData.phases" :key="phase.name" class="phase-card card">
          <div class="phase-header">
            <h4>{{ phase.name }}</h4>
            <span class="phase-duration">{{ phase.duration }}</span>
          </div>
          <p class="phase-focus">{{ phase.focus }}</p>
        </div>
      </div>
    </div>

    <div class="cta-section">
      <router-link to="/basics" class="btn btn-primary">从基础开始 →</router-link>
      <router-link to="/practice/drill" class="btn btn-secondary">开始刷题 →</router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const strategyData = ref({})

onMounted(async () => {
  try {
    const res = await axios.get('/api/exam/strategy')
    strategyData.value = res.data
  } catch (err) {
    console.error('Failed to load strategy:', err)
  }
})
</script>

<style scoped>
.strategy-page {
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

.exam-comparison {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  margin-bottom: 32px;
}

.exam-card {
  padding: 24px;
  border-radius: 12px;
  color: white;
}

.exam-card.english1 {
  background: linear-gradient(135deg, #1e3a5f 0%, #2c5282 100%);
}

.exam-card.english2 {
  background: linear-gradient(135deg, #2d5016 0%, #48a03a 100%);
}

.exam-card h2 {
  font-size: 1.5rem;
  margin-bottom: 8px;
}

.exam-target {
  opacity: 0.9;
  margin-bottom: 12px;
}

.exam-score {
  font-size: 1.2rem;
  margin-bottom: 16px;
}

.exam-sections {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.section-tag {
  background: rgba(255,255,255,0.2);
  padding: 6px 12px;
  border-radius: 16px;
  font-size: 0.9rem;
}

.differences-section {
  margin-bottom: 32px;
}

.diff-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 16px;
}

.diff-table th,
.diff-table td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid var(--border-color);
}

.diff-table th {
  background: #f8f9fa;
  font-weight: 600;
}

.phases-section h3 {
  color: var(--primary-color);
  margin-bottom: 16px;
}

.phases-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.phase-card {
  padding: 20px;
}

.phase-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.phase-header h4 {
  color: var(--primary-color);
}

.phase-duration {
  background: var(--secondary-color);
  color: white;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 0.85rem;
}

.phase-focus {
  color: #666;
  font-size: 0.95rem;
}

.cta-section {
  display: flex;
  gap: 16px;
  justify-content: center;
  margin-top: 40px;
}

@media (max-width: 768px) {
  .exam-comparison,
  .phases-grid {
    grid-template-columns: 1fr;
  }
}
</style>
