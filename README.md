# 你是我的好朋友 · 好友赊账簿

《你是我的好朋友》（TTRPG 开团前羁绊工具书）的电子化网页版，使用 **React + Vite** 构建。
把原书的 11 张随机表与「新篇章 → 上一次见面」标准流程电子化——只做排版与交互，**不改动原文一字**。

## 三个模式
- **表格速查** —— 十张表做成卡片墙，点开任意一张在「跳转窗口」(modal) 里单独查阅，不再塞满一页。
- **标准流程** —— 一步一页，贴出原文引导语；每个问题可「砸下骰印」随机抽取，也可「手填」；本页抽取历史以骰印形式堆在左侧「赊账栏」；进度条可单击跳页；最后结账得到「友谊账单」（双栏 QA 总表，答案放大、尽量一页内），可导出 PNG。
- **全部随机** —— 一键掷完所有表，直接跳到账单预览。

## 设计
「好友赊账簿」方向：烛光下的青灰账房，每一次掷骰盖成一枚封蜡骰印。签名元素＝骰印，它既是骰子也是图章，抽取历史与总表都由骰印堆叠而成。

## 开发与构建
```bash
npm install
npm run dev      # 本地开发
npm run build    # 产出 dist/（base 设为 './'，可直接部署到 GitHub Pages 等）
npm run preview  # 预览构建产物
npm run parse    # 从《你是我的好朋友》.md 重新解析出 src/data.json
```

## 结构
```
src/
  App.jsx              视图路由 + 会话状态（useReducer）
  lib/tables.js        随机表数据导入 + 掷骰逻辑
  data.json            由 scripts/parse.py 从原书解析出的结构化数据
  components/
    Home.jsx           封面与三入口
    Lookup.jsx         表格速查卡片墙 + 跳转窗口
    Flow.jsx           标准流程单步页（掷骰 / 手填 / 赊账栏 / 进度）
    Summary.jsx        双栏友谊账单 + 导出图片
    Progress.jsx       骰印进度条
    Seal.jsx           封蜡骰印
    TableView.jsx      单张表排版（速查与流程复用）
  index.css            设计系统
scripts/parse.py       原书 Markdown → src/data.json
《你是我的好朋友》.md     原书译稿（数据来源）
```
