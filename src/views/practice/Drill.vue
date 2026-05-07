<template>
  <div class="drill-page">
    <div class="drill-header">
      <h1>📝 专项练习</h1>
      <p>选择题型和知识点，针对性训练</p>
    </div>

    <div class="filter-section">
      <div class="filter-group">
        <label>题型</label>
        <select v-model="filters.type" @change="loadQuestions">
          <option value="">全部题型</option>
          <option value="grammar">语法</option>
          <option value="vocabulary">词汇</option>
          <option value="reading">阅读</option>
          <option value="writing">写作</option>
          <option value="translation">翻译</option>
          <option value="cloze">完形</option>
        </select>
      </div>

      <div class="filter-group">
        <label>知识点</label>
        <select v-model="filters.topic" @change="loadQuestions">
          <option value="">全部知识点</option>
          <option v-for="t in topicOptions" :key="t" :value="t">{{ t }}</option>
        </select>
      </div>

      <div class="filter-group">
        <label>难度</label>
        <select v-model="filters.difficulty" @change="loadQuestions">
          <option value="">全部难度</option>
          <option value="easy">简单</option>
          <option value="medium">中等</option>
          <option value="hard">困难</option>
        </select>
      </div>

      <div class="filter-group">
        <label>题量</label>
        <select v-model="filters.count" @change="loadQuestions">
          <option :value="5">5题</option>
          <option :value="10">10题</option>
          <option :value="15">15题</option>
          <option :value="20">20题</option>
        </select>
      </div>
    </div>

    <!-- 答题状态 -->
    <div v-if="currentQuestion && !showResult" class="question-panel">
      <div class="progress-bar">
        <div class="progress-text">{{ currentIndex + 1 }} / {{ questions.length }}</div>
        <div class="progress-fill" :style="{ width: ((currentIndex + 1) / questions.length * 100) + '%' }"></div>
      </div>

      <div class="question-card">
        <div class="question-type">{{ currentQuestion.type }} · {{ currentQuestion.topic }}</div>
        <div v-if="currentQuestion.text" class="question-text passage">
          {{ currentQuestion.text }}
        </div>
        <div class="question-text">{{ currentQuestion.question }}</div>
      </div>

      <div class="options-list">
        <div 
          v-for="(opt, i) in currentQuestion.options" 
          :key="i"
          class="option-item"
          :class="{ selected: selectedAnswer === opt[0] }"
          @click="selectAnswer(opt[0])"
        >
          <span class="option-letter">{{ opt[0] }}</span>
          <span class="option-text">{{ opt.substring(2) }}</span>
        </div>
      </div>

      <div class="action-buttons">
        <button class="btn btn-secondary" @click="markUncertain" :class="{ active: isUncertain }">
          {{ isUncertain ? '✓ 已标记' : '？标记不确定' }}
        </button>
        <button class="btn btn-primary" @click="submitAnswer" :disabled="!selectedAnswer">
          提交答案
        </button>
      </div>
    </div>

    <!-- 结果状态 -->
    <div v-if="showResult" class="result-panel">
      <div class="result-header" :class="{ correct: lastResult?.correct, wrong: !lastResult?.correct }">
        <div class="result-icon">{{ lastResult?.correct ? '✓' : '✗' }}</div>
        <div class="result-text">
          {{ lastResult?.correct ? '回答正确！' : '回答错误' }}
        </div>
      </div>

      <div class="explanation-card card">
        <h3>解析</h3>
        <p class="explanation-text">{{ lastResult?.explanation }}</p>
        
        <div v-if="lastResult?.relatedBasics" class="back-to-basics">
          <router-link :to="lastResult.relatedBasics" class="btn btn-secondary">
            📚 巩固基础 → 
          </router-link>
        </div>
      </div>

      <div class="action-buttons">
        <button v-if="currentIndex < questions.length - 1" class="btn btn-primary" @click="nextQuestion">
          下一题 →
        </button>
        <button v-else class="btn btn-primary" @click="finishDrill">
          完成练习
        </button>
      </div>
    </div>

    <!-- 完成状态 -->
    <div v-if="showSummary" class="summary-panel">
      <div class="summary-header">
        <h2>练习完成！</h2>
        <div class="summary-score">{{ correctCount }} / {{ questions.length }}</div>
        <div class="summary-percent">{{ Math.round(correctCount / questions.length * 100) }}%</div>
      </div>

      <div class="summary-stats">
        <div class="stat-item">
          <span class="stat-value">{{ correctCount }}</span>
          <span class="stat-label">正确</span>
        </div>
        <div class="stat-item">
          <span class="stat-value">{{ questions.length - correctCount }}</span>
          <span class="stat-label">错误</span>
        </div>
      </div>

      <div class="action-buttons">
        <button class="btn btn-secondary" @click="resetDrill">重新开始</button>
        <router-link to="/basics" class="btn btn-primary">回到基础</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'

const questions = ref([])
const currentIndex = ref(0)
const selectedAnswer = ref('')
const isUncertain = ref(false)
const showResult = ref(false)
const showSummary = ref(false)
const lastResult = ref(null)
const correctCount = ref(0)

const filters = ref({
  type: '',
  topic: '',
  difficulty: '',
  count: 10
})

const topicOptions = [
  '定语从句', '名词性从句', '状语从句', '虚拟语气', '非谓语动词',
  '词根词缀', '词义辨析', '词组搭配', '细节理解', '推理判断',
  '词义猜测', '主旨大意', '观点态度', '句子改写', '衔接连贯',
  '英汉差异', '拆句重组'
]

const currentQuestion = computed(() => questions.value[currentIndex.value])

