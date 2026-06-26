export const APP_COPY = {
  brand: 'Greedy Gorgon Press · Fables in Tables',
  title: '我们是挚友啊',
  subtitle: '友谊账簿',
  backHome: '← 回到封面',
  folio: {
    home: '第零场 · 工具',
    lookup: '速查',
    summary: '结账',
    flow: (step, total) => `第 ${step.n} / ${total} 栏`,
  },
}

export const HOME_COPY = {
  hero: {
    title: '酒钱记在友谊头上。',
    paragraphs: [
      '  使用本书没有固定的规则。你可以使用全部或部分的表格。你可以使用它们一次或多次。好吧，也许有一条规则……不，两条规则：一、让玩家来掷骰子，最好是实体的真骰子。这是属于他们的故事。二、相信骰子，遵从骰子。',
    ],
    byline: '—— 开始今晚的旅程',
  },
  seal: { num: '', die: '' },
  cards: [
    { k: 'lookup', ord: '一', t: '表格速查', s: '快速查找', go: '翻阅' },
    { k: 'flow', ord: '二', t: '标准流程', s: '一步一页', go: '开始' },
    { k: 'random', ord: '三', t: '生死有命', s: '全部随机', go: '天命' },
  ],
}

export const FLOW_COPY = {
  history: {
    title: '历史记录',
    meta: '',
    emptyTop: '还没盖印。',
    emptyBottom: '砸一枚试试。',
    reuseTitle: '重新采用这枚',
  },
  guideLabel: stepNum => `原文引导 · 第 ${stepNum} 步`,
  blankStep: '准备工作结束，让我们开始吧！',
  nav: {
    prev: '← 上一步',
    next: '下一步 →',
    summary: '结账 · 查看总表 →',
  },
  slot: {
    emptySeal: '待盖印',
    redraw: '↻ 重新砸印',
    draw: die => `砸印 · ${die}`,
    nicknamePart: index => `队名第 ${index} 段`,
    nicknameWordEmpty: index => `掷出第 ${index} 段`,
    nicknamePreviewEmpty: '三段都落定后，这里会合成队名。',
    manualToggle: '✎ 手填',
    manualPlaceholder: '自己写一条，回车记账…',
    manualSubmit: '记上',
  },
  result: {
    manualTag: '— 手填',
    wordsOnlyHint: '对三个主题词进行再创作，而非简单的拼接。',
  },
}

export const SUMMARY_COPY = {
  export: {
    idle: '⤓ 导出为图片',
    busy: '正在出票…',
    success: '账单已导出 ✓',
    error: '导出失败，请重试',
    filename: '友谊账单.png',
  },
  actions: {
    revise: '← 逐栏修改',
    reroll: '↻ 全部重抽',
  },
  bill: {
    kicker: 'YOU ARE MY GOOD FRIEND · THE TAB',
    title: '账单',
    fallbackSummary: '一伙人的共同往事',
    teamSummary: teamName => `「${teamName}」一伙的共同往事`,
    emptyValue: '（未抽取）',
    emptyState: '账上还是空的——先去掷骰。',
    footer: '这不是永别 · 你是我的好朋友',
    manualTag: ' · 手填',
  },
}

export const LOOKUP_UI_COPY = {
  hint: '单独查阅每张表格。',
  number: no => `No.${no}`,
  count: count => `${count} 条 →`,
  closeAria: '关闭',
}

export const PROGRESS_COPY = {
  ariaLabel: '进度',
  stepTitle: step => `第 ${step.n} 栏 · ${step.q}`,
  summaryTitle: '总表',
  summaryLabel: '账单',
}

export const TABLE_VIEW_COPY = {
  nicknameHeaders: ['#', '词组 1', '词组 2', '词组 3'],
}

export const SEAL_COPY = {
  emptyLabel: '？',
}

