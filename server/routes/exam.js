const express = require('express');
const router = express.Router();
const papersData = require('../data/papers.json');
const skillsData = require('../data/exam-skills.json');

// 获取真题列表
router.get('/papers', (req, res) => {
  const { year, type } = req.query;
  let papers = papersData.papers;

  if (year) {
    papers = papers.filter(p => p.year === parseInt(year));
  }
  if (type) {
    papers = papers.filter(p => p.type === type);
  }

  res.json({ papers, total: papers.length });
});

// 获取单套真题详情
router.get('/papers/:paperId', (req, res) => {
  const { paperId } = req.params;
  const paper = papersData.papers.find(p => p.id === paperId);
  if (paper) {
    res.json(paper);
  } else {
    res.status(404).json({ error: '真题未找到' });
  }
});

// 获取题型方法论列表
router.get('/skills', (req, res) => {
  const { type } = req.query;
  if (type) {
    const skills = skillsData.skills.filter(s => s.type === type);
    res.json({ skills });
  } else {
    res.json({ skills: skillsData.skills });
  }
});

// 获取指定题型方法论
router.get('/skills/:type', (req, res) => {
  const { type } = req.params;
  const skills = skillsData.skills.filter(s => s.type === type);
  if (skills.length > 0) {
    res.json({ type, skills });
  } else {
    res.status(404).json({ error: '题型方法论未找到' });
  }
});

// 获取考纲策略
router.get('/strategy', (req, res) => {
  res.json({
    overview: {
      english1: {
        name: '英语（一）',
        target: '学术型硕士',
       总分: 100,
        sections: ['完形填空', '阅读理解', '新题型', '翻译', '写作']
      },
      english2: {
        name: '英语（二）',
        target: '专业型硕士',
        总分: 100,
        sections: ['完形填空', '阅读理解', '新题型', '翻译', '写作']
      }
    },
    differences: [
      { aspect: '阅读难度', english1: '较高（学术文章为主）', english2: '中等（应用文章为主）' },
      { aspect: '词汇量', english1: '约5500+', english2: '约5500' },
      { aspect: '长难句', english1: '更多更复杂', english2: '相对较少' },
      { aspect: '作文类型', english1: '图画作文', english2: '图表作文' }
    ],
    phases: [
      { name: '基础阶段', duration: '3-4个月', focus: '词汇+语法+阅读输入' },
      { name: '强化阶段', duration: '2-3个月', focus: '题型技巧+真题精研' },
      { name: '冲刺阶段', duration: '1-2个月', focus: '全真模考+查漏补缺' }
    ]
  });
});

// 获取评分标准
router.get('/scoring', (req, res) => {
  res.json({
    writing: {
      description: '小作文和大作文按内容和语言两维度评分',
      criteria: [
        { score: '17-20', level: '优秀', description: '内容完整，条理清晰，语言准确多样' },
        { score: '13-16', level: '良好', description: '内容较完整，条理较清晰，语言较准确' },
        { score: '9-12', level: '中等', description: '内容基本完整，条理基本清晰' },
        { score: '5-8', level: '较差', description: '内容不完整，条理不清晰' },
        { score: '1-4', level: '差', description: '严重偏题，语言错误多' }
      ]
    },
    translation: {
      description: '翻译按理解和表达两维度评分',
      criteria: [
        { score: '13-15', level: '优秀', description: '理解准确，表达流畅，语言规范' },
        { score: '10-12', level: '良好', description: '理解较准确，表达较流畅' },
        { score: '7-9', level: '中等', description: '理解基本准确，表达基本通顺' },
        { score: '4-6', level: '较差', description: '理解有偏差，表达不通顺' },
        { score: '0-3', level: '差', description: '严重误解原文，表达混乱' }
      ]
    }
  });
});

module.exports = router;
