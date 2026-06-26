// 数据与掷骰逻辑：从原书《你是我的好朋友》解析出的随机表，原文一字不改。
import DATA from '../data.json'

export { DATA }
export const SECTIONS = DATA.flow // 5 段：新篇章 / 历史渊源 / 冒险者 / 上一次见面 / 拉开新的帷幕

// 标准流程：每一步引用 DATA.flow 里的逐字引导语 + 对应随机表
export const STEPS = [
  { sec: 0, n: 1, q: '故事从哪里开始？', slots: [
    { k: 'place',   lab: '起始场景',     t: 'start_place', die: 'd10',  kind: 'titletext' },
    { k: 'region',  lab: '这是你的土地',  t: 'region',      die: 'd10',  kind: 'plain' },
    { k: 'weather', lab: '外面天气怎么样', t: 'weather',     die: 'd10',  kind: 'plain' } ] },
  { sec: 0, n: 2, q: '你们为什么聚集在这里？', slots: [
    { k: 'occasion', lab: '每年纪念的仪式', t: 'occasion', die: 'd10', kind: 'occasion' } ] },
  { sec: 1, n: 3, q: '你们是怎么认识的？', slots: [
    { k: 'acq', lab: '共同故事', t: 'acquaintance', die: 'd100', kind: 'titletext' } ] },
  { sec: 1, n: 4, q: '只有我们知道的地方', slots: [
    { k: 'spot', lab: '有特殊意义的地方', t: 'place', die: 'd100', kind: 'place' } ] },
  { sec: 1, n: 5, q: '替我保管好这个', slots: [
    { k: 'item', lab: '托付的信物', t: 'item', die: 'd100', kind: 'pt' } ] },
  { sec: 1, n: 6, q: '我永远不会原谅你', slots: [
    { k: 'grudge', lab: '怀恨在心的理由', t: 'grudge', die: 'd10', kind: 'plain' } ] },
  { sec: 2, n: 7, q: '我们以前管自己叫', slots: [
    { k: 'name', lab: '三段式队名', t: 'nickname', die: '3d100', kind: 'nickname' } ] },
  { sec: 2, n: 8, q: '你怎么知道可以信任他们', slots: [
    { k: 'signal', lab: '秘密暗号', t: 'signal', die: 'd10', kind: 'plain' } ] },
  { sec: 3, n: 9, q: '我们上一次见面', slots: [
    { k: 'calendar', lab: '上一次见面是', t: 'calendar', die: 'd10',  kind: 'plain' },
    { k: 'recall',   lab: '当时你正…',    t: 'recall',   die: 'd100', kind: 'pt' } ] },
  { sec: 3, n: 10, q: '你对我说的最后一句话是', slots: [
    { k: 'last', lab: '临别赠言', t: 'lastwords', die: 'd100', kind: 'pt' } ] },
  { sec: 4, n: 11, q: '拉开新的帷幕', slots: [] },
]

// 表格速查：按原书目录顺序分组，子表收进同一张「跳转窗口」
export const LOOKUP = [
  { no: '01', name: '故事不一定要从酒馆开始', die: '3d10', q: '从哪里、什么区域、什么天气开始？', subs: [
    { t: 'start_place', kind: 'titletext', label: '起始场景 · d10' },
    { t: 'region',      kind: 'plain',     label: '这是你的土地 · d10' },
    { t: 'weather',     kind: 'plain',     label: '外面天气怎么样 · d10' } ] },
  { no: '02', name: '你们是怎么认识的', die: 'd100', q: '你们的共同故事', subs: [
    { t: 'acquaintance', kind: 'titletext' } ] },
  { no: '03', name: '我们上一次见面', die: 'd10 · d100', q: '上次何时见面、当时你正…', subs: [
    { t: 'calendar', kind: 'plain', label: '我们上一次见面是 · d10' },
    { t: 'recall',   kind: 'pt',    label: '我们上次见面时，你正 · d100' } ] },
  { no: '04', name: '你怎么知道可以信任他们', die: 'd10', q: '辨认彼此的暗号', subs: [
    { t: 'signal', kind: 'plain' } ] },
  { no: '05', name: '你对我说的最后一句话是', die: 'd100', q: '临别那句话', subs: [
    { t: 'lastwords', kind: 'pt' } ] },
  { no: '06', name: '只有我们知道的地方', die: 'd100', q: '对你们意义非凡之地', subs: [
    { t: 'place', kind: 'place' } ] },
  { no: '07', name: '每一年，我们都会纪念', die: '2d10', q: '你们纪念什么、怎么纪念', subs: [
    { t: 'occasion', kind: 'occasion' } ] },
  { no: '08', name: '替我保管好这个', die: 'd100', q: '托付彼此的信物', subs: [
    { t: 'item', kind: 'pt' } ] },
  { no: '09', name: '我们以前管自己叫', die: '3d100', q: '三段式搞笑队名', subs: [
    { t: 'nickname', kind: 'nickname' } ] },
  { no: '10', name: '我永远不会原谅你', die: 'd10', q: '为何怀恨在心', subs: [
    { t: 'grudge', kind: 'plain' } ] },
]

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
    return { source: 'draw', num: `${ia + 1}/${ib + 1}/${ic + 1}`, sealNum: '队',
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
  return { d10: '掷一颗 d10', d100: '掷一颗 d100（两颗 d10）', '3d100': '掷三次 d100，拼一个队名' }[slot.die] || '掷骰'
}

// 总表里某条答案展开成纯文本
export function valText(cur) {
  if (cur.wordsOnly) return '「' + cur.name + '」'
  return (cur.group ? '【' + cur.group + '】' : '') + (cur.title ? cur.title + '　' : '') + (cur.body || cur.plain || '')
}

export function trim(s, n) { s = String(s); return s.length > n ? s.slice(0, n) + '…' : s }