const loadQuestions = async () => {
  try {
    const params = new URLSearchParams()
    if (filters.value.type) params.append('type', filters.value.type)
    if (filters.value.topic) params.append('topic', filters.value.topic)
    if (filters.value.difficulty) params.append('difficulty', filters.value.difficulty)
    params.append('count', filters.value.count)

    const res = await axios.get(`/api/practice/questions?${params}`)
    questions.value = res.data.questions
    resetState()
  } catch (err) {
    console.error('Failed to load questions:', err)
  }
}

const selectAnswer = (answer) => {
  selectedAnswer.value = answer
}

const markUncertain = () => {
  isUncertain.value = !isUncertain.value
}

const submitAnswer = async () => {
  try {
    const res = await axios.post('/api/practice/submit', {
      questionId: currentQuestion.value.id,
      answer: selectedAnswer.value
    })
    lastResult.value = res.data
    showResult.value = true
    if (res.data.correct) {
      correctCount.value++
    }
  } catch (err) {
    console.error('Failed to submit answer:', err)
  }
}

const nextQuestion = () => {
  currentIndex.value++
  resetQuestionState()
}

const finishDrill = () => {
  showSummary.value = true
}

const resetDrill = () => {
  loadQuestions()
}

const resetState = () => {
  currentIndex.value = 0
  showResult.value = false
  showSummary.value = false
  correctCount.value = 0
  resetQuestionState()
}

const resetQuestionState = () => {
  selectedAnswer.value = ''
  isUncertain.value = false
  showResult.value = false
  lastResult.value = null
}

onMounted(() => {
  loadQuestions()
})
</script>

<style scoped>
.drill-page {
  min-height: 100vh;
  background: #f5f5f5;
  padding: 24px;
}

.drill-header {
  text-align: center;
  margin-bottom: 32px;
}

.drill-header h1 {
  font-size: 1.8rem;
  color: var(--primary-color);
  margin-bottom: 8px;
}

.drill-header p {
  color: #666;
}

.filter-section {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  margin-bottom: 32px;
  justify-content: center;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.filter-group label {
  font-size: 0.85rem;
  color: #666;
  font-weight: 500;
}

.filter-group select {
  padding: 10px 16px;
  border: 2px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  background: white;
  min-width: 140px;
}

.filter-group select:focus {
  outline: none;
  border-color: var(--primary-color);
}

.progress-bar {
  background: #e0e0e0;
  border-radius: 12px;
  height: 8px;
  margin-bottom: 24px;
  position: relative;
  overflow: hidden;
}

.progress-text {
  position: absolute;
  right: 0;
  top: -24px;
  font-size: 0.9rem;
  color: #666;
}

.progress-fill {
  height: 100%;
  background: var(--primary-color);
  border-radius: 12px;
  transition: width 0.3s;
}

.question-panel,
.result-panel,
.summary-panel {
  background: white;
  border-radius: 16px;
  padding: 32px;
  max-width: 700px;
  margin: 0 auto;
}

.question-card {
  margin-bottom: 24px;
}

.question-type {
  display: inline-block;
  background: var(--secondary-color);
  color: white;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 0.85rem;
  margin-bottom: 16px;
}

.question-text {
  font-size: 1.15rem;
  line-height: 1.8;
  color: #333;
}

.question-text.passage {
  background: #f8f9fa;
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 16px;
  font-size: 1rem;
}

.options-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 24px;
}

.option-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 20px;
  background: #f8f9fa;
  border: 2px solid transparent;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s;
}

.option-item:hover {
  background: #f0f4f8;
}

.option-item.selected {
  background: #e3f2fd;
  border-color: var(--primary-color);
}

.option-letter {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  border-radius: 50%;
  font-weight: 600;
  color: var(--primary-color);
  flex-shrink: 0;
}

.option-item.selected .option-letter {
  background: var(--primary-color);
  color: white;
}

.option-text {
  font-size: 1rem;
  line-height: 1.5;
}

.action-buttons {
  display: flex;
  gap: 16px;
  justify-content: center;
}

.btn {
  padding: 14px 28px;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  text-decoration: none;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-primary {
  background: var(--primary-color);
  color: white;
  border: none;
}

.btn-primary:hover {
  background: #152d4a;
}

.btn-secondary {
  background: white;
  color: var(--primary-color);
  border: 2px solid var(--primary-color);
}

.btn-secondary.active {
  background: var(--primary-color);
  color: white;
}

.result-header {
  text-align: center;
  padding: 24px;
  border-radius: 12px;
  margin-bottom: 24px;
}

.result-header.correct {
  background: #e8f5e9;
}

.result-header.wrong {
  background: #ffebee;
}

.result-icon {
  font-size: 3rem;
  margin-bottom: 8px;
}

.result-text {
  font-size: 1.2rem;
  font-weight: 600;
}

.explanation-card {
  margin-bottom: 24px;
}

.explanation-card h3 {
  color: var(--primary-color);
  margin-bottom: 12px;
}

.explanation-text {
  line-height: 1.8;
  color: #555;
}

.back-to-basics {
  margin-top: 16px;
}

.summary-header {
  text-align: center;
  padding: 32px;
}

.summary-header h2 {
  font-size: 1.8rem;
  color: var(--primary-color);
  margin-bottom: 16px;
}

.summary-score {
  font-size: 4rem;
  font-weight: bold;
  color: var(--primary-color);
}

.summary-percent {
  font-size: 1.5rem;
  color: var(--secondary-color);
}

.summary-stats {
  display: flex;
  justify-content: center;
  gap: 48px;
  margin: 24px 0;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-value {
  font-size: 2rem;
  font-weight: bold;
  color: var(--primary-color);
}

.stat-label {
  color: #666;
  font-size: 0.9rem;
}
</style>
