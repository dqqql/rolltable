// 数据与掷骰逻辑：从原书《你是我的好朋友》解析出的随机表，原文一字不改。
import DATA from '../data.json'
import { TABLES_COPY } from '../content/copy'

export { DATA }
export const SECTIONS = DATA.flow // 5 段：新篇章 / 历史渊源 / 冒险者 / 上一次见面 / 拉开新的帷幕

// 标准流程：每一步引用 DATA.flow 里的逐字引导语 + 对应随机表
export const STEPS = TABLES_COPY.steps

// 表格速查：按原书目录顺序分组，子表收进同一张「跳转窗口」
export const LOOKUP = TABLES_COPY.lookup

export const rand = n => Math.floor(Math.random() * n)

export function roll(slot) {
  if (slot.die === '3d100') {
    const a = DATA.nickname
    return buildResult(slot, { ia: rand(a.length), ib: rand(a.length), ic: rand(a.length) })
  }
  return buildResult(slot, rand(DATA[slot.t].length))
}

export function buildResult(slot, idx) {
  if (slot.kind === 'nickname') {
    const a = DATA.nickname, { ia, ib, ic } = idx
    const cn = s => s.split('(')[0].replace(/\s+$/, '').trim()
    const wa = a[ia].a, wb = a[ib].b, wc = a[ic].c
    const name = cn(wa) + '·' + cn(wb) + '·' + cn(wc)
    return { source: 'draw', num: `${ia + 1}/${ib + 1}/${ic + 1}`, sealNum: TABLES_COPY.result.nicknameSeal,
      words: [wa, wb, wc], name, title: name, plain: '「' + name + '」', wordsOnly: true }
  }
  const e = DATA[slot.t][idx], num = idx + 1
  switch (slot.kind) {
    case 'plain':
      return { source: 'draw', num, body: e, plain: e }
    case 'titletext':
      return { source: 'draw', num: e.n || num, title: e.title, body: e.text,
        plain: (e.title ? e.title + '：' : '') + e.text }
    case 'occasion':
      return { source: 'draw', num, title: e.text, body: e.detail, extra: e.detail,
        plain: e.text + '（' + e.detail + '）' }
    case 'place':
      return { source: 'draw', num: e.n || num, group: e.group, title: e.title, body: e.text,
        plain: '【' + e.group + '】' + e.title + '：' + e.text }
    case 'pt':
      return { source: 'draw', num: e.pt || num, body: e.text, plain: e.text }
    default:
      return { source: 'draw', num, body: String(e), plain: String(e) }
  }
}

// 重新采用一枚历史骰印：按 plain 文本回查完整结果
export function readopt(slot, hist) {
  const arr = DATA[slot.t]
  if (arr && slot.kind !== 'nickname') {
    for (let i = 0; i < arr.length; i++) {
      const r = buildResult(slot, i)
      if (r.plain === hist.plain) return r
    }
  }
  return { source: 'draw', num: hist.num, plain: hist.plain, body: hist.plain, title: '' }
}

export function diePrompt(slot) {
  return TABLES_COPY.diePrompts[slot.die] || TABLES_COPY.diePrompts.fallback
}

// 总表里某条答案展开成纯文本
export function valText(cur) {
  if (cur.wordsOnly) return '「' + cur.name + '」'
  return (cur.group ? '【' + cur.group + '】' : '') + (cur.title ? cur.title + '　' : '') + (cur.body || cur.plain || '')
}

export function trim(s, n) { s = String(s); return s.length > n ? s.slice(0, n) + '…' : s }
