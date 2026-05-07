const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, '../data/progress.json');

// 内存中的进度数据
let progressData = {
  totalAttempts: 0,
  correctCount: 0,
  attempts: {},
  wrongQuestions: [],
  topicStats: {},
  lastUpdated: null
};

// 初始化：尝试加载已有数据
try {
  if (fs.existsSync(DATA_FILE)) {
    const data = fs.readFileSync(DATA_FILE, 'utf-8');
    progressData = JSON.parse(data);
  }
} catch (err) {
  console.log('初始化进度数据...');
}

// 保存数据到文件
const saveData = () => {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(progressData, null, 2), 'utf-8');
  } catch (err) {
    console.error('保存进度数据失败:', err);
  }
};

// 记录一次答题尝试
const recordAttempt = (questionId, attemptData) => {
  progressData.totalAttempts++;
  progressData.lastUpdated = new Date().toISOString();

  if (!progressData.attempts[questionId]) {
    progressData.attempts[questionId] = [];
  }
  progressData.attempts[questionId].push(attemptData);

  if (attemptData.isCorrect) {
    progressData.correctCount++;
  } else {
    // 添加到错题本（避免重复）
    if (!progressData.wrongQuestions.includes(questionId)) {
      progressData.wrongQuestions.push(questionId);
    }
  }

  saveData();
  return progressData;
};

// 获取进度
const getProgress = () => {
  return {
    ...progressData,
    accuracy: progressData.totalAttempts > 0
      ? Math.round((progressData.correctCount / progressData.totalAttempts) * 100)
      : 0
  };
};

// 获取错题列表
const getWrongQuestions = () => {
  return progressData.wrongQuestions;
};

// 获取统计数据
const getStats = () => {
  return {
    totalAttempts: progressData.totalAttempts,
    correctCount: progressData.correctCount,
    accuracy: progressData.totalAttempts > 0
      ? Math.round((progressData.correctCount / progressData.totalAttempts) * 100)
      : 0,
    wrongCount: progressData.wrongQuestions.length,
    topicStats: progressData.topicStats
  };
};

// 重置进度
const reset = () => {
  progressData = {
    totalAttempts: 0,
    correctCount: 0,
    attempts: {},
    wrongQuestions: [],
    topicStats: {},
    lastUpdated: null
  };
  saveData();
};

module.exports = {
  recordAttempt,
  getProgress,
  getWrongQuestions,
  getStats,
  reset
};
