<template>
  <div class="skills-page">
    <div class="page-header">
      <h1>题型方法论</h1>
      <p class="subtitle">阅读六大题型、完形逻辑、新题型策略、大小作文框架</p>
    </div>

    <div class="skills-nav">
      <button 
        v-for="type in skillTypes" 
        :key="type"
        @click="selectedType = type"
        class="type-btn"
        :class="{ active: selectedType === type }"
      >
        {{ type }}
      </button>
    </div>

    <div class="skills-list" v-if="filteredSkills.length > 0">
      <div v-for="skill in filteredSkills" :key="skill.id" class="skill-card card">
        <div class="skill-header">
          <h3>{{ skill.name }}</h3>
          <span class="skill-subtype">{{ skill.subtype }}</span>
        </div>
        <p class="skill-desc">{{ skill.description }}</p>
        
        <div class="skill-approach">
          <h4>解题步骤</h4>
          <ol>
            <li v-for="(step, i) in skill.approach" :key="i">{{ step }}</li>
          </ol>
        </div>

        <div v-if="skill.example" class="skill-example">
          <h4>典型题干</h4>
          <p class="example-text">{{ skill.example }}</p>
        </div>

        <div v-if="skill.logicTypes" class="skill-logic">
          <h4>逻辑关系类型</h4>
          <div class="logic-tags">
            <span v-for="t in skill.logicTypes" :key="t" class="logic-tag">{{ t }}</span>
          </div>
        </div>

        <router-link to="/practice/drill" class="btn btn-secondary">开始练习</router-link>
      </div>
    </div>

    <div v-else class="empty-state">
      <p>请选择一个题型类别查看方法论</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'

const skills = ref([])
const selectedType = ref('reading')

const skillTypes = ['reading', 'cloze', 'new', 'writing']

const typeNames = {
  reading: '阅读理解',
  cloze: '完形填空',
  new: '新题型',
  writing: '写作'
}

const filteredSkills = computed(() => {
  return skills.value.filter(s => s.type === selectedType.value)
})

onMounted(async () => {
  try {
    const res = await axios.get('/api/exam/skills')
    skills.value = res.data.skills
  } catch (err) {
    console.error('Failed to load skills:', err)
  }
})
</script>

<style scoped>
.skills-page {
  max-width: 900px;
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

.skills-nav {
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
  flex-wrap: wrap;
}

.type-btn {
  padding: 12px 24px;
  background: white;
  border: 2px solid var(--border-color);
  border-radius: 24px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 500;
  transition: all 0.2s;
}

.type-btn:hover {
  border-color: var(--primary-color);
}

.type-btn.active {
  background: var(--primary-color);
  color: white;
  border-color: var(--primary-color);
}

.skills-list {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.skill-card {
  padding: 24px;
}

.skill-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.skill-header h3 {
  color: var(--primary-color);
  font-size: 1.3rem;
}

.skill-subtype {
  background: var(--secondary-color);
  color: white;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 0.85rem;
}

.skill-desc {
  color: #555;
  margin-bottom: 20px;
}

.skill-approach h4,
.skill-example h4,
.skill-logic h4 {
  color: var(--primary-color);
  font-size: 1rem;
  margin-bottom: 8px;
}

.skill-approach ol {
  padding-left: 24px;
  margin-bottom: 16px;
}

.skill-approach li {
  margin-bottom: 8px;
  color: #555;
}

.example-text {
  background: #f8f9fa;
  padding: 12px;
  border-radius: 6px;
  font-style: italic;
  color: var(--primary-color);
}

.logic-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.logic-tag {
  background: #e8f4f8;
  color: #1565c0;
  padding: 6px 12px;
  border-radius: 16px;
  font-size: 0.9rem;
}

.empty-state {
  text-align: center;
  padding: 60px;
  color: #888;
}
</style>
