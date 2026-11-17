# Liquid Glass Design Skill 项目检测报告

| 项目 | 内容 |
| --- | --- |
| 检测对象 | Liquid Glass Design Skill（Apple 风 Web/App 设计系统与 Agent Skill） |
| 版本 | v2.0.0 · commit `d4fbffd`（2026-07-29） |
| 检测日期 | 2026-11-18 |
| 检测范围 | 13 份 Markdown 文档、`tokens.css`、`reference.html`、5 个 `examples/*.html`、CI 与 Lighthouse 配置、6 张截图 |
| 检测方式 | 静态审查 + 真实浏览器 axe-core 扫描 + html-validate + CSS AST 解析 + WCAG 对比度计算 + ARIA 引用校验 + Puppeteer 运行时断言 |
| 总体结论 | **不达发布标准**：设计理念成熟，但项目无法通过自己设定的无障碍与一致性验收线 |

---

## 1. 执行摘要

这是一套**表达力很强、规范密度很高**的设计系统：双轨材质（内容实心、控件玻璃）、反 slop 清单、5 级降级、明暗双主题都写得比多数同类项目细。但检测显示，**“规范 → 实现 → 验收”的闭环没有闭合**，且问题集中在最应该被自动化守住的部分。

核心数字：

- **6/6** 个 HTML 页面未通过 axe-core 的 WCAG A/AA 扫描。
- 共 **3 类规则、10 次规则命中、75 个违规节点**：其中 **71 个颜色对比度**、**1 个严重（critical）ARIA 引用错误**、**3 个 `aria-hidden` 内含可聚焦元素**。
- CI 的 axe 门禁只覆盖 3/6 页面，且带 `--exit`；按当前代码，**该 job 必然失败**。
- `--text-3` 被定义为“仅限大号文字”，却在页面中被用于 **34 处 10–14px 文本**，对比度仅 3.33–3.62:1（AA 要求 4.5:1）。
- 触控目标 ≥44px 的承诺，在 `components.md` 与 `account.html` 中至少 **9 处**不成立（最小 24×24）。
- 声称“覆盖所有 `.glass-*` 类”的 5 级降级阶梯，实际漏掉 **4 个在用的 glass 类**（另有 2 个基类未纳入）；`tokens.css` 与 3 个示例**完全没有 `prefers-reduced-motion`**。
- 规范与实现存在可直接复现的漂移：z-index、安全区、行高、图标体系、ARIA 模式、Tab 键盘可达性。

一句话评价：**“写得像一流设计系统，验收却像 demo 拼装。”**

---

## 2. 评分

评分为本次检测的主观工程判断，满分 10 分。

| 维度 | 分数 | 主要依据 |
| --- | ---: | --- |
| 设计语言与文档表达 | 8.5 | 双轨材质模型清晰，反 slop 规则具体、有辨识度 |
| Token 体系结构 | 7.5 | 分类完整、明暗齐全，但语义误用与覆盖缺口明显 |
| 规范 ↔ 实现一致性 | 4.5 | z-index、行高、图标、ARIA、safe-area 多处冲突 |
| 无障碍（WCAG AA） | 3.0 | 6/6 页面失败，71 个对比度节点，3 个隐藏焦点问题 |
| 组件可用性 | 5.0 | 触控目标、焦点可见性、状态同步均有硬伤 |
| 工程质量与 CI | 4.5 | 仅测 3/6 页面，无本地脚本，依赖未锁定 |
| 性能 | 5.5 | 6 页 82 条 `backdrop-filter` 声明，动画 blur，无预算约束 |
| 可维护性 | 5.5 | `tokens.css`、`components.md`、`reference.html` 三份数据源并存 |
| **综合** | **5.5** | 理念优秀，交付质量未达自身标准 |

---

## 3. 阻断级问题（P0）

### P0-1 无障碍门禁整体失效，CI 必然红

**证据（axe-core 4.14.1 + Chrome for Testing 155，1280×900）：**

| 页面 | 命中规则 | 违规节点 | 明细 |
| --- | ---: | ---: | --- |
| `reference.html` | 2 | 22 | `color-contrast` 21、`aria-hidden-focus` 1 |
| `examples/account.html` | 2 | 24 | `color-contrast` 23、`aria-hidden-focus` 1 |
| `examples/wallet.html` | 3 | 11 | `color-contrast` 9、`aria-hidden-focus` 1、`aria-valid-attr-value` 1（critical） |
| `examples/liquid-controls.html` | 1 | 5 | `color-contrast` 5 |
| `examples/toolbar.html` | 1 | 6 | `color-contrast` 6 |
| `examples/sidebar.html` | 1 | 7 | `color-contrast` 7 |
| **合计** | **10 次** | **75** | 71 对比度 + 4 ARIA |

CI 的 axe job 只扫描 `reference.html`、`account.html`、`wallet.html`（[accessibility-ci.yml](.github/workflows/accessibility-ci.yml)），这 3 页已包含全部 4 个 ARIA 违规与 53 个对比度节点，因此**该 job 不可能通过**。另外 3 个新示例的 18 个对比度节点则完全无人监管。

**根因不是个别颜色，而是 token 被当成了色板：**

