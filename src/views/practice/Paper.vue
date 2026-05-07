<template>
  <div class="paper-page">
    <div v-if="!examStarted && !examFinished" class="start-panel">
      <h1>📋 真题模考</h1>
      <p>严格模拟考场环境，全屏模式，计时器，不许中途查看解析</p>
      
      <div class="paper-info card">
        <h3>2024年考研英语（一）模拟</h3>
        <div class="info-grid">
          <div class="info-item">
            <span class="info-label">题目数量</span>
            <span class="info-value">20题</span>
          </div>
          <div class="info-item">
            <span class="info-label">总分</span>
            <span class="info-value">100分</span>
          </div>
          <div class="info-item">
            <span class="info-label">建议用时</span>
            <span class="info-value">30分钟</span>
          </div>
          <div class="info-item">
            <span class="info-label">题目来源</span>
            <span class="info-value">历年真题精选</span>
          </div>
        </div>
      </div>

      <div class="exam-rules">
        <h4>⚠️ 考场规则</h4>
        <ul>
          <li>考试期间请勿刷新页面，否则进度将丢失</li>
          <li>计时器将在点击"开始考试"后自动启动</li>
          <li>交卷后立即显示成绩和解析</li>
          <li>本次考试将记录到您的学习进度中</li>
        </ul>
      </div>

      <button class="btn btn-primary start-btn" @click="startExam">
        🎯 开始考试
      </button>
    </div>

    <div v-if="examStarted && !examFinished" class="exam-panel">
      <div class="exam-header">
        <div class="exam-progress">
          <span>第 {{ currentIndex + 1 }} 题 / 共 {{ questions.length }} 题</span>
          <div class="progress-bar">
            <div class="progress-fill" :style="{ width: ((currentIndex + 1) / questions.length * 100) + '%' }"></div>
          </div>
        </div>
        <div class="exam-timer">
          <span class="timer-icon">⏱️</span>
          <span class="timer-value">{{ formattedTime }}</span>
        </div>
      </div>

      <div class="question-section">
        <div class="question-type">{{ currentQuestion?.type }} · {{ currentQuestion?.topic }}</div>
        <div v-if="currentQuestion?.text" class="question-passage">
          {{ currentQuestion.text }}
        </div>
        <div class="question-content">{{ currentQuestion?.question }}</div>
      </div>

      <div class="options-section">
        <div 
          v-for="(opt, i) in currentQuestion?.options" 
          :key="i"
          class="option-card"
          :class="{ selected: answers[currentQuestion?.id] === opt[0] }"
          @click="selectOption(opt[0])"
        >
          <span class="option-key">{{ opt[0] }}</span>
          <span class="option-content">{{ opt.substring(2) }}</span>
        </div>
      </div>

      <div class="exam-navigation">
        <button class="btn btn-secondary" @click="prevQuestion" :disabled="currentIndex === 0">
          ← 上一题
        </button>
        
        <button 
          v-if="currentIndex < questions.length - 1" 
          class="btn btn-primary" 
          @click="nextQuestion"
        >
          下一题 →
        </button>
        <button v-else class="btn btn-primary submit-btn" @click="submitExam">
          交卷
        </button>
      </div>

      <div class="answer-sheet">
        <h4>答题卡</h4>
        <div class="sheet-grid">
          <div 
            v-for="(q, i) in questions" 
            :key="q.id"
            class="sheet-item"
            :class="{ 
              current: i === currentIndex,
              answered: answers[q.id],
              unmarked: !answers[q.id]
            }"
            @click="goToQuestion(i)"
          >
            {{ i + 1 }}
          </div>
        </div>
        <div class="sheet-legend">
          <span class="legend-item answered">已答</span>
          <span class="legend-item unanswered">未答</span>
        </div>
      </div>
    </div>

    <div v-if="examFinished" class="result-panel">
      <div class="result-header">
        <h2>考试完成</h2>
        <div class="score-display">
          <span class="score">{{ score }}</span>
          <span class="total">/ {{ questions.length }}</span>
        </div>
        <div class="score-percent">{{ Math.round(score / questions.length * 100) }}%</div>
      </div>

      <div class="results-review">
        <h3>答案解析</h3>
        <div v-for="(result, i) in results" :key="i" class="result-item card">
          <div class="result-qnum">第 {{ i + 1 }} 题</div>
          <div class="result-question">{{ result.question }}</div>
          <div class="result-answer">
            <span class="correct-label">正确答案：</span>
            <span class="correct-answer">{{ result.correctAnswer }}</span>
          </div>
          <div class="result-user" :class="{ wrong: result.answer !== result.correctAnswer }">
            <span class="user-label">您的答案：</span>
            <span class="user-answer">{{ result.answer || '未作答' }}</span>
            <span class="result-icon">{{ result.answer === result.correctAnswer ? '✓' : '✗' }}</span>
          </div>
          <div class="result-explanation">
            <strong>解析：</strong>{{ result.explanation }}
          </div>
          <router-link 
            v-if="result.relatedBasics" 
            :to="result.relatedBasics" 
            class="basics-link"
          >
            📚 巩固基础
          </router-link>
        </div>
      </div>

      <div class="result-actions">
        <router-link to="/practice/drill" class="btn btn-secondary">继续练习</router-link>
        <router-link to="/" class="btn btn-primary">回到首页</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import axios from 'axios'