export const TABLES_COPY = {
  steps: [
    { sec: 0, n: 1, q: '故事从哪里开始？', slots: [
      { k: 'place', lab: '起始场景', t: 'start_place', die: 'd10', kind: 'titletext' },
      { k: 'region', lab: '这是你的土地', t: 'region', die: 'd10', kind: 'plain' },
      { k: 'weather', lab: '外面天气怎么样', t: 'weather', die: 'd10', kind: 'plain' },
    ] },
    { sec: 0, n: 2, q: '你们为什么聚集在这里？', slots: [
      { k: 'occasion', lab: '每年纪念的仪式', t: 'occasion', die: 'd10', kind: 'occasion' },
    ] },
    { sec: 1, n: 3, q: '你们是怎么认识的？', slots: [
      { k: 'acq', lab: '共同故事', t: 'acquaintance', die: 'd100', kind: 'titletext' },
    ] },
    { sec: 1, n: 4, q: '只有我们知道的地方', slots: [
      { k: 'spot', lab: '有特殊意义的地方', t: 'place', die: 'd100', kind: 'place' },
    ] },
    { sec: 1, n: 5, q: '替我保管好这个', slots: [
      { k: 'item', lab: '托付的信物', t: 'item', die: 'd100', kind: 'pt' },
    ] },
    { sec: 1, n: 6, q: '我永远不会原谅你', slots: [
      { k: 'grudge', lab: '怀恨在心的理由', t: 'grudge', die: 'd10', kind: 'plain' },
    ] },
    { sec: 2, n: 7, q: '我们以前管自己叫', slots: [
      { k: 'name', lab: '三段式队名', t: 'nickname', die: '3d100', kind: 'nickname' },
    ] },
    { sec: 2, n: 8, q: '你怎么知道可以信任他们', slots: [
      { k: 'signal', lab: '秘密暗号', t: 'signal', die: 'd10', kind: 'plain' },
    ] },
    { sec: 3, n: 9, q: '我们上一次见面', slots: [
      { k: 'calendar', lab: '上一次见面是', t: 'calendar', die: 'd10', kind: 'plain' },
      { k: 'recall', lab: '当时你正…', t: 'recall', die: 'd100', kind: 'pt' },
    ] },
    { sec: 3, n: 10, q: '你对我说的最后一句话是', slots: [
      { k: 'last', lab: '临别赠言', t: 'lastwords', die: 'd100', kind: 'pt' },
    ] },
    { sec: 4, n: 11, q: '拉开新的帷幕', slots: [] },
  ],
  lookup: [
    { no: '01', name: '故事不一定要从酒馆开始', die: '3d10', q: '从哪里、什么区域、什么天气开始？', subs: [
      { t: 'start_place', kind: 'titletext', label: '起始场景 · d10' },
      { t: 'region', kind: 'plain', label: '这是你的土地 · d10' },
      { t: 'weather', kind: 'plain', label: '外面天气怎么样 · d10' },
    ] },
    { no: '02', name: '你们是怎么认识的', die: 'd100', q: '你们的共同故事', subs: [
      { t: 'acquaintance', kind: 'titletext' },
    ] },
    { no: '03', name: '我们上一次见面', die: 'd10 · d100', q: '上次何时见面、当时你正…', subs: [
      { t: 'calendar', kind: 'plain', label: '我们上一次见面是 · d10' },
      { t: 'recall', kind: 'pt', label: '我们上次见面时，你正 · d100' },
    ] },
    { no: '04', name: '你怎么知道可以信任他们', die: 'd10', q: '辨认彼此的暗号', subs: [
      { t: 'signal', kind: 'plain' },
    ] },
    { no: '05', name: '你对我说的最后一句话是', die: 'd100', q: '临别那句话', subs: [
      { t: 'lastwords', kind: 'pt' },
    ] },
    { no: '06', name: '只有我们知道的地方', die: 'd100', q: '对你们意义非凡之地', subs: [
      { t: 'place', kind: 'place' },
    ] },
    { no: '07', name: '每一年，我们都会纪念', die: '2d10', q: '你们纪念什么、怎么纪念', subs: [
      { t: 'occasion', kind: 'occasion' },
    ] },
    { no: '08', name: '替我保管好这个', die: 'd100', q: '托付彼此的信物', subs: [
      { t: 'item', kind: 'pt' },
    ] },
    { no: '09', name: '我们以前管自己叫', die: '3d100', q: '三段式搞笑队名', subs: [
      { t: 'nickname', kind: 'nickname' },
    ] },
    { no: '10', name: '我永远不会原谅你', die: 'd10', q: '为何怀恨在心', subs: [
      { t: 'grudge', kind: 'plain' },
    ] },
  ],
  diePrompts: {
    d10: '掷一颗 d10',
    d100: '掷一颗 d100（两颗 d10）',
    '3d100': '掷三次 d100，拼一个队名',
    fallback: '掷骰',
  },
  result: {
    manualNum: '填',
    nicknameSeal: '队',
    nicknamePendingNum: '—',
  },
}
