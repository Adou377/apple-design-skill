# Apple Liquid Glass 设计技能项目 · 第二轮复评报告

- 复评日期：2026-11-18
- 复评基线：首评报告 [audit-report.md](file:///workspace/audit-report.md)（P0×5 / P1×15 / P2×5 类）
- 复评方法：①git 历史与工作树差异比对 ②逐文件重读全部 HTML/CSS ③逐条重验 25 项发现的原始行号 ④重算 WCAG 对比度 ⑤CHANGELOG 声明二次核验
- 结论速览：**修复未落地。全部 25 项发现原样存在，0 项已修复、0 项部分修复。**

---

## 一、核心结论：声明已修复，但仓库中不存在任何修复

这不是"修得不好"，而是"修复根本没有进入当前代码"。证据链如下：

1. **git 证据**：仓库仅 2 个提交——`d4fbffd feat(v2.0.0)`（项目本体）与 `f902569`（首评报告 audit-report.md，仅 +131 行文档）。`git diff d4fbffd HEAD` 显示两次提交之间**唯一的差异就是新增首评报告本身**；`git status` 工作树干净，无任何未提交修改。
2. **行号证据**：逐条复验 25 项发现，所有问题的 file:line 与首评**完全一致、一行未动**（例如 account.html L26-28 `prefers-contrast` 仍只覆盖 `.glass-chip`；wallet.html L74 `.glass-chip` 仍 `height:40px`；reference.html L271 仍是 `<span role="button" tabindex="0">` 伪按钮；components.md L470 FAB 仍 `stroke-width="2"`；motion.md L184 仍给 `backdrop-filter` 加 `.1s` stagger）。
3. **CHANGELOG 证据**：[CHANGELOG.md](file:///workspace/CHANGELOG.md#L8) 的 Unreleased 段没有为本轮修复新增任何条目，仍停留在首评之前的状态——其中包括首评已点名的不实声明（L11 将 `--text-3` ≈3.5:1 记为"Fixed WCAG contrast violation"、L34 "eliminates token drift"、L39 "icons ~15 个" 与 icons.md L41 "20 icons" 互相矛盾）。
4. **CI 证据**：配置未动。axe 以 `--exit` 模式扫 3 个页面，而这 3 个页面当前仍带 axe serious 级违规（详见 P0-2）——CI 一旦真实运行必然红灯，与首评结论相同。

> 若修复已在本地完成但未同步到本仓库，请先 `git commit` / 推送后再发起复评；当前可见状态等同于首评时的基线。

---

## 二、逐项核验表

判定口径：✔ 已修复 / ◐ 部分修复 / ✘ 未修复 / ⚡ 修复引入新问题

### P0 严重（5 项）

| 编号 | 首评问题 | 判定 | 复评证据（当前行号） |
|---|---|---|---|
| P0-1 | 系统性 WCAG AA 对比度违规（`--text-3` 用于 12–13.5px 小字；灰白文字叠加不达标） | ✘ | [tokens.css L15](file:///workspace/tokens.css#L15) 注释未变；reference.html L205/L213/L225/L436/L459、account.html L55/L60/L73/L77/L83/L99/L102/L115/L118/L140/L145、wallet.html L71/L78/L87/L94、liquid-controls.html L81/L228/L219、sidebar.html L85/L128/L137、toolbar.html L123/L165 全部原样 |
| P0-2 | CI 必然红灯：3 页 aria-hidden 内可聚焦元素 + wallet 悬空 aria-controls + 大面积 color-contrast | ✘ | account.html L325+L329-331、wallet.html L156+L159-161、reference.html L465+L468 三处 sheet 关闭态 `aria-hidden="true"` 内按钮仍可聚焦；wallet.html L148/L149/L151 的 `walletPanel`/`cardsPanel`/`profilePanel` 仍是 DOM 中不存在的 ID；[.lighthouserc.json](file:///workspace/.lighthouserc.json#L5) 阈值仍 0.9 |
| P0-3 | 降级阶梯覆盖承诺落空：tokens.css 阶梯仅 12 个类名，`.glass-base/.glass-slider/.glass-check/.glass-radio/.glass-context` 与 account/wallet 自造类名均不在阶梯内 | ✘ | [tokens.css L226-293](file:///workspace/tokens.css#L226) 仍仅枚举 12 类；components.md L234 仍宣称 "covers all `.glass-*` classes automatically"；components.md L240/L391/L486/L497/L517 定义的 5 个新类无一在阶梯中；account.html L26-28 `prefers-contrast` 仍只覆盖 `.glass-chip`、无 `@supports` 回退；wallet.html L29-33 仍只有 reduced-transparency |
| P0-4 | prefers-reduced-motion 覆盖不一致 + pulse-dot 无限 box-shadow 动画 + "只动画 transform/opacity" 规范自相矛盾 | ✘ | liquid-controls.html / sidebar.html / toolbar.html 三页仍**整页无** `prefers-reduced-motion`（全项目 grep 仅 reference/wallet/account 4 处）；tokens.css L206-210 pulse-dot 仍无限动画 box-shadow 且无减弱保护；[motion.md L96](file:///workspace/motion.md#L96) "Animate **only** `transform` and `opacity`" 与 L139-145（过渡 backdrop-filter/box-shadow）、L184-185（`backdrop-filter .4s … .1s` 故意 stagger）矛盾依旧 |
| P0-5 | reference.html 样板间示范不可达模式（伪按钮无键盘、开关/滑块无 ARIA、glass-seg 无方向键、tabbar 无状态） | ✘ | reference.html L271-272 伪按钮仍无 Enter/Space 处理（JS 全文无对应 keydown）；L365-382 开关/滑块 showcase 仍是纯装饰 span（无 `role="switch"`/`aria-checked`/`role="slider"`/`aria-valuenow`）；L386-390 glass-seg 有 `role=tablist` 但 [JS L631-644](file:///workspace/reference.html#L631) 仍只处理 click、无方向键（同页 ds-seg L619-628 有）；L348-352 tabbar 仍纯颜色表达选中 |

### P1 中等（15 项）

| 编号 | 首评问题 | 判定 | 复评证据 |
|---|---|---|---|
| P1-1 | H1 字号 5 个版本 | ✘ | design-system.md L54 `clamp(27,5vw,46)` / components.md L25 `clamp(32,6vw,52)` lh1.06 / reference.html L217 `clamp(32,6vw,52)` / liquid-controls L65·sidebar L129·toolbar L115 `clamp(28,5vw,44)` / account.html L56 `clamp(30,5vw,46)` — 5 版俱在 |
| P1-2 | hero 副文案 max-width 三版 + `--pad-x` 22 vs 硬编码 24px | ✘ | 现为四版：account L57 540 / toolbar L116 560 / sidebar L130·reference L218 600 / liquid-controls L66 620；reference.html L209 仍 `padding: 0 24px` |
| P1-3 | 玻璃过渡两版：spec `.3s ease-spring` vs 示例 `.28s ease-out-quart` | ✘ | design-system.md L139 未改；全部示例仍 `.28s var(--ease-out-quart)` |
| P1-4 | token 三处手工复制、reference 硬编码残留、"eliminates token drift" 不实 | ✘ | reference.html L500 字阶 spec 写 46、实际 `clamp(27px,5vw,44px)` 仍自相矛盾；L173/L609 seg 阴影 `rgba(0,0,0,0.22)`、L272 `rgba(255,255,255,0.8)` 仍硬编码；CHANGELOG L34 声明未撤 |
| P1-5 | 降级阶梯五级语义错位（演示把"默认"算第 1 级、丢 print） | ✘ | reference.html L647-653 LADDER 仍为 默认/RT/RD/contrast/@supports，无 print 格 |
| P1-6 | `prefers-reduced-data` 死代码、理由不成立 | ✘ | tokens.css L237-245 与 design-system.md L174 未动 |
| P1-7 | z 阶梯语义滥用：scrim 用 `--z-fab`；sheet 两版；homebar 两版；fab-toast 用 `--z-fab` | ✘ | account L148 / wallet L100 scrim 仍 `--z-fab`（design-system L217 明确 scrim 属 `--z-modal`）；app.md L147 sheet `--z-fab` vs wallet L104 `--z-modal`；app.md L49 homebar `--z-popover` vs wallet L98 `--z-toast`；liquid-controls L206 fab-toast 仍 `--z-fab`。另 app.md L157 scrim 竟用 `--z-sticky`，scrim 现共 3 种写法 |
| P1-8 | 分段控件两套 ARIA 模式；tab 无 href/tabpanel/键盘；wallet "添加" role 混搭 | ✘ | components.md L343 仍 `role=group + aria-pressed` vs checklist L49 `role=tab + aria-selected`；app.md L108-114 tab 仍无 href/tabpanel；wallet L150 "添加" 仍 `role=tab + aria-haspopup=dialog` |
| P1-9 | wallet `.glass-chip` 40px < 44px 铁律 | ✘ | wallet.html L74 仍 `height:40px`（"转账/收款"）；account.html L79 `.btn-block` 与 L167 `.sheet .destroy` 亦为 40px |
| P1-10 | 图标规范自我违规：stroke-width 2/3；Unicode 字符当图标；curated 集外手搓 path；CHANGELOG icons 数量矛盾 | ✘ | components.md L470 `stroke-width="2"`、L491 `stroke-width="3"`；sidebar.html L159-173 仍 ☻/⚙/▤/⚐；wallet L161 扫码 path 仍不在集内；icons.md L41 仍写 "20 icons" vs CHANGELOG L39 "~15" |
| P1-11 | checklist/motion 引用 `var(--glass-blur-rest/active/scrolled)` 而变量未定义 | ✔ | [tokens.css L96-98](file:///workspace/tokens.css#L96) 现已定义三个状态 blur 变量，引用合法（此项在首评基线内已成立） |
| P1-12 | design-system.md L202 scroll 示例无 rAF | ✘ | [design-system.md L202](file:///workspace/design-system.md#L202) 仍是裸 `addEventListener('scroll', …)`（示例页均已 rAF，官方文档反而没有） |
| P1-13 | 示例/文档大量硬编码绕 token（rgba(0,0,0,0.05)、阴影字面量、22px 圆角、`ease` 展开式） | ✘ | components.md L17/L46/L53/L91/L188/L328/L538 仍手写 `rgba(0,0,0,0.05)`；L48 仍 `cubic-bezier(.25,.1,.25,1)`；app.md L151 sheet 仍 `22px 22px 0 0`；liquid-controls L104 switch 轨道仍 `rgba(0,0,0,0.12)`；wallet L104 同病 |
| P1-14 | 暗色模式滚动发丝线不可见 | ◐ | tokens.css 已有 dark `--hairline: rgba(255,255,255,0.08)` 使 account L41 / wallet L56 暗色下可见（token 层已备）；但 checklist L74 要求的 `--glass-hairline-*` 未使用，且两页仍无独立暗色覆盖块 |
| P1-15 | 交互实现缺陷（label 包 span[role=checkbox]、滑轨缺 touch-action:none、sidebar aria-expanded 失真、侧栏动画动布局属性） | ✘ | liquid-controls L283-286 仍 `<label>` 包 `span[role=checkbox]`（点文字不切换）；`.slider-track`（L115）仍无 `touch-action:none`；sidebar ≤760px CSS 强制折叠但 HTML 初始 `aria-expanded="true"`、"收起侧栏" 文案不变（L178-180，JS 仅点击时更新）；sidebar L34-37 仍过渡 `width`、L123 仍过渡 `margin-left` |

### P2 轻微（5 类）

| 编号 | 首评问题 | 判定 | 复评证据 |
|---|---|---|---|
| P2-1 | `lang` 不统一（zh vs zh-CN）；无 meta description | ✘ | account/wallet 仍 `lang="zh"`；全项目 grep 无 `name="description"` |
| P2-2 | reference 单文件无 noscript、h1→h3 跳级、ds-3col 实为 4 列、五列 grid 无折叠、font-weight 550/650 | ✘ | 无 `<noscript>`；L217 h1 → L225 h3；L399 `ds-3col` 仍套在 `repeat(4,1fr)` 上；L442 五列仍无响应式；L203/L272 等 550/650 仍在 |
| P2-3 | CI 瑕疵：sleep 2 竞态、无 npm 缓存、阈值 0.9、审计面 3/6 | ✘ | [accessibility-ci.yml](file:///workspace/.github/workflows/accessibility-ci.yml#L19) 三处仍 `sleep 2`；L66 `npm install -g` 无缓存；`.lighthouserc.json`/`.lighthouserc-mobile.json` 仍 0.9；URL 列表仍只有 account/wallet/reference——liquid-controls（控件示范页）仍零自动化 a11y 审计 |
| P2-4 | 零测试、零 lint、无 package.json | ✘ | 仓库无新增测试/校验设施 |
| P2-5 | git 单提交历史与 CHANGELOG 脱节；`--link/--success/--danger/--ease-spring-reverse` 零文档 | ✘ | 历史仍 2 提交（项目本体 + 首评报告），本轮"修复"无提交记录；design-system.md 正文对上述 token 的 grep 命中数为 0 |

**汇总：25 项发现 → ✔ 1（P1-11，且属首评基线内既有状态）、◐ 1（P1-14）、✘ 23。修复率 4%。**

---

## 三、复评重算与二次核验

1. **对比度复核**：`--text-3: #86868b` 对白底仍 ≈3.54:1（AA 小字需 4.5:1）。全项目 12–13.5px 功能文字使用该色的位置与首评完全一致，未做任何替换。CHANGELOG L11 仍将 ≈3.5:1 记为已修复——"知情但仍违规"的状态未变。
2. **axe 模拟判定**（基于规则静态比对）：account/wallet/reference 三页各含 `aria-hidden-focus`（serious）；wallet 另含 `aria-valid-attr-value`（serious，3 处悬空 aria-controls）；三页 color-contrast 大面积失败。`axe --exit` 与 Lighthouse a11y≥0.9 的组合仍必然失败。
3. **CHANGELOG 二次核验**：Unreleased 段所有条目均属 v2.0.0 时代（token link、rAF、focus trap、aria-labelledby、wallet 语义化按钮等——这些在首评时已存在并被核实为真）。本轮声明修复的内容**没有任何对应条目**。
4. **复评新增观察**（非新问题，为首评的强化证据）：
   - app.md L157 的 scrim 使用 `--z-sticky`，使"scrim 的 z 值"在同一仓库内出现 sticky/fab/modal 三种写法，进一步印证 P1-7；
   - hero 副文案宽度漂移由三版扩至四版（540/560/600/620），印证 P1-2；
   - account `.btn-block`（40px）与 `.sheet .destroy`（40px）同触 44px 铁律，与 P1-9 同源。

---

## 四、最终评分（与首评一致，无变化）

| 维度 | 评价 |
|---|---|
| 文档组织 / 结构 | ★★★★☆ |
| Token 体系设计 | ★★★★☆ |
| 规范一致性 | ★★☆☆☆ |
| 示例代码质量 | ★★★☆☆ |
| 可访问性 | ★★☆☆☆ |
| 工程化 / 测试 | ★★☆☆☆ |

---

## 五、给下一轮修复的落地清单（按序执行，每步带验收方式）

1. **先提交，再修复**：本轮最大的问题不是代码而是流程——修复必须以新提交进入仓库，并为 CHANGELOG Unreleased 段补条目。验收：`git log` 出现新提交，`git diff` 能看到下述改动。
2. **对比度一次性清零**：全局把 `<18px` 场景的 `--text-3` 换为 `--text-2`（#6e6e73，5.7:1）；`rgba(255,255,255,0.8/0.72)` 小字改为实色 `#fff` 或提高透明度至 ≥0.9 并复算。验收：`grep -rn "text-3" examples/*.html reference.html` 逐条人工确认字号 ≥18px。
3. **让 CI 能变绿**：三处 sheet 关闭态加 `visibility:hidden`（打开时移除）或使用 `inert`；wallet 三个悬空 `aria-controls` 指向真实面板或移除属性；把 liquid-controls/sidebar/toolbar 加入 axe 与 Lighthouse URL；阈值提至 1.0；`sleep 2` 换成就绪探测循环；`npm install -g` 前加 `actions/setup-node` 缓存。验收：本地 `npx @axe-core/cli http://localhost:8080/... --exit` 通过。
4. **单一真源收口**：以 design-system.md 为准改 components.md H1（52→46、lh 1.06→1.1+）与全部示例（44→46）；统一过渡 `.3s var(--ease-spring)`；reference L209 `24px`→`var(--pad-x)`；删除 reference DATA 中已漂移的字阶 spec/size 双写。验收：`grep -rn "clamp(" *.md examples/*.html reference.html` 只剩一套 H1 值。
5. **降级阶梯真覆盖**：tokens.css 阶梯选择器补入 `.glass-base/.glass-slider/.glass-check/.glass-radio/.glass-context`，或改为 `[class*="glass-"]`；account/wallet 的 `.nav/.navc/.tabbar/.sheet/.scrim` 收编为 `.glass-*` 命名；两页补 `@supports not (backdrop-filter)` 与 `prefers-contrast` 全覆盖。验收：Firefox 打开两示例页玻璃层仍可读。
6. **reduced-motion 与规范矛盾**：liquid-controls/sidebar/toolbar 三页补 `prefers-reduced-motion`；pulse-dot 在减弱动态下停止；motion.md 把 L96 改写为"合成层属性优先，玻璃材质属性（blur/sat/shadow）为受控例外，禁止 width/margin/box-shadow 动画"，并解决 L184 stagger 与 L150 的自相矛盾（二选一）。验收：模拟 `prefers-reduced-motion: reduce` 无位移动画。
7. **样板间先达标**：reference.html 伪按钮换 `<button>` 或补 Enter/Space；开关/滑块 showcase 补 `role="switch"/"slider"` + 状态；glass-seg 补方向键；tabbar 补 `aria-current`。验收：axe 扫 reference.html 零 serious。
8. **收尾 P1/P2**：z 值对表（scrim=`--z-modal`、homebar 统一、fab-toast=`--z-toast`）；分段控件统一为 tab 模式；wallet glass-chip 40→44px；stroke-width 统一 1.75、sidebar 换 SVG 图标；`.slider-track` 加 `touch-action:none`；liquid-controls label 结构改为 checkbox 自带可见文字或用真实 input；sidebar 折叠与 aria-expanded 同步；统一 `lang="zh-CN"`、补 meta description；CHANGELOG 的 ~15/20 icons 与 "eliminates token drift" 表述改为与事实一致。