const questions = ref([])
const currentIndex = ref(0)
const answers = ref({})
const examStarted = ref(false)
const examFinished = ref(false)
const remainingTime = ref(30 * 60)
const results = ref([])
const score = ref(0)
let timerInterval = null

const currentQuestion = computed(() => questions.value[currentIndex.value])
const formattedTime = computed(() => {
  const mins = Math.floor(remainingTime.value / 60)
  const secs = remainingTime.value % 60
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
})

const loadQuestions = async () => {
  try {
    const res = await axios.get('/api/practice/questions?count=20')
    questions.value = res.data.questions
  } catch (err) {
    console.error('Failed to load questions:', err)
  }
}

const startExam = () => {
  examStarted.value = true
  startTimer()
}

const startTimer = () => {
  timerInterval = setInterval(() => {
    if (remainingTime.value > 0) {
      remainingTime.value--
    } else {
      submitExam()
    }
  }, 1000)
}

const selectOption = (option) => {
  if (currentQuestion.value) {
    answers.value[currentQuestion.value.id] = option
  }
}

const nextQuestion = () => {
  if (currentIndex.value < questions.value.length - 1) {
    currentIndex.value++
  }
}

const prevQuestion = () => {
  if (currentIndex.value > 0) {
    currentIndex.value--
  }
}

const goToQuestion = (index) => {
  currentIndex.value = index
}

const submitExam = async () => {
  clearInterval(timerInterval)
  
  try {
    const submissions = questions.value.map(q => ({
      questionId: q.id,
      answer: answers.value[q.id] || null
    }))
    
    const res = await axios.post('/api/practice/submit-batch', { answers: submissions })
    results.value = res.data.results.map((r, i) => ({
      ...r,
      question: questions.value[i].question,
      topic: questions.value[i].topic,
      relatedBasics: questions.value[i].relatedBasics
    }))
    score.value = res.data.score
    examFinished.value = true
  } catch (err) {
    console.error('Failed to submit exam:', err)
  }
}

onMounted(() => {
  loadQuestions()
})

onUnmounted(() => {
  if (timerInterval) {
    clearInterval(timerInterval)
  }
})
</script>

<style scoped>
.paper-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 24px;
}

.start-panel,
.exam-panel,
.result-panel {
  background: white;
  border-radius: 16px;
  padding: 40px;
  max-width: 900px;
  margin: 0 auto;
  box-shadow: 0 10px 40px rgba(0,0,0,0.1);
}

.start-panel h1 {
  text-align: center;
  color: var(--primary-color);
  margin-bottom: 16px;
}

.start-panel > p {
  text-align: center;
  color: #666;
  margin-bottom: 32px;
}

.paper-info {
  margin-bottom: 24px;
}

.paper-info h3 {
  color: var(--primary-color);
  margin-bottom: 16px;
  text-align: center;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.info-item {
  display: flex;
  flex-direction: column;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 8px;
}

.info-label {
  font-size: 0.85rem;
  color: #666;
  margin-bottom: 4px;
}

.info-value {
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--primary-color);
}

.exam-rules {
  margin-bottom: 32px;
  padding: 20px;
  background: #fff3cd;
  border-radius: 12px;
  border-left: 4px solid #ffc107;
}

.exam-rules h4 {
  color: #856404;
  margin-bottom: 12px;
}

.exam-rules ul {
  padding-left: 20px;
  color: #856404;
}

.exam-rules li {
  margin-bottom: 8px;
}

.start-btn {
  display: block;
  width: 100%;
  padding: 16px;
  font-size: 1.2rem;
}

.exam-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
  padding-bottom: 16px;
  border-bottom: 1px solid #eee;
}

.exam-progress {
  flex: 1;
}

