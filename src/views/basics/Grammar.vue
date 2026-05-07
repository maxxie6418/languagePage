<template>
  <div class="grammar-page">
    <div class="page-header">
      <h1>语法体系</h1>
      <p class="subtitle">从简单句到复杂句，构建完整的英语语法树</p>
    </div>

    <div class="grammar-tree" v-if="grammarData.tree">
      <div 
        v-for="section in grammarData.tree" 
        :key="section.id" 
        class="grammar-section"
      >
        <div 
          class="section-header"
          @click="toggleSection(section.id)"
        >
          <h2>{{ section.title }}</h2>
          <p>{{ section.description }}</p>
          <span class="toggle-icon">{{ expandedSections[section.id] ? '−' : '+' }}</span>
        </div>

        <div v-if="expandedSections[section.id]" class="section-content">
          <div 
            v-for="node in section.children" 
            :key="node.id"
            class="grammar-node"
          >
            <div 
              class="node-header"
              @click="toggleNode(node.id)"
            >
              <span class="node-title">{{ node.title }}</span>
              <span class="node-desc">{{ node.description }}</span>
              <span class="toggle-icon small">{{ expandedNodes[node.id] ? '−' : '+' }}</span>
            </div>

            <div v-if="expandedNodes[node.id]" class="node-content">
              <div v-if="node.example" class="node-example">
                <span class="label">例句：</span>
                <em>{{ node.example }}</em>
              </div>
              <div v-if="node.pattern" class="node-pattern">
                <span class="label">句型：</span>
                {{ node.pattern }}
              </div>
              <div v-if="node.conjunction" class="node-conjunctions">
                <span class="label">连词：</span>
                <span v-for="c in node.conjunction" :key="c" class="conj-tag">{{ c }}</span>
              </div>

              <div v-if="node.children && node.children.length > 0" class="node-children">
                <router-link 
                  v-for="child in node.children" 
                  :key="child.id"
                  :to="`/basics/grammar/${child.id}`"
                  class="child-link"
                >
                  {{ child.title }}
                  <span v-if="child.example" class="child-example">— {{ child.example }}</span>
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="grammar-parser card">
      <h3>🔍 句法拆解器</h3>
      <p class="parser-desc">输入或选择一个句子，系统将分步高亮展示句子成分</p>
      
      <div class="parser-input">
        <select v-model="selectedSentence" @change="parseSentence">
          <option value="">选择一个例句...</option>
          <option value="Birds sing.">Birds sing.</option>
          <option value="I read books.">I read books.</option>
          <option value="She gave me a book.">She gave me a book.</option>
          <option value="They elected him president.">They elected him president.</option>
          <option value="She is a teacher.">She is a teacher.</option>
          <option value="The man who came here is my teacher.">The man who came here is my teacher.</option>
        </select>
        <input 
          v-model="customSentence" 
          placeholder="或输入自定义句子..."
          @keyup.enter="parseSentence"
        />
        <button @click="parseSentence" class="btn btn-primary">拆解</button>
      </div>

      <div v-if="parsedResult" class="parsed-result">
        <h4>句子成分分析</h4>
        <div class="sentence-display">
          <span 
            v-for="(part, i) in parsedResult.parts" 
            :key="i"
            :class="['sentence-part', part.type]"
          >
            {{ part.text }}
          </span>
        </div>
        <div class="parts-legend">
          <span class="legend-item subject">主语</span>
          <span class="legend-item predicate">谓语</span>
          <span class="legend-item object">宾语</span>
          <span class="legend-item modifier">修饰语</span>
        </div>
        <div class="parts-list">
          <div v-for="(part, i) in parsedResult.parts" :key="i" class="part-item">
            <span class="part-type">{{ part.type }}</span>
            <span class="part-text">{{ part.text }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import axios from 'axios'

const grammarData = ref({})
const expandedSections = reactive({})
const expandedNodes = reactive({})
const selectedSentence = ref('')
const customSentence = ref('')
const parsedResult = ref(null)

const loadGrammar = async () => {
  try {
    const res = await axios.get('/api/basics/grammar')
    grammarData.value = res.data
    // 默认展开前两个章节
    if (res.data.tree) {
      Object.keys(expandedSections).length === 0
      res.data.tree.slice(0, 1).forEach(s => {
        expandedSections[s.id] = true
      })
    }
  } catch (err) {
    console.error('Failed to load grammar:', err)
  }
}

const toggleSection = (id) => {
  expandedSections[id] = !expandedSections[id]
}

const toggleNode = (id) => {
  expandedNodes[id] = !expandedNodes[id]
}

const parseSentence = () => {
  const sentence = customSentence.value || selectedSentence.value
  if (!sentence) return

  // 简单句法分析（基于规则的演示）
  const parts = []
  const words = sentence.trim().split(/\s+/)
  
  // 识别主语和谓语
  const subjects = ['I', 'You', 'He', 'She', 'It', 'We', 'They', 'The', 'A', 'An']
  const verbs = ['is', 'are', 'was', 'were', 'read', 'gave', 'elected', 'sang', 'sing']
  const objects = ['books', 'me', 'a', 'him', 'president', 'here']
  const modifiers = ['who', 'who came', 'who came here']

  // 主语识别
  let i = 0
  let currentPart = []
  let currentType = ''
  
  // 简化处理：分配颜色
  parts.push({ text: sentence, type: 'sentence' })
  
  // 更详细的分析
  if (sentence.includes('who')) {
    parts.length = 0
    // 定语从句句子
    if (sentence.startsWith('The man')) {
      parts.push({ text: 'The man', type: 'subject' })
      parts.push({ text: ' ', type: 'space' })
      parts.push({ text: 'who came here', type: 'modifier' })
      parts.push({ text: ' ', type: 'space' })
      parts.push({ text: 'is', type: 'predicate' })
      parts.push({ text: ' ', type: 'space' })
      parts.push({ text: 'my teacher', type: 'object' })
    }
  } else if (sentence.includes(' is ') || sentence.includes(' are ')) {
    parts.length = 0
    const idx = sentence.indexOf(sentence.match(/is|are/)[0])
    parts.push({ text: sentence.slice(0, idx).trim(), type: 'subject' })
    parts.push({ text: ' ', type: 'space' })
    parts.push({ text: sentence.slice(idx).trim(), type: 'predicate' })
  } else {
    parts.length = 0
    // 简单句
    if (words.length >= 2) {
      parts.push({ text: words.slice(0, Math.ceil(words.length/2)).join(' '), type: 'subject' })
      parts.push({ text: ' ', type: 'space' })
      parts.push({ text: words.slice(Math.ceil(words.length/2)).join(' '), type: 'predicate' })
    } else {
      parts.push({ text: sentence, type: 'subject' })
    }
  }

  parsedResult.value = { parts }
}

onMounted(() => {
  loadGrammar()
})
</script>

<style scoped>
.grammar-page {
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

.grammar-section {
  background: white;
  border-radius: 12px;
  margin-bottom: 16px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
}

.section-header {
  padding: 20px 24px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-left: 4px solid var(--secondary-color);
  transition: background 0.2s;
}

.section-header:hover {
  background: #f8f9fa;
}

.section-header h2 {
  font-size: 1.3rem;
  color: var(--primary-color);
  margin-bottom: 4px;
}

.section-header p {
  color: #666;
  font-size: 0.9rem;
}

.toggle-icon {
  font-size: 1.5rem;
  color: var(--primary-color);
  font-weight: bold;
  width: 30px;
  text-align: center;
}

.toggle-icon.small {
  font-size: 1.2rem;
}

.section-content {
  padding: 0 24px 20px;
}

.grammar-node {
  border: 1px solid var(--border-color);
  border-radius: 8px;
  margin-bottom: 8px;
  overflow: hidden;
}

.node-header {
  padding: 12px 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  background: #f8f9fa;
  transition: background 0.2s;
}

.node-header:hover {
  background: #f0f4f8;
}

.node-title {
  font-weight: 600;
  color: var(--primary-color);
  margin-right: 12px;
}

.node-desc {
  color: #888;
  font-size: 0.9rem;
  flex: 1;
}

.node-content {
  padding: 16px;
  border-top: 1px solid var(--border-color);
}

.node-example {
  margin-bottom: 12px;
  padding: 12px;
  background: #f8f9fa;
  border-radius: 6px;
}

.node-example .label,
.node-pattern .label {
  color: var(--primary-color);
  font-weight: 600;
}

.node-example em {
  color: #555;
}

.node-pattern {
  margin-bottom: 12px;
}

.node-conjunctions {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 12px;
}

.conj-tag {
  background: var(--primary-color);
  color: white;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 0.85rem;
}

.node-children {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 12px;
}

.child-link {
  display: block;
  padding: 10px 16px;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-radius: 6px;
  color: var(--primary-color);
  text-decoration: none;
  transition: all 0.2s;
}

.child-link:hover {
  background: var(--primary-color);
  color: white;
  transform: translateX(4px);
}

.child-example {
  font-size: 0.85rem;
  color: #888;
  margin-left: 8px;
}

.child-link:hover .child-example {
  color: rgba(255,255,255,0.7);
}

/* 句法拆解器 */
.grammar-parser {
  margin-top: 32px;
}

.grammar-parser h3 {
  color: var(--primary-color);
  margin-bottom: 8px;
}

.parser-desc {
  color: #666;
  margin-bottom: 16px;
}

.parser-input {
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
}

.parser-input select,
.parser-input input {
  flex: 1;
  padding: 12px;
  border: 2px solid var(--border-color);
  border-radius: 8px;
  font-size: 1rem;
}

.parser-input select:focus,
.parser-input input:focus {
  outline: none;
  border-color: var(--primary-color);
}

.parsed-result {
  background: #f8f9fa;
  padding: 24px;
  border-radius: 12px;
}

.parsed-result h4 {
  color: var(--primary-color);
  margin-bottom: 16px;
}

.sentence-display {
  font-size: 1.5rem;
  line-height: 2;
  padding: 20px;
  background: white;
  border-radius: 8px;
  margin-bottom: 16px;
  text-align: center;
}

.sentence-part {
  padding: 4px 8px;
  border-radius: 4px;
}

.sentence-part.subject {
  background: #e3f2fd;
  color: #1565c0;
}

.sentence-part.predicate {
  background: #fff3e0;
  color: #e65100;
}

.sentence-part.object {
  background: #e8f5e9;
  color: #2e7d32;
}

.sentence-part.modifier {
  background: #f3e5f5;
  color: #7b1fa2;
}

.parts-legend {
  display: flex;
  gap: 16px;
  justify-content: center;
  margin-bottom: 20px;
}

.legend-item {
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 0.9rem;
}

.legend-item.subject { background: #e3f2fd; color: #1565c0; }
.legend-item.predicate { background: #fff3e0; color: #e65100; }
.legend-item.object { background: #e8f5e9; color: #2e7d32; }
.legend-item.modifier { background: #f3e5f5; color: #7b1fa2; }

.parts-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 8px;
}

.part-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: white;
  border-radius: 6px;
}

.part-type {
  font-weight: 600;
  font-size: 0.8rem;
  text-transform: uppercase;
  color: #888;
}

.part-text {
  color: var(--primary-color);
}
</style>
