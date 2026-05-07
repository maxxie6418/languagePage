<template>
  <div class="basics-map">
    <div class="page-header">
      <h1>英语能力图谱</h1>
      <p class="subtitle">从 A2 到 C1，建立完整的英语能力阶梯</p>
    </div>

    <div class="cefr-levels" v-if="mapData.levels">
      <div 
        v-for="level in mapData.levels" 
        :key="level.level" 
        class="level-card"
        :class="{ active: activeLevel === level.level }"
        @click="activeLevel = level.level"
      >
        <div class="level-badge">{{ level.level }}</div>
        <h2 class="level-name">{{ level.name }}</h2>
        <p class="level-description">{{ level.description }}</p>
        <div class="level-skills">
          <span v-for="skill in level.skills" :key="skill" class="skill-tag">
            {{ skill }}
          </span>
        </div>
      </div>
    </div>

    <div class="exam-mapping card">
      <h3 class="card-title">📊 能力与考试对应</h3>
      <table class="mapping-table">
        <thead>
          <tr>
            <th>能力范围</th>
            <th>对应考试</th>
            <th>说明</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(exam, range) in mapData.examMapping" :key="range">
            <td><span class="highlight">{{ range }}</span></td>
            <td>{{ exam }}</td>
            <td>需要达到 {{ range }} 的词汇量和语法水平</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="learning-path card">
      <h3 class="card-title">🛤️ 推荐学习路径</h3>
      <div class="path-steps">
        <div class="path-step">
          <div class="step-number">1</div>
          <div class="step-content">
            <h4>基础夯实</h4>
            <p>掌握核心词汇和基础语法，建立语感</p>
            <router-link to="/basics/vocabulary" class="btn btn-secondary">开始词汇学习 →</router-link>
          </div>
        </div>
        <div class="path-step">
          <div class="step-number">2</div>
          <div class="step-content">
            <h4>语法体系构建</h4>
            <p>从简单句到复杂句，构建完整语法树</p>
            <router-link to="/basics/grammar" class="btn btn-secondary">开始语法学习 →</router-link>
          </div>
        </div>
        <div class="path-step">
          <div class="step-number">3</div>
          <div class="step-content">
            <h4>阅读素养提升</h4>
            <p>培养学术阅读能力，学会分析文章结构</p>
            <router-link to="/basics/reading" class="btn btn-secondary">开始阅读训练 →</router-link>
          </div>
        </div>
        <div class="path-step">
          <div class="step-number">4</div>
          <div class="step-content">
            <h4>应试能力强化</h4>
            <p>题型技巧训练，真题实战演练</p>
            <router-link to="/practice/drill" class="btn btn-primary">开始练习 →</router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const mapData = ref({})
const activeLevel = ref('B2')

onMounted(async () => {
  try {
    const res = await axios.get('/api/basics/map')
    mapData.value = res.data
  } catch (err) {
    console.error('Failed to load map data:', err)
  }
})
</script>

<style scoped>
.basics-map {
  max-width: 1000px;
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

.cefr-levels {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 32px;
}

.level-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.3s;
  border: 2px solid transparent;
}

.level-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0,0,0,0.1);
}

.level-card.active {
  border-color: var(--secondary-color);
}

.level-badge {
  display: inline-block;
  background: var(--primary-color);
  color: white;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 600;
  margin-bottom: 12px;
}

.level-name {
  font-size: 1.25rem;
  color: var(--primary-color);
  margin-bottom: 8px;
}

.level-description {
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 12px;
}

.level-skills {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.skill-tag {
  background: #f0f4f8;
  color: var(--primary-color);
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.8rem;
}

.mapping-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 16px;
}

.mapping-table th,
.mapping-table td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid var(--border-color);
}

.mapping-table th {
  background: #f8f9fa;
  font-weight: 600;
  color: var(--primary-color);
}

.learning-path {
  margin-top: 32px;
}

.path-steps {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-top: 16px;
}

.path-step {
  display: flex;
  gap: 20px;
  align-items: flex-start;
}

.step-number {
  width: 40px;
  height: 40px;
  background: var(--primary-color);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 1.1rem;
  flex-shrink: 0;
}

.step-content h4 {
  color: var(--primary-color);
  margin-bottom: 4px;
}

.step-content p {
  color: #666;
  margin-bottom: 12px;
}

@media (max-width: 768px) {
  .cefr-levels {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