.exam-progress span {
  color: #666;
  font-size: 0.9rem;
}

.progress-bar {
  height: 6px;
  background: #e0e0e0;
  border-radius: 3px;
  margin-top: 8px;
}

.progress-fill {
  height: 100%;
  background: var(--primary-color);
  border-radius: 3px;
  transition: width 0.3s;
}

.exam-timer {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background: var(--primary-color);
  color: white;
  border-radius: 8px;
  font-size: 1.3rem;
  font-weight: bold;
  font-family: monospace;
}

.question-section {
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

.question-passage {
  background: #f8f9fa;
  padding: 16px;
  border-radius: 8px;
  line-height: 1.8;
  margin-bottom: 16px;
  font-size: 0.95rem;
}

.question-content {
  font-size: 1.15rem;
  line-height: 1.7;
}

.options-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 32px;
}

.option-card {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 16px 20px;
  background: #f8f9fa;
  border: 2px solid transparent;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s;
}

.option-card:hover {
  background: #f0f4f8;
}

.option-card.selected {
  background: #e3f2fd;
  border-color: var(--primary-color);
}

.option-key {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  border-radius: 50%;
  font-weight: bold;
  color: var(--primary-color);
  flex-shrink: 0;
}

.option-card.selected .option-key {
  background: var(--primary-color);
  color: white;
}

.option-content {
  line-height: 1.6;
}

.exam-navigation {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 32px;
}

.submit-btn {
  background: #c0392b;
}

.answer-sheet {
  padding: 20px;
  background: #f8f9fa;
  border-radius: 12px;
}

.answer-sheet h4 {
  color: #666;
  margin-bottom: 16px;
  font-size: 0.9rem;
}

.sheet-grid {
  display: grid;
  grid-template-columns: repeat(10, 1fr);
  gap: 8px;
  margin-bottom: 12px;
}

.sheet-item {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.sheet-item.answered {
  background: var(--primary-color);
  color: white;
}

.sheet-item.unmarked {
  background: white;
  border: 1px solid #ddd;
}

.sheet-item.current {
  box-shadow: 0 0 0 3px var(--secondary-color);
}

.sheet-legend {
  display: flex;
  gap: 16px;
  font-size: 0.8rem;
  color: #666;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 4px;
}

.legend-item::before {
  content: '';
  width: 12px;
  height: 12px;
  border-radius: 3px;
}

.legend-item.answered::before {
  background: var(--primary-color);
}

.legend-item.unanswered::before {
  background: white;
  border: 1px solid #ddd;
}

.result-header {
  text-align: center;
  padding: 32px;
  background: linear-gradient(135deg, var(--primary-color) 0%, #2c5282 100%);
  color: white;
  border-radius: 12px;
  margin-bottom: 32px;
}

.result-header h2 {
  margin-bottom: 16px;
}

.score-display {
  font-size: 4rem;
  font-weight: bold;
}

.score-display .total {
  font-size: 2rem;
  opacity: 0.8;
}

.score-percent {
  font-size: 1.5rem;
  margin-top: 8px;
  opacity: 0.9;
}

.results-review h3 {
  color: var(--primary-color);
  margin-bottom: 20px;
}

.result-item {
  margin-bottom: 20px;
  padding: 20px;
}

.result-qnum {
  color: var(--secondary-color);
  font-weight: 600;
  margin-bottom: 8px;
}

.result-question {
  font-size: 1rem;
  margin-bottom: 12px;
}

.result-answer,
.result-user {
  margin-bottom: 8px;
}

.correct-label,
.user-label {
  color: #666;
}

.correct-answer {
  color: #27ae60;
  font-weight: 600;
}

.result-user.wrong .user-answer {
  color: #c0392b;
}

.result-icon {
  margin-left: 8px;
  font-size: 1.2rem;
}

.result-explanation {
  background: #f8f9fa;
  padding: 12px;
  border-radius: 8px;
  margin: 12px 0;
  line-height: 1.6;
}

.basics-link {
  display: inline-block;
  padding: 8px 16px;
  background: var(--primary-color);
  color: white;
  border-radius: 6px;
  text-decoration: none;
  font-size: 0.9rem;
}

.result-actions {
  display: flex;
  gap: 16px;
  justify-content: center;
  margin-top: 32px;
}

.btn {
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  text-decoration: none;
}

.btn-primary {
  background: var(--primary-color);
  color: white;
  border: none;
}

.btn-secondary {
  background: white;
  color: var(--primary-color);
  border: 2px solid var(--primary-color);
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
