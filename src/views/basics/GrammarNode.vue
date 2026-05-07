<template>
  <div class="grammar-node-page">
    <div class="page-header">
      <router-link to="/basics/grammar" class="back-link">← 返回语法体系</router-link>
      <h1>{{ nodeData.title }}</h1>
      <p v-if="nodeData.description" class="description">{{ nodeData.description }}</p>
    </div>

    <div v-if="nodeData.example" class="example-section card">
      <h3>📝 示例</h3>
      <p class="example-text">{{ nodeData.example }}</p>
      <p v-if="nodeData.pattern" class="pattern">句型：{{ nodeData.pattern }}</p>
    </div>

    <div v-if="nodeData.examples" class="examples-section">
      <div v-for="(item, i) in nodeData.examples" :key="i" class="example-card card">
        <div class="example-header">
          <span v-if="item.conj" class="conj">{{ item.conj }}</span>
          <span v-if="item.pronoun" class="pronoun">{{ item.pronoun }}</span>
          <span v-if="item.adverb" class="adverb">{{ item.adverb }}</span>
          <span v-if="item.type" class="type">{{ item.type }}</span>
        </div>
        <p v-if="item.meaning" class="meaning">{{ item.meaning }}</p>
        <p v-if="item.use" class="use">{{ item.use }}</p>
        <p v-if="item.example" class="example-text">{{ item.example }}</p>
      </div>
    </div>

    <div v-if="nodeData.conjunctions" class="conjunctions-section card">
      <h3>🔗 常用连词</h3>
      <div class="conj-list">
        <span v-for="c in nodeData.conjunctions" :key="c" class="conj-tag">{{ c }}</span>
      </div>
    </div>

    <div v-if="nodeData.patterns" class="patterns-section">
      <h3>📊 常见句型</h3>
      <div v-for="(p, i) in nodeData.patterns" :key="i" class="pattern-card card">
        <div class="pattern-tense">{{ p.tense }}</div>
        <div class="pattern-format">{{ p.pattern }}</div>
        <div class="pattern-example">{{ p.example }}</div>
      </div>
    </div>

    <div class="related-practice">
      <router-link to="/practice/drill" class="btn btn-primary">
        🔥 开始专项练习
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'

const route = useRoute()
const nodeData = ref({})

onMounted(async () => {
  const { nodeId } = route.params
  try {
    const res = await axios.get(`/api/basics/grammar/${nodeId}`)
    nodeData.value = res.data
  } catch (err) {
    console.error('Failed to load grammar node:', err)
  }
})
</script>

<style scoped>
.grammar-node-page {
  max-width: 800px;
  margin: 0 auto;
}

.back-link {
  display: inline-block;
  margin-bottom: 16px;
  color: var(--primary-color);
}

.page-header h1 {
  font-size: 2rem;
  color: var(--primary-color);
  margin-bottom: 8px;
}

.description {
  color: #666;
  font-size: 1.1rem;
}

.example-section {
  margin: 24px 0;
}

.example-text {
  font-size: 1.3rem;
  font-style: italic;
  color: var(--primary-color);
  margin: 12px 0;
}

.pattern {
  color: #666;
}

.pattern-tense {
  font-weight: 600;
  color: var(--primary-color);
  margin-bottom: 8px;
}

.pattern-format {
  font-family: monospace;
  background: #f4f4f4;
  padding: 8px;
  border-radius: 4px;
  margin-bottom: 8px;
}

.pattern-example {
  font-style: italic;
  color: #555;
}

.examples-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin: 24px 0;
}

.example-card {
  padding: 16px;
}

.example-header {
  display: flex;
  gap: 8px;
  margin-bottom: 8px;
}

.conj, .pronoun, .adverb, .type {
  background: var(--primary-color);
  color: white;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 0.9rem;
}

.meaning {
  color: #555;
  margin-bottom: 4px;
}

.use {
  color: #888;
  font-size: 0.9rem;
  margin-bottom: 8px;
}

.conj-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 12px;
}

.conj-tag {
  background: linear-gradient(135deg, var(--primary-color) 0%, #2c5282 100%);
  color: white;
  padding: 8px 16px;
  border-radius: 20px;
  font-weight: 600;
}

.patterns-section h3 {
  color: var(--primary-color);
  margin: 24px 0 16px;
}

.pattern-card {
  margin-bottom: 16px;
}

.related-practice {
  margin-top: 32px;
  text-align: center;
}
</style>
