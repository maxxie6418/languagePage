const express = require('express');
const router = express.Router();
const grammarData = require('../data/grammar.json');
const vocabularyData = require('../data/vocabulary.json');

// 获取完整语法树
router.get('/grammar', (req, res) => {
  res.json(grammarData);
});

// 获取单个语法节点详情
router.get('/grammar/:nodeId', (req, res) => {
  const { nodeId } = req.params;
  const findNode = (nodes) => {
    for (const node of nodes) {
      if (node.id === nodeId) return node;
      if (node.children) {
        const found = findNode(node.children);
        if (found) return found;
      }
    }
    return null;
  };
  const node = findNode(grammarData.tree);
  if (node) {
    res.json(node);
  } else {
    res.status(404).json({ error: '语法节点未找到' });
  }
});

// 获取词汇词根列表
router.get('/vocabulary/roots', (req, res) => {
  const roots = vocabularyData.families.map(f => ({
    root: f.root,
    meaning: f.meaning,
    wordCount: f.words.length
  }));
  res.json({ roots });
});

// 获取指定词根的词族
router.get('/vocabulary/:root', (req, res) => {
  const { root } = req.params;
  const family = vocabularyData.families.find(
    f => f.root.toLowerCase() === root.toLowerCase()
  );
  if (family) {
    res.json(family);
  } else {
    res.status(404).json({ error: '词根未找到' });
  }
});

// 获取能力图谱数据
router.get('/map', (req, res) => {
  res.json({
    levels: [
      {
        level: 'A2',
        name: '基础',
        description: '能够理解日常用语和基本句型',
        cefr: 'A2',
        skills: ['基础词汇', '简单时态', '基本句型']
      },
      {
        level: 'B1',
        name: '中级',
        description: '能够处理大多数日常情境',
        cefr: 'B1',
        skills: ['中级词汇', '复合时态', '从句入门']
      },
      {
        level: 'B2',
        name: '中高级',
        description: '能够进行较为流畅的交流',
        cefr: 'B2',
        skills: ['学术词汇', '复杂句型', '语篇逻辑']
      },
      {
        level: 'C1',
        name: '高级',
        description: '能够熟练运用语言进行专业交流',
        cefr: 'C1',
        skills: ['高级词汇', '学术写作', '批判阅读']
      }
    ],
    examMapping: {
      'A2-B1': '高考英语',
      'B1-B2': '四级英语',
      'B2-C1': '六级/考研英语'
    }
  });
});

module.exports = router;
