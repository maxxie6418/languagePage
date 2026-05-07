import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    redirect: '/basics/map'
  },
  // 基础学习区
  {
    path: '/basics',
    redirect: '/basics/map'
  },
  {
    path: '/basics/map',
    name: 'BasicsMap',
    component: () => import('../views/basics/Map.vue')
  },
  {
    path: '/basics/vocabulary',
    name: 'Vocabulary',
    component: () => import('../views/basics/Vocabulary.vue')
  },
  {
    path: '/basics/grammar',
    name: 'Grammar',
    component: () => import('../views/basics/Grammar.vue')
  },
  {
    path: '/basics/grammar/:nodeId',
    name: 'GrammarNode',
    component: () => import('../views/basics/GrammarNode.vue')
  },
  // 考研应用区
  {
    path: '/exam',
    redirect: '/exam/strategy'
  },
  {
    path: '/exam/strategy',
    name: 'ExamStrategy',
    component: () => import('../views/exam/Strategy.vue')
  },
  {
    path: '/exam/skills',
    name: 'ExamSkills',
    component: () => import('../views/exam/Skills.vue')
  },
  // 试题中心
  {
    path: '/practice',
    redirect: '/practice/drill'
  },
  {
    path: '/practice/drill',
    name: 'PracticeDrill',
    component: () => import('../views/practice/Drill.vue')
  },
  {
    path: '/test/paper',
    name: 'TestPaper',
    component: () => import('../views/practice/Paper.vue')
  },
  // 用户页面
  {
    path: '/user',
    name: 'UserProgress',
    component: () => import('../views/UserProgress.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
