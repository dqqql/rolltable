#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Parse 《你是我的好朋友》.md into structured JSON for the web tool."""
import re, json, sys

SRC = "/home/dql/rolltable/《你是我的好朋友》.md"
OUT = "/home/dql/rolltable/src/data.json"

text = open(SRC, encoding="utf-8").read()

def clean(s):
    s = s.strip()
    s = s.replace("\\", "")          # drop escape backslashes from md
    s = re.sub(r"\*\*(.+?)\*\*", r"\1", s)  # strip bold
    s = s.replace("<br>", " ").strip()
    return s

# Split into top-level sections by '# Header'
parts = re.split(r"^# (.+)$", text, flags=re.M)
# parts: [pre, title1, body1, title2, body2, ...]
sections = {}
for i in range(1, len(parts), 2):
    title = parts[i].strip()
    body = parts[i+1]
    sections[title] = body

def table_rows(body, ncols):
    """Extract data rows from the first markdown pipe-table in body."""
    rows = []
    for line in body.split("\n"):
        line = line.strip()
        if not line.startswith("|"):
            continue
        cells = [c.strip() for c in line.strip("|").split("|")]
        if len(cells) < ncols:
            continue
        # skip separator rows
        if all(set(c) <= set("-: ") for c in cells):
            continue
        # skip header rows
        if cells[0] in ("点数", "结果"):
            continue
        rows.append(cells)
    return rows

def numbered_items(body, stop_at_heading=True):
    """Parse '\d+. **Title：** text' style list items at start of body."""
    items = []
    for line in body.split("\n"):
        s = line.strip()
        m = re.match(r"^(\d+)\.\s+(.*)$", s)
        if not m:
            continue
        num = int(m.group(1))
        rest = m.group(2)
        # try title：body  (colon may be inside bold)
        c = clean(rest)
        title, sub = "", c
        mm = re.match(r"^(.+?)[：:](.*)$", c)
        if mm:
            title = mm.group(1).strip()
            sub = mm.group(2).strip()
        items.append({"n": num, "title": title, "text": sub, "full": c})
    return items

data = {}

# ---- 1. 故事不一定要从酒馆开始 : start_place (10 narrative) + region + weather
b = sections["故事不一定要从酒馆开始"]
# the 10 alt-location options are the numbered items before '### 这是你的土地'
head = b.split("### 这是你的土地")[0]
start_place = numbered_items(head)
# region table  (between 这是你的土地 and 外面天气)
region_b = b.split("### 这是你的土地")[1].split("### 外面天气怎么样")[0]
region = [clean(r[1]) for r in table_rows(region_b, 2)]
weather_b = b.split("### 外面天气怎么样")[1]
weather = [clean(r[1]) for r in table_rows(weather_b, 2)]
data["start_place"] = [{"n": it["n"], "title": it["title"], "text": it["text"]} for it in start_place]
data["region"] = region
data["weather"] = weather

# ---- 2. 你们是怎么认识的 : acquaintance d100
b = sections["你们是怎么认识的"]
acq = numbered_items(b)
data["acquaintance"] = [{"n": it["n"], "title": it["title"], "text": it["text"]} for it in acq]

# ---- 3. 我们上一次见面是 : calendar d10
b = sections["我们上一次见面是 "] if "我们上一次见面是 " in sections else sections["我们上一次见面是"]
data["calendar"] = [clean(r[1]) for r in table_rows(b, 2)]

# ---- 4. 我们上次见面时，你正 : recall d100
b = sections["我们上次见面时，你正"]
recall = []
for r in table_rows(b, 2):
    recall.append({"pt": clean(r[0]), "text": clean(r[1])})
data["recall"] = recall

# ---- 5. 你怎么知道可以信任他们 : signal d10
b = sections["你怎么知道可以信任他们"]
data["signal"] = [clean(r[1]) for r in table_rows(b, 2)]

# ---- 6. 你对我说的最后一句话是 : lastwords d100
b = sections["你对我说的最后一句话是"]
data["lastwords"] = [{"pt": clean(r[0]), "text": clean(r[1])} for r in table_rows(b, 2)]

# ---- 7. 只有我们知道的地方 : place d100 (grouped bullets)
b = sections["只有我们知道的地方"]
place = []
cur_group = ""
for line in b.split("\n"):
    s = line.strip()
    mg = re.match(r"^###\s+(.*)$", s)
    if mg:
        cur_group = clean(mg.group(1))
        continue
    mi = re.match(r"^-\s+\*\*\s*(\d+)\\?\.\s*(.+?)\*\*[：:]\s*(.*)$", s)
    if mi:
        place.append({"n": int(mi.group(1)), "group": cur_group,
                      "title": clean(mi.group(2)), "text": clean(mi.group(3))})
data["place"] = place

# ---- 8. 每一年，我们都会纪念 : occasion d10 (结果 + 具体细节)
b = sections["每一年，我们都会纪念"]
occ = []
for r in table_rows(b, 3):
    occ.append({"text": clean(r[1]), "detail": clean(r[2])})
data["occasion"] = occ

# ---- 9. 替我保管好这个 : item d100
b = sections["替我保管好这个"]
data["item"] = [{"pt": clean(r[0]), "text": clean(r[1])} for r in table_rows(b, 2)]

# ---- 10. 我们以前管自己叫 : nickname 3d100 (3 word columns)
b = sections["我们以前管自己叫"]
nick = []
for r in table_rows(b, 4):
    nick.append({"a": clean(r[1]), "b": clean(r[2]), "c": clean(r[3])})
data["nickname"] = nick

# ---- 11. 我永远不会原谅你 : grudge d10
b = sections["我永远不会原谅你"]
data["grudge"] = [clean(r[1]) for r in table_rows(b, 2)]

def plain(s):
    s = re.sub(r"!\[.*?\]\(.*?\)", "", s)
    s = re.sub(r"\[(.+?)\]\(.*?\)", r"\1", s)   # [txt](url) -> txt
    s = s.replace("\\", "")
    s = re.sub(r"\*\*(.+?)\*\*", r"\1", s)
    s = re.sub(r"\*(.+?)\*", r"\1", s)
    return s.strip()

# ---- flow guide text (verbatim) from 让派对开始吧！
play = sections["让派对开始吧！"]
sub = re.split(r"^###\s+(.+)$", play, flags=re.M)
wanted = ["新篇章", "历史渊源", "冒险者", "上一次见面", "拉开新的帷幕"]
flow = []
for i in range(1, len(sub), 2):
    head = plain(sub[i]).strip()
    if head not in wanted:
        continue
    body = sub[i+1]
    intro, steps = [], []
    for raw in body.split("\n"):
        s = raw.strip()
        if not s or s.startswith("![") or s.startswith("|"):
            continue
        if set(s) <= set("-"):   # pure separator line
            continue
        m = re.match(r"^(\d+)\.\s+(.*)$", s)
        if m:
            steps.append({"n": int(m.group(1)), "text": plain(m.group(2))})
        else:
            intro.append(plain(s))
    flow.append({"name": head, "intro": "\n".join(intro), "steps": steps})
data["flow"] = flow

# ---- report
counts = {k: (len(v) if isinstance(v, list) else 1) for k, v in data.items()}
print(json.dumps(counts, ensure_ascii=False, indent=2))

json.dump(data, open(OUT, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
print("written:", OUT)