- [tokens.css:15](tokens.css#L15) 明确写明 `--text-3` 为 “LARGE TEXT ONLY (WCAG AA requires 18pt+)”，但全项目有 **34 处**把它用于 10–14px 文本。
- [tokens.css:16](tokens.css#L16) 写明 `--text-4` 为 “DECORATIVE ONLY … NOT for readable text”，[toolbar.html:96](examples/toolbar.html#L96) 却用它做搜索框 placeholder（2.21:1）。
- 实测对比度：

| 前景 / 背景 | 对比度 | 判定 |
| --- | ---: | --- |
| `--text-3 #86868b` / 白 | 3.62:1 | 正文失败 |
| `--text-3` / `--bg #f5f5f7` | 3.33:1 | 正文失败 |
| `--text-3`（暗色 `#8e8e93`）/ `#2c2c2e` | 4.27:1 | 仍失败 |
| `--text-4 #aeaeb2` / 白 | 2.21:1 | 占位符失败 |
| `--success-fg #1f8a3b` / success 浅底 | 4.14:1 | 失败（`reference.html` 状态标签） |
| `--danger #ff3b30` / 白（14px） | 3.55:1 | 失败（`components.md:429,530`） |
| `--focus-ring` 合成色 / 白 | ≈1.29:1 | 焦点指示失败 |

**典型受害者：** `account.html` 的 eyebrow、存储说明、账单状态、页脚（[55](examples/account.html#L55)、[102](examples/account.html#L102)、[115](examples/account.html#L115)、[145](examples/account.html#L145)）；`wallet.html` 的分区标题、交易副标题、Tab 标签（[78](examples/wallet.html#L78)、[87](examples/wallet.html#L87)、[94](examples/wallet.html#L94)）；`reference.html` 的 21 个节点；`sidebar.html` 的 7 个节点。

**影响：** 项目对外宣称 WCAG AA，实际所有示例都不达标；而示例是使用者复制的主要对象，问题会被成倍放大。

**修复建议：**

1. 所有 <18.66px 的 `--text-3` 一律改为 `--text-2 #6e6e73`（白底 5.07:1、`--bg` 4.66:1）。
2. 新增语义 token：`--text-caption: #6e6e73`，并在文档中禁止 caption 使用 `--text-3/4`。
3. placeholder 改用 `--text-2`；禁止 `--text-4` 出现在任何可读文本。
4. `--success-fg` 调深（如 `#1a7f37`，当前在 success 浅底仅 4.14:1）；14px 红字统一用 `--danger-fg`，`--danger` 只作填充色。
5. axe 覆盖全部 6 页，阈值设为 0 violations，而不是 Lighthouse 的 0.9。

---

### P0-2 关闭态弹层仍可 Tab 进入（3 个页面）

**证据：**

- axe：`reference.html` `#mSheet`、`account.html` `#sheet`、`wallet.html` `#sheet` 均命中 `aria-hidden-focus`。
- html-validate：7 条 `hidden-focusable`（account 3、wallet 3、reference 1）。
- 对应 DOM：[account.html:325](examples/account.html#L325)、[wallet.html:156](examples/wallet.html#L156)、[reference.html:465](reference.html#L465)。

关闭时只做了 `aria-hidden="true"` + `opacity:0` + `pointer-events:none`，**元素仍在 Tab 序列中**。键盘用户会进入一个视觉上不存在、读屏又被隐藏的弹层，这是典型的“焦点黑洞”。

**修复：** 关闭时使用 `hidden` 或 `inert`，不要只改 `aria-hidden`；若不支持 `inert`，对内部可聚焦元素批量设置 `tabindex="-1"`，打开时恢复。`aria-hidden` 与可聚焦内容不能同时存在。

```js
function setSheet(open) {
  sheet.inert = !open;          // 真正移出焦点/无障碍树
  sheet.hidden = !open;         // 同时移出渲染树
  sheet.setAttribute('aria-hidden', String(!open));
  if (open) closeBtn.focus();
  else lastFocused?.focus();
}
```

---

### P0-3 钱包页 Tab 的 ARIA 引用无效（critical）

**证据：** axe 在 `#tab-wallet` 报 `aria-valid-attr-value`（critical）。`aria-controls` 指向 `walletPanel` / `cardsPanel` / `profilePanel`，但页面中不存在这些 id（[wallet.html:148-151](examples/wallet.html#L148-L151)）。

同时存在模式错误：

- “添加”是一个打开对话框的动作，却被放进 `role="tablist"` 充当 `role="tab"`（[wallet.html:150](examples/wallet.html#L150)）。Tab 不是按钮，`aria-haspopup="dialog"` 不能修正其角色。
- 三个导航 Tab 点击只切换高亮，没有对应 tabpanel；`aria-controls` 只是装饰。
- 该模式来自规范本身：[app.md:108-114](app.md#L108-L114) 与 [components.md:306-313](components.md#L306-L313) 都给出了“无 `href` 的 `<a role="tab">`”，**键盘根本无法聚焦**，是上述错误的源头。

**修复：**

- 要么实现真正的 tabs（`aria-controls` 指向真实 panel、`tabpanel` + roving tabindex + 方向键）。
- 要么改用 `role="group"` + `aria-pressed`（`components.md:343` 的 segmented 已经是对的）。
- 把“添加”移出 tablist，改成独立 `<button>`。

---

### P0-4 “5 级降级覆盖所有 `.glass-*` 类”不成立

**证据：** 该声明出现在 [design-system.md:169](design-system.md#L169)、[components.md:234](components.md#L234)、[checklist.md:19](checklist.md#L19)、[CONTRIBUTING.md:51](CONTRIBUTING.md#L51)。实际 `tokens.css` 的降级选择器只列出 12 个类（[tokens.css:225-296](tokens.css#L225-L296)）。组件库中仍在使用的 `glass-check`、`glass-radio`、`glass-slider`、`glass-context` 均未出现在阶梯中；另有基类 `glass-base`、`glass-clear-base` 也未纳入（`glass-clear-base` 目前甚至没有使用处）。

这些类**没有** reduced-transparency / contrast / print / `@supports` 回退。以 checkbox/radio 为例，它们自身带 `backdrop-filter` 和半透明背景（[components.md:487-500](components.md#L487-L500)），在对比度增强或不支持 blur 的环境下会直接失去材质保障。示例页更直接：`account.html` 用 `.nav` / `.sheet`，`wallet.html` 用 `.navc` / `.tabbar` / `.sheet`，`liquid-controls.html` 用 `.ctl` / `.slider-thumb` / `.check-face`，全部绕过类名匹配的阶梯。

**媒体查询实测矩阵（页面自身的显式查询）：**

| 文件 | reduced-motion | reduced-transparency | contrast | reduced-data | print | @supports |
| --- | :-: | :-: | :-: | :-: | :-: | :-: |
| `tokens.css` | **—** | Y | Y | Y | Y | Y |
| `reference.html` | Y | Y† | Y† | Y† | Y† | Y† |
| `account.html` | Y | Y | Y | — | — | — |
| `wallet.html` | Y | Y | **—** | — | — | — |
| `toolbar.html` | **—** | **—** | **—** | — | — | — |
| `sidebar.html` | **—** | **—** | **—** | — | — | — |
| `liquid-controls.html` | **—** | **—** | **—** | — | — | — |

`†` 表示页面自身没有这些媒体查询，但通过 `<link>` 引入的 `tokens.css` 会对其枚举的 `.glass-*` 类生效；未被枚举的类仍无回退。`reference.html` 的透明度/对比度/数据节省面板是静态演示，不是真实媒体查询。

**影响：** “自动覆盖”是安全承诺。新组件只要换一个类名就静默失去降级能力；而最需要 reduced-motion 的 `liquid-controls.html`（大量 scale/blur 动效）恰恰完全没有适配。

**修复：** 不要把降级绑在类名枚举上。改为 `[data-glass]` 或统一 `.glass-surface` 基类，所有材质都带该属性；并在 CI 中加一条“新增 glass 类必须出现在降级测试矩阵”的检查。`tokens.css` 增加全局 `prefers-reduced-motion` 兜底。

---

## 4. 高优先级问题（P1）

### P1-1 触控目标系统性小于 44px

| 位置 | 元素 | 实测 | 要求 |
| --- | --- | ---: | ---: |
| [account.html:105](examples/account.html#L105) | 开关 `.tg` | 44×26 | ≥44×44 |
| [account.html:79](examples/account.html#L79) | 套餐 CTA | 高 40 | ≥44 |
| [account.html:122](examples/account.html#L122) | “取消订阅”文字链 | 81×22 | ≥44×44 |
| [components.md:361](components.md#L361) | glass switch | 51×31 | ≥44 |
| [components.md:388](components.md#L388) | glass slider | 高 31 | ≥44 |
| [components.md:487](components.md#L487) | glass checkbox | 24×24 | ≥44 |
| [components.md:498](components.md#L498) | glass radio | 24×24 | ≥44 |
| [components.md:285](components.md#L285) | 工具栏按钮 | 36×36 | ≥44 |
| [components.md:420-428](components.md#L420-L428) | 弹出菜单行 | 高 40 | ≥44 |

`components.md:204` 自己写着 “Touch target ≥ 44px high”，`README.md:89` 也承诺 ≥44px。更讽刺的是：较新的 `toolbar.html` / `sidebar.html` / `liquid-controls.html` 已经做到 44px，**文档组件库反而没回填**。

**修复：** 给每个控件加 44px 的透明点击层或 `min-height:44px`；视觉尺寸可保持 24/31px，但命中区必须是 44。

---

### P1-2 焦点可见性不足（1.29:1）

`--focus-ring` 是 `rgba(0,113,227,0.18)` 的半透明光晕（[tokens.css:24](tokens.css#L24)），合成到白底约 `#d1e5fa`，对比度仅 **1.29:1**。而 `reference.html`、`toolbar.html`、`sidebar.html`、`liquid-controls.html` 都设置了 `outline:none`，只留这圈光晕。WCAG 1.4.11 对焦点指示器要求 3:1，这里差了一个数量级；低视力/强光环境下键盘用户几乎看不到焦点。

`account.html` / `wallet.html` 又完全没有 `:focus-visible` 规则，退化为浏览器默认焦点环。同一个系统出现两种焦点语言。

**修复：**

```css
:where(button, a, [tabindex]):focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
  box-shadow: none; /* 或保留光晕作为增强 */
}
```

---

### P1-3 侧边栏在移动端“折叠后无法展开”，且 aria 状态不同步

CSS 在 ≤760px 强制 `.sidebar{width:72px}` 并隐藏标签（[sidebar.html:139-146](examples/sidebar.html#L139-L146)），JS 的 `setCollapsed` 只切换 `is-collapsed` 类。结果是：

```
375px 视口实测：
初始      width=72px  aria-expanded=true
点击一次  width=72px  aria-expanded=false
再点一次  width=72px  aria-expanded=true
```

宽度始终 72px，按钮却在 true/false 之间来回切换。这同时违反了 `motion.md` 的“可访问状态与视觉状态绝不同步失败”原则。用户看到的是一个永远展不开、却在“已折叠/已展开”之间撒谎的按钮。

**修复：** 移动端不要用纯 CSS 强制折叠；把断点状态写进 JS（`matchMedia`），或干脆在移动端隐藏折叠按钮，改用抽屉式侧栏。

---

### P1-4 `prefers-reduced-motion` 下参考弹层错位 240px

[reference.html:190-192](reference.html#L190-L192)：

```css
@media (prefers-reduced-motion: reduce) {
  #mSheet { transition: opacity .2s ease !important; transform: none !important; }
}
```

但 `#mSheet` 的水平居中依赖 `translateX(-50%)`（[reference.html:465](reference.html#L465)）。`transform:none !important` 把居中一起清掉。实测 1280px 视口：

```
left=640, right=1120（正确应为 left=400, right=880）
```

弹层整体右移 240px，直接压到视口右侧。这是“偏好减少动效”用户才能触发的真实视觉 bug。修复：只禁用位移/缩放，保留 `translateX(-50%)`。

---

### P1-5 钱包弹层没有关闭控件，选项点击无响应

运行时实测：

```
打开弹层后 aria-hidden=false
点击“添加银行卡” → aria-hidden 仍为 false
弹层内可点击元素仅有：["添加银行卡","发起转账","扫码收款"]
```

即：三个选项点击都不关闭、也不产生任何反馈；弹层内**没有取消/关闭按钮**，只能点遮罩或按 Esc。触屏用户尤其容易卡住。`aria-modal="true"` 的对话框应提供显式关闭路径与选择结果。

**修复：** 增加“取消”按钮；选项点击后关闭并写入结果；把 `role="button"` 的 `div.opt` 换成原生 `<button>`。

---

### P1-6 Toast 对读屏用户不生效

[liquid-controls.html:205-211](examples/liquid-controls.html#L205-L211) 的 toast 只切换 `opacity` 与 `transform`，文本从未变化；[liquid-controls.html:472-476](examples/liquid-controls.html#L472-L476) 只 `classList.add('is-show')`。`role="status"`/`aria-live` 只在**内容变化**时播报，单纯改透明度不会触发。因此视觉用户看到提示，读屏用户什么也听不到。

另外它的 `z-index` 用了 `--z-fab`（[206](examples/liquid-controls.html#L206)），与 FAB 同层，语义上应使用 `--z-toast`。

**修复：** 每次显示时写入/清空 `textContent`，或使用两个交替的 live region；用 `hidden` 控制显隐而不是 opacity。

---

### P1-7 图标体系被 3 个示例绕过

`icons.md` 规定 Lucide 线性 SVG 图标（20 枚）。实际：

- `sidebar.html` 使用 `◎ ▤ ⚐ ☻ ⚙ ‹` 文本字形；
- `toolbar.html` 使用 `‹ › ⋯`；
- `liquid-controls.html` 使用 `+ ✓ ▾ ?`。

`wallet.html` 是唯一严格使用 SVG 的示例（这点做得对）。同一套系统里 3/5 示例违反图标规范，会直接破坏跨页一致性，也让“copy-paste”组件的产出不可控。`reference.html` 另有一类相关问题：演示按钮使用 `span role="button" tabindex="0"`，却没有 Enter/Space 处理。

---

### P1-8 规范里的 Tab Bar 本身不可键盘操作

[app.md:108-114](app.md#L108-L114)：

```html
<a class="tab on" role="tab" aria-selected="true" aria-current="page">
```

没有 `href`、没有 `tabindex` 的 `<a>` **不在 Tab 序列内**。`role="tab"` 只是给它一个语义，不会让它可聚焦。再叠加 `font-size:10px; color:var(--text-3)`（[app.md:131](app.md#L131)）的对比度问题，这个“官方 Tab”同时不可键盘访问且不可读。

`components.md:306-313` 复制了同样的错误。`wallet.html` 改成了 `tabindex` 可聚焦的 div，算局部修复，但仍未补 panel。

---

### P1-9 z-index / 安全区规范漂移，且层级语义自相矛盾

`app.md:9` 要求 “Use the exact spec below verbatim”，但 `wallet.html` 有三处关键值不同：

| 元素 | `app.md` 规范 | `wallet.html` 实现 |
| --- | --- | --- |
| Home indicator | `--z-popover` 80（[app.md:49](app.md#L49)） | `--z-toast` 100（[wallet.html:98](examples/wallet.html#L98)） |
| Scrim | `--z-sticky` 50（[app.md:157](app.md#L157)） | `--z-fab` 70（[wallet.html:100](examples/wallet.html#L100)） |
| Sheet | `--z-fab` 70（[app.md:147](app.md#L147)） | `--z-modal` 90（[wallet.html:104](examples/wallet.html#L104)） |
| Tab bar 下内边距 | 34px（[app.md:119](app.md#L119)） | 22px（[wallet.html:90](examples/wallet.html#L90)） |
| Home bar 尺寸 | 139×5（[app.md:16](app.md#L16)） | 140×5（[wallet.html:97](examples/wallet.html#L97)） |

其中 `app.md` 自身也有层级设计缺陷：把模态 sheet 放在 `--z-fab`(70)、popover 放在 80、home indicator 放在 80，意味着**任何 popover 都可能盖住模态层**；而 home indicator 没有独立的系统层 token，只能借用 popover，最终 wallet 不得不借用 toast(100) 来救场。`liquid-controls.html` 的 toast 又用了 `--z-fab`。

**修复：** 明确层级契约（content < sticky < sidebar < fab < overlay/scrim < modal < popover/toast < system chrome），新增 `--z-system`，并让 `app.md` 与 `wallet.html` 用同一组 token。

---

### P1-10 玻璃叠玻璃 + 动画 blur 的性能与可读性风险

- `liquid-controls.html` 的 `.ctl` 是玻璃卡片（[92-100](examples/liquid-controls.html#L92-L100)），内部又放玻璃 `.switch` / `.check-face`（[76-77](examples/liquid-controls.html#L76-L77)、[149-150](examples/liquid-controls.html#L149-L150)），直接违反 [design-system.md:192](design-system.md#L192) “Never stack a light translucent surface on another”。
- 6 个页面合计 **82 条 `backdrop-filter` 声明**（41 组无前缀 + `-webkit-` 前缀对），`tokens.css` 另有 15 条；其中 **13 处 transition 显式动画 blur/saturation**（如 [liquid-controls.html:38-39](examples/liquid-controls.html#L38-L39)、[reference.html:65-66](reference.html#L65-L66)）。`will-change` 为 0，也没有 `@media (hover:hover)` 限制。
- [checklist.md:65](checklist.md#L65) 同时写着“blur+scale+opacity 一起”与“只动画 transform/opacity”——**自相矛盾**。实现选择了动画 blur，代价是低端移动设备上的持续重绘。
- Lighthouse 性能阈值只有 `warn 0.7`（[.lighthouserc.json](.lighthouserc.json)），这类回退不会让 CI 变红。

**修复：** 只在 `hover:hover` 设备上动画材质；降低同时存在的玻璃层数；对 blur 用一次性过渡或直接交叉淡入；把性能阈值提到 `error 0.85`。

---

## 5. 中优先级问题（P2）

| # | 问题 | 证据 | 影响 |
| --- | --- | --- | --- |
| 1 | 行高铁律与实现冲突 | 规范要求长正文 ≥1.85（[design-system.md:57,62](design-system.md#L57)、[checklist.md:27](checklist.md#L27)），所有组件与示例均为 1.6（[components.md:26](components.md#L26)、[109](components.md#L109)） | 自检清单永远无法通过 |
| 2 | CONTRIBUTING 过期 | [CONTRIBUTING.md:10](CONTRIBUTING.md#L10) 仍写 “both examples”，实际 5 个 | 贡献者不知道新页面存在 |
| 3 | CHANGELOG 事实错误 | [CHANGELOG.md:11](CHANGELOG.md#L11) 标题写 “Fixed WCAG contrast violation”，但同一行括号里自认换成 `--text-3` 后只有 ~3.5:1，仍不达 4.5:1；[19](CHANGELOG.md#L19) 称 axe 覆盖 “all three pages”，同版本却新增了 3 页 | 误导维护者与用户 |
| 4 | 图标数量自相矛盾 | `icons.md:41` 写明 20 枚，CHANGELOG 两处仍写 “~15”（[39](CHANGELOG.md#L39)、[88](CHANGELOG.md#L88)） | 文档可信度下降 |
| 5 | README 未收录新示例 | README 仅介绍 account / wallet，未提 toolbar / sidebar / liquid-controls；截图也只有 6 张旧图 | 新能力不可发现 |
| 6 | 无本地校验入口 | 无 `package.json`、无 scripts、无 lockfile；只能靠 CI | 贡献者无法本地复现门禁 |
| 7 | CI 依赖未锁定 | `npm install -g @axe-core/cli` 无版本；无缓存、无 timeout、无 `permissions` 最小化 | 构建不可复现，存在供应链风险 |
| 8 | CI 不校验 HTML/CSS | 没有 html-validate、链接检查、token 一致性检查、视觉回归 | 本次发现 59 条结构问题（另有 195 条内联样式告警）无人拦截 |
| 9 | Token 双份数据源 | `reference.html` 的 `DATA` 又硬编码了颜色、字号、圆角、阴影（[reference.html](reference.html)）；CHANGELOG 却称 “eliminates token drift” | 已存在漂移风险，且会继续扩大 |
| 10 | 原生语义使用不足 | html-validate 报 44 条 `prefer-native-element`（`div role=list`、`span role=button` 等） | 键盘/读屏行为依赖手写补丁 |
| 11 | 假按钮不可操作 | `reference.html:271-272` 的 `span role="button" tabindex="0"` 无 Enter/Space 处理 | 键盘用户点不动 |
| 12 | 钱包小屏横向溢出 | `.device` 393px + `body` 40px 内边距，在 ≤432px 视口首次横向溢出（390px 实测 `scrollWidth=433`，无媒体查询） | 手机直接打开示例会裁切/横滚 |
| 13 | 硬编码绕过 token | `#e2e2e7` 头像（[account:50](examples/account.html#L50)）、`rgba(0,0,0,0.12)` 开关轨道（[liquid:104](examples/liquid-controls.html#L104)）、多处 `999px` / `26px` | 主题切换与全局调整失效 |
| 14 | `--success-fg` / `--danger` 语义误用 | `success-fg` 在 success 浅底 4.14:1；`danger` 在 14px 文本上 3.55:1 | 状态文字不可读 |
| 15 | “materialize” 演示未动画 blur | [reference.html:465](reference.html#L465) 的 transition 只有 opacity/transform/box-shadow | 与 motion.md 的材质化定义不符 |
| 16 | `prefers-reduced-data` 无主流稳定浏览器支持 | 被当作 5 级中的一级（[design-system.md:174](design-system.md#L174)） | “5 级”实际约等于 4 级 |
| 17 | HTML 小问题 | `lang="zh"`（其余为 zh-CN）、`title` 中的裸 `&`、reference 多处 `<button>/<input>` 缺 `type` | 规范性瑕疵 |
| 18 | 缺少视觉回归/键盘测试 | 无 Playwright/Cypress，无截图对比 | 本次多个视觉 bug 只能靠人眼发现 |

---

## 6. 做得好的地方

为避免报告失衡，以下部分应当保留：

1. **双轨材质模型清楚**：内容实心、控件玻璃，解决了“全站玻璃导致可读性崩塌”的常见问题。
2. **反 slop 规则具体**：没有 lorem、没有 emoji 图标、金额灰阶、单一强调色、统一面板而非卡片堆叠，示例确实执行了大部分。
3. **Token 注释诚实**：`--text-3/4` 明确标注了对比度限制与使用边界（问题在实现没有遵守）。
4. **渐进增强意识**：`@supports`、print、reduced-transparency 的回退方向正确，超出多数同类项目。
5. **真实内容与工程配套**：有截图、双语文档、CI、CHANGELOG，说明作者有交付意识。
6. **新的 toolbar/sidebar/liquid 示例在触控目标上已做到 44px**，说明团队知道正确做法，只是没有回填到规范与旧示例。

---

## 7. 根因分析

1. **规则是散文，不是门禁。** 44px、4.5:1、1.85 行高、三件套媒体查询都写在 Markdown 里，但没有 lint/test 去执行；于是文档越写越对，代码越走越偏。
2. **三份事实来源。** `tokens.css`（token）、`components.md`（组件 CSS）、`reference.html`（`DATA` 数组）各自维护一份数值，没有生成或对账机制。
3. **把“层级灰”当成“弱化色”。** `--text-3` 的定位是“大号辅助文字”，却被当成通用 muted 色使用，导致 34 处小字失败。
4. **降级按类名枚举。** 新增 `.glass-check/.glass-radio/.glass-slider/.glass-context` 时没有同步阶梯；示例又自定义类名，形成双重漏网。
5. **发布流程未同步文档与 CI。** 同一次发布新增 3 个示例，却没有更新 README、CONTRIBUTING、截图和 axe 扫描列表。
6. **性能无预算。** 玻璃是核心卖点，但只有 warn 级 Lighthouse 阈值，动画 blur 的成本没有进入验收。

---

## 8. 改进路线图

### 立即（阻断项，建议 1 个迭代内）

1. 把 34 处 <18.66px 的 `--text-3` 改为 `--text-2`；placeholder 改 `--text-2`；修正 `success-fg`/`danger` 用法。
2. 三个弹层加 `inert`/`hidden`；修复 wallet 的 `aria-controls` 与“添加”角色。
3. 焦点环改为不透明 2px `--accent` + offset。
4. axe 扫描扩到全部 6 页并设 0 容忍；在合并前跑通。
5. 修复 `reference.html` reduced-motion 下的 `transform:none` 居中 bug。
6. 给 wallet 弹层加关闭按钮与选项处理。

### 短期（1–2 个迭代）

1. `components.md` 全部控件补 44px 命中区（switch/slider/check/radio/toolbar/menu）。
2. `tokens.css` 增加 `prefers-reduced-motion` 兜底；`toolbar/sidebar/liquid` 补三件套媒体查询。
3. 把降级改为 `[data-glass]`/`.glass-surface` 统一基类，并补齐遗漏的 checklist/radio/slider/context 与两个基类。
4. 修复 sidebar 移动端展开与 `aria-expanded` 同步。
5. 统一 z-index 契约，新增 `--z-system`；让 `wallet.html` 回到 `app.md` 或反过来修规范。
6. 更新 README / CONTRIBUTING / CHANGELOG / icons 数量，把 3 个新示例加入文档与截图。
7. 明确行高规则：UI 文本 1.6，长正文 1.85，并改掉“铁律”表述或改代码。

### 中期（系统性）

1. 增加 `package.json` 与 scripts：`validate:html`、`test:a11y`、`test:contrast`、`test:links`、`test:visual`。
2. 用 token JSON 生成 `reference.html` 的 `DATA` 与示例，消灭双份数据源。
3. 引入 Playwright：键盘 Tab 序列、焦点回归、弹层、移动端断点截图对比。
4. Lighthouse：a11y `error 1.0`、performance `error 0.85`；增加 backdrop 层数预算。
5. 增加 token 对比度单测（对每个文本/背景组合计算 4.5:1）。
6. 减少玻璃嵌套与 blur 动画，移动端按 `hover:hover` 与 `Save-Data` 降级。

---

## 9. 附录

### A. 检测环境与命令

- Node.js 24.1.0；axe-core **4.14.1**；html-validate **11.4.0**；Google Chrome for Testing **155.0.8059.39**（headless）。
- axe：把 axe-core 4.14.1 注入真实 Chrome 155，`axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a','wcag2aa','wcag21a','wcag21aa'] } })`，6 个页面、1280×900。
- 静态：`html-validate --formatter=json reference.html examples/*.html`（原始 254 条；排除 195 条 `no-inline-style` 后为 59 条结构问题）。
- CSS：`css-tree` 解析 `tokens.css` 通过，无语法错误。
- ARIA：脚本比对 `aria-controls/labelledby/describedby` 与 `id` 集合。
- 运行时：Puppeteer 断言侧边栏折叠、reduced-motion 弹层矩形、钱包选项点击、开关命中区。

### B. 复现要点

```bash
# 1. 任意静态服务器
python3 -m http.server 8123

# 2. axe（真实 Chrome）
npx @axe-core/cli http://127.0.0.1:8123/reference.html \
  --tags wcag2a,wcag2aa,wcag21a,wcag21aa --exit

# 3. HTML 结构
npx html-validate reference.html examples/*.html
```

### C. 检测局限

- 未做真实读屏（VoiceOver/NVDA）走查；ARIA 结论来自 axe 与结构校验。
- 未在真机测 GPU 性能；性能结论来自代码与层数分析。
- 颜色对比度以纯色合成计算，玻璃叠加区域的实际对比度可能更低（只会更差，不会更好）。
- 截图仅做存在性与尺寸检查，未做像素级视觉回归。

---

## 10. 回测验证（独立复跑）

本节是对上文结论的二次验证，不复用上一轮结论：重新启动静态服务器，重新注入 axe-core，重新执行 Puppeteer 断言，并用脚本重算所有计数类指标。

### 10.1 复核结果总览

| 验证对象 | 复核方式 | 结果 |
| --- | --- | --- |
| 6/6 页面 axe 失败 | 真实 Chrome 155 + axe-core 4.14.1 重跑 | **成立**，每页违规数完全一致 |
| 75 个违规节点 | 逐页节点计数 | **成立**：22+24+11+5+6+7=75 |
| 71 个对比度 + 4 个 ARIA | 规则拆分 | **成立**：21+23+9+5+6+7=71；ARIA 1+1+2=4 |
| CI 必然红 | 检查被扫 3 页的违规 | **成立**：3 页共 57 节点（53 对比度 + 4 ARIA），`--exit` 必失败 |
| 关闭态弹层可聚焦 | axe + html-validate + DOM 检查 | **成立**：3 页各 1 个 `aria-hidden-focus`，7 条 `hidden-focusable` |
| wallet ARIA 引用 critical | axe + id 集合比对 | **成立**：`walletPanel/cardsPanel/profilePanel` 均不存在 |
| `--text-3` 系统性误用 | 逐行检查 6 页 | **成立**：6 页共 34 次引用；19 条 `color:var(--text-3)` 规则中 17 条显式写有 <18.66px 字号，其余 2 条继承小字上下文 |
| 降级阶梯漏类 | 对比阶梯选择器与组件类名 | **成立**：缺 `glass-check/radio/slider/context` 与 `base/clear-base` |
| 侧边栏移动端不可展开 | 375px 实跑点击 | **成立**：宽度恒为 72px，`aria-expanded` 在 true/false 间切换 |
| reduced-motion 弹层错位 | 模拟 reduce 后测量矩形 | **成立**：`left=640, right=1120`（应为 400–880） |
| wallet 弹层无关闭路径 | 点击选项后读 `aria-hidden` | **成立**：点击后仍为 `false`，可点元素仅 3 个选项 |
| toast 不播报 | 检查 `role/aria-live` 与文本 | **成立**：文本前后完全相同，仅 opacity/transform 变化 |
| 触控目标不足 | 实测命中区 | **成立 9 处**（见 10.3 的修正说明） |
| 横向溢出 | 多宽度扫描 | **成立**，临界值为 **432px**（原写 473px，已修正） |
| 行号引用 | 解析 71 个行号锚点并打印目标行 | **成立**：71 个引用均指向声称内容，仅 1 处需下移 1 行 |

### 10.2 关键运行时证据（本轮重跑原样输出）

```
SIDEBAR-MOBILE {"before":{"w":"72px","exp":"true"},"after1":{"w":"72px","exp":"false"},"after2":{"w":"72px","exp":"true"}}
REF-REDUCED-MOTION-SHEET {"left":640,"right":1120,"vw":1280,"transform":"none"}
WALLET-SHEET {"before":"false","after":"false","clickable":["添加银行卡","发起转账","扫码收款"]}
ACCOUNT-SWITCH-HITBOX {"w":44,"h":26}
WALLET-390 {"scrollW":433,"innerW":390}
```

对比度重算也与正文一致：`--text-3` 白底 3.62:1、`--bg` 3.33:1、暗色 4.27:1；`--text-4` 2.21:1；`--focus-ring` 合成 `#d1e5fa` 仅 1.29:1；`--success-fg` 在 success 浅底 4.14:1；`--danger` 白底 3.55:1。

### 10.3 本轮修正的报告自身问题

回测发现 5 处统计或表述不准确，已在上文直接修正：

1. **`backdrop-filter` 数量**：原写“110 处”。该数字能复现，但口径是 6 页中字符串出现次数（含 `-webkit-` 前缀重复计数）；按声明对去重后为 **82 条声明 / 41 组**。已改用不重复的口径，避免把前缀重复读成“110 个玻璃层”。
2. **动画 blur 数量**：原写“10 处”。逐条统计 transition 声明后为 **13 处**（reference 2、account 2、liquid 4、sidebar 1、toolbar 1、wallet 3）。
3. **触控目标数量**：原写“至少 10 处”，其中 `account.html` 弹层“保持方案”一行是**误报**——`.sheet .acts button` 的 46px 规则优先级高于 `.sheet .destroy` 的 40px，实测三个弹层按钮均为 45–46px。删除该行后为 **9 处**。
4. **钱包溢出临界值**：原写 `<473px`。实测 433px 不溢出、432px 溢出，正确阈值为 **≤432px**（`scrollWidth=433`）。
5. **html-validate 条数**：原直接写“59 条”。实际原始输出 **254 条**，其中 195 条是 `no-inline-style`；排除后才是 59 条结构问题。附录已改为两个口径并列。

另外修正两处措辞/引用：

- 删除“sheet 用 22px 应为 `--r-sheet 16`”这一判断：`tokens.css` 对 `--r-sheet` 的注释明确是“sheet/modal 内部按钮”，而 `app.md` 规定 iOS bottom sheet 就是 22px，使用 22px 并非漂移。
- `prefers-reduced-data` 的引用行号从 `design-system.md:173` 修正为 `:174`。

### 10.4 未能独立验证的项

- **`prefers-reduced-data` 的浏览器支持面**：离线环境无法核对 2026 年各浏览器稳定版的实际支持情况。该条应保留为“待核”，不宜作为硬结论；但它不影响“5 级中有一级不可依赖”的工程判断。
- **真实读屏与真机 GPU 性能**：仍与 9.C 的检测局限一致，本轮未补做。

### 10.5 迭代方向合理性评估

| 建议 | 评估 | 说明 |
| --- | --- | --- |
| 小字号 `--text-3` → `--text-2` | **合理，但需限定范围** | 5.07:1 / 4.66:1 可过 AA；但不应无差别替换全部 34 处，否则三级层次被抹平。建议新增 `--text-caption` 专用于 12–13px。 |
| 弹层关闭用 `inert`/`hidden` | **方向正确，代码需调整** | 文中示例同时设置 `hidden` 会立即中断退场动画，与 `motion.md` 的“同路径退场”冲突。应使用 `inert` + `aria-hidden`，退场结束后再 `hidden`，并管理焦点归还。 |
| 焦点环改为 2px `--accent` | **合理且已验证** | `#0071e3` 对白底 4.7:1，满足 3:1；`outline-offset` 也能避开玻璃背景。 |
| axe 扩到 6 页、0 容忍 | **合理** | 当前 6 页全红，0 容忍是唯一能阻止回归的门禁；但 axe 不覆盖键盘行为，需同时补 Playwright。 |
| 44px 命中区 | **合理** | WCAG 2.5.8 AA 的下限是 24px，44px 是项目自己承诺的更高标准；修复应与文档一致，而非降低文档。 |
| `[data-glass]` 统一降级 | **合理，可分两步** | 近期先把 4 个在用类补进阶梯；中期再换统一属性，避免一次性重构引入新漏网。 |
| 新增 `--z-system` 并统一层级 | **合理** | 当前 `app.md` 把 modal 放在 fab(70)、popover 在 80，确实存在 popover 盖 modal 的语义漏洞；系统层需要独立 token。 |
| 性能阈值 `error 0.85` | **方向合理，阈值需谨慎** | 共享 CI 上 Lighthouse 性能分数波动大，建议取 3 次中位数或改为 warn + 明确的 blur 层数/字节预算，避免 flaky。 |
| `--success-fg` 调深 | **合理且已验证** | 建议值 `#1a7f37` 在 success 浅底为 4.77:1；现有 `--danger-fg #c4342b` 白底 5.42:1，可直接用于 14px 文本。 |
| 行高拆成 UI 1.6 / 长文 1.85 | **合理** | 冲突真实存在；关键是给“长正文”下可执行定义（如 ≥2 行、≥40 字），否则仍无法自动检查。 |
| token JSON 生成 `DATA` | **合理但属中期** | 能根治双数据源；短期至少应加一条“`DATA` 中的 hex 必须存在于 `tokens.css`”的校验。 |
| `prefers-reduced-data` 保留为一级 | **需降级为增强项** | 不应计入“5 级保证”；文档可写“4 级保证 + 1 级渐进增强”。 |

### 10.6 回测结论

- **P0：4/4 成立。** 无障碍门禁失效、隐藏焦点、wallet ARIA 错误、降级覆盖不实，均可独立复现。
- **P1：10/10 方向成立。** 其中 P1-1 的 10 行证据有 1 行误报，已删除；剩余 9 行全部实测复现。
- **P2：18 条中 17 条成立或成立但需限定措辞，1 条（`prefers-reduced-data` 支持面）无法离线验证。**
- **迭代路线：方向整体合理，无需推翻。** 需要调整的是三处执行细节：弹层不要用 `hidden` 截断动画、`--text-3` 不要无差别全局替换、Lighthouse 性能阈值避免单次硬门禁。

因此，本报告的主要结论可信：问题不是“报告写重了”，而是项目确实未通过自己设定的验收线；修正后的问题清单更适合直接作为修复工单使用。

---

**最终判定：** 项目具备成为高质量设计系统的骨架，但当前版本不应以“WCAG AA / 自动化无障碍门禁 / 全类降级覆盖”对外发布。优先修复 P0 与 P1-1/P1-2/P1-3/P1-4，即可把综合分从 5.5 提升到 7.5 左右；再完成短期项，才配得上文档里已经写下的标准。
