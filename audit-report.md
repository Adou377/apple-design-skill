# Apple Liquid Glass 设计技能项目 · 全面检测报告

- 检测日期：2026-11-18
- 检测范围：全部 11 个规范文档、tokens.css、reference.html（731 行）、examples/ 全部 5 个示例页、CI/Lighthouse 配置、git 历史
- 检测方法：逐文件静态审查 + 跨文件一致性比对 + WCAG 对比度实测计算 + CHANGELOG 声明逐条核验
- 项目性质：供 AI 编码代理使用的「Apple Liquid Glass」设计规范 skill，核心卖点是"Apple 级质量与 WCAG AA 可访问性"

## 一、总体结论

项目结构与文档组织良好、token 化思路清晰、大部分示例 JS 质量（IIFE、事件委托、无 innerHTML、focus trap）高于同类项目。**但项目存在一个致命的自我矛盾：以"Apple 级质量 / WCAG AA"为核心卖点，而其自有的样板页与示例页系统性违反 WCAG AA 与自身 checklist**；同时"单一真源（single source of truth）"承诺在字号、间距、过渡时长等核心值上已经失守，规范文档三处互相打架。若 CI 真实运行，按现有配置必然失败——说明 CI 是"声明式摆设"。

| 维度 | 评价 |
|---|---|
| 文档组织 / 结构 | ★★★★☆（文件角色清晰，SKILL.md 工作流合理） |
| Token 体系设计 | ★★★★☆（分层完整，但覆盖承诺落空） |
| 规范一致性 | ★★☆☆☆（核心值 3~5 处漂移，规范内部自相矛盾） |
| 示例代码质量 | ★★★☆☆（JS 良好；CSS 硬编码与规范冲突多） |
| 可访问性 | ★★☆☆☆（系统性 AA 违规，自家 CI 必然红灯） |
| 工程化 / 测试 | ★★☆☆☆（零测试、零 lint、单提交历史） |

---

## 二、P0 严重问题（5 项）

### P0-1 系统性 WCAG AA 对比度违规，且 CHANGELOG 自证"知情"

[tokens.css](file:///workspace/tokens.css#L15) 第 15 行明确注释 `--text-3: #86868b` 为 **"LARGE TEXT ONLY"**（实测对白底对比度 ≈3.6:1，仅满足大字号 3:1 档）。但全部 6 个 HTML 页面都在 **12–13.5px 小字号**上大量使用它：

- [reference.html L205、L213、L225、L436、L459](file:///workspace/reference.html#L205)（12~13px 的 eyebrow/章节标题/卡片标题）
- [account.html L55、L60、L73、L77、L99、L102、L115、L118、L145](file:///workspace/examples/account.html#L55)（eyebrow、sec-label、"使用中"按钮文字 14px、账单状态、页脚链接）
- [wallet.html L87、L94](file:///workspace/examples/wallet.html#L87)（交易副标题、tab 标签 10px）
- [liquid-controls.html L81、L228、L219](file:///workspace/examples/liquid-controls.html#L81)、[sidebar.html L86、L128、L137](file:///workspace/examples/sidebar.html#L86)、[toolbar.html L123](file:///workspace/examples/toolbar.html#L123)

更严重的是 [CHANGELOG.md L11](file:///workspace/CHANGELOG.md#L11) 自己写着：把功能内容从 `--text-4`（≈2.2:1）改成 `--text-3`（**"~3.5:1"**）并称为"Fixed WCAG contrast violation"——13px 普通文字 AA 要求 4.5:1，3.5:1 依然不达标。即项目**明知该值不达标仍用于小字号功能文字，并在 changelog 中将其记为修复**。

另有灰白文字叠加问题：wallet [L71](file:///workspace/examples/wallet.html#L71) `rgba(255,255,255,0.8)` 13px 落在渐变上、account [L140](file:///workspace/examples/account.html#L140) `.fine` 0.72 透明度 13px，实测 ≈2.3–3:1，同样不达标。

### P0-2 自家 CI 配置若真实运行必然失败（CI 为"声明式摆设"）

[.lighthouserc.json](file:///workspace/.lighthouserc.json) 设定 a11y `minScore: 0.9`（error 级），CI 还跑 `axe --exit`。但 CI 审计的三个页面均含 axe 会直接判违规的问题：

1. **aria-hidden 容器内含可聚焦元素**（axe `aria-hidden-focus`，serious）：
   - [account.html L325](file:///workspace/examples/account.html#L325)：sheet 初始 `aria-hidden="true"`，内部 [L329-331](file:///workspace/examples/account.html#L329) 三个按钮仍可 Tab 聚焦；
   - [wallet.html L156 + L159-161](file:///workspace/examples/wallet.html#L156)：同样模式，且内部是 `role="button" tabindex="0"` 的 div；
   - [reference.html L465 + L475](file:///workspace/reference.html#L465)：mSheet 同样模式（关闭按钮在 aria-hidden 内可聚焦）。
2. **aria-controls 指向不存在的 ID**（axe `aria-valid-attr-value`）：[wallet.html L148/L149/L151](file:///workspace/examples/wallet.html#L148) 的 `walletPanel`/`cardsPanel`/`profilePanel` 在 DOM 中不存在。
3. **大面积 color-contrast 失败**（见 P0-1）。

三者叠加，a11y 得分必然低于 0.9 → **结论：CI 要么从未真正跑过，要么从未通过**。项目把 CI 当质量背书宣传，实际不构成任何保障。

### P0-3 降级阶梯（degradation ladder）覆盖承诺与实现不符

[components.md L234](file:///workspace/components.md#L234) 与 sidebar/toolbar 示例头注释均宣称：tokens.css 的降级阶梯会**自动套用于所有玻璃类**。但 [tokens.css L226-293](file:///workspace/tokens.css#L226) 仅枚举 12 个类名（.glass-nav/.glass-chip/.glass-toolbar/.glass-sidebar/.glass-tabbar/.glass-modal/.glass-popover/.glass-tooltip/.glass-seg/.glass-switch/.glass-fab/.glass-float），**未覆盖** components.md 新增的 `.glass-base`、`.glass-slider`、`.glass-check`、`.glass-radio`、`.glass-context` 等类。

更实际的后果：account/wallet 两个 CI 审计页使用的是自造类名 `.nav`/`.navc`/`.tabbar`/`.sheet`/`.scrim`，阶梯完全不生效，只能靠各页本地手写补丁——且补丁不全：

- [account.html L26-28](file:///workspace/examples/account.html#L26)：`prefers-contrast` 只覆盖 `.glass-chip`，nav/sheet 无处理；`@supports not (backdrop-filter)` 完全缺失；
- [wallet.html L29-33](file:///workspace/examples/wallet.html#L29)：只写了 reduced-transparency，`prefers-contrast` 与 `@supports` 均缺失。

在 Firefox（不支持 backdrop-filter）或 Windows 高对比度模式下，这些页面的玻璃层直接失去可读性。这与 checklist.md L19 "all glass surfaces cover the 5-level ladder" 的验收项直接冲突。

### P0-4 prefers-reduced-motion 覆盖不一致，且"只动画 transform/opacity"规范自我矛盾

- checklist.md L68 要求三查（reduced-motion/transparency/data），但 [liquid-controls.html](file:///workspace/examples/liquid-controls.html)、[sidebar.html](file:///workspace/examples/sidebar.html)、[toolbar.html](file:///workspace/examples/toolbar.html) **整页无 prefers-reduced-motion 处理**（开关缩放、气泡、FAB toast 在减弱动态下仍全速动画）；reference.html 仅覆盖 #mSheet 两处（[L190-192](file:///workspace/reference.html#L190)、[L726-728](file:///workspace/reference.html#L726)）。
- [reference.html L206/L214](file:///workspace/reference.html#L206) `pulse-dot` 无限 box-shadow 动画：既非 transform/opacity（主线程重绘），也不被 reduced-motion 停止。
- 规范内部矛盾：motion.md L96 与自检表 L266 规定"只动画 transform / opacity"，但同一文档 L261 的玻璃"材质化"规范要求 blur+scale+opacity 同时过渡、L184-193 的侧栏折射动画要求过渡 `backdrop-filter` 且**故意给 backdrop-filter 加 stagger 延迟**——直接违反 L150 自己"三个属性必须同步过渡、绝不 stagger"的铁律。checklist 验收时按哪条执行？无法判定。

### P0-5 reference.html"样板间"自身示范了不可达模式

reference.html 是文档指定的 ground truth（checklist L60 要求与其并排对照验收），但它自己违反 checklist：

- [L271-272](file:///workspace/reference.html#L271)：`<span class="btn-primary" role="button" tabindex="0">` 伪按钮，**无 Enter/Space 键盘处理**（span 不天然响应键盘）；
- [L365-373](file:///workspace/reference.html#L365)：玻璃开关 showcase 为纯装饰 span，无 `role="switch"`/`aria-checked`；[L375-382](file:///workspace/reference.html#L375) 滑块 showcase 无 `role="slider"`/`aria-valuenow`——正是 checklist L49-52 的验收要点；
- [L386-390](file:///workspace/reference.html#L386) glass 分段控件：无 tabpanel/aria-controls/**无键盘方向键**（同页 ds-seg 有，行为不一致）；
- [L349-351](file:///workspace/reference.html#L349) tabbar showcase 用颜色变化表达选中，无任何 ARIA 状态。

---

## 三、P1 中等问题（15 项）

### 一致性 / 单一真源失守

1. **H1 字号全项目 5 个版本**：design-system.md L54 `clamp(27,5vw,46)`；components.md L25 `clamp(32,6vw,52)`；reference.html 实际 44px（其 spec 文案却写 46）；liquid-controls/sidebar/toolbar `clamp(28,5vw,44)`；account.html `clamp(30,5vw,46)`。行高同理：spec 1.1–1.18 vs reference 实际 1.06。
2. **核心布局值漂移**：hero 副文案 max-width 三版（account 540 / components·toolbar 560 / reference·sidebar 600）；页面留白 `--pad-x:22px`（design-system L85）vs reference.html L209 硬编码 24px。
3. **玻璃过渡参数两版**：design-system.md L139 规定 `.3s var(--ease-spring)`，全部示例实际用 `.28s var(--ease-out-quart)`。
4. **token 三处手工复制、无同步机制**：reference.html JS `DATA` 对象（L476+）把颜色/字阶/圆角手工抄进注释声称"对齐 tokens.css"，已实际产生 46/44 漂移。CHANGELOG L34 宣称"eliminates token drift"——不实，reference 仍存在 seg 阴影 `rgba(0,0,0,0.22)`（L166-169）、btn-secondary 背景 `rgba(255,255,255,0.8)`、主容器 24px padding 等硬编码。

### 规范实现偏差

5. **降级阶梯五级语义错位**：design-system.md L172-177 / checklist L19 的五级 = RT→RD→contrast→@supports→print；reference.html L647-653 的五格演示却把"默认完整玻璃"算第 1 级、**丢掉 print 级**，文档与视觉演示对不上。
6. **`prefers-reduced-data` 级是死代码且理由不成立**：该 media query 无任何稳定浏览器实现；且"省流量"级保留 blur 只去 saturate（tokens.css L237-245），blur 才是 GPU 开销大头，与网络流量无关，design-system L174 "lighter payload" 的理由技术上站不住。
7. **z 阶梯语义滥用与跨文件矛盾**：scrim 用 `--z-fab`（account L148、wallet L100；design-system L217 明确 scrim 属 `--z-modal`）；sheet 在 app.md L147 用 `--z-fab` 而 wallet L104 用 `--z-modal`；homebar app.md L49 用 `--z-popover` 而 wallet L98 用 `--z-toast`；fab-toast 用 `--z-fab` 而非 `--z-toast`（liquid-controls L206）。z 阶梯作为"语义命名层"的价值被示例自己破坏。
8. **同一组件两套 ARIA 模式**：分段控件在 checklist L49 要求 `role=tab + aria-selected`，components.md L343 却用 `role=group + aria-pressed`；app.md L107-116 与 components.md L302-316 的 tab 无 href（不可聚焦）、无 tabpanel、无键盘导航；wallet L150 "添加"项 `role=tab` 同时 `aria-haspopup=dialog`，语义混搭。
9. **触摸区 44px 自我违规**：wallet L74 `.glass-chip height:40px`（"转账/收款"按钮），低于 checklist L45 / app.md L218 的 44px 铁律。
10. **图标规范自我违规**：icons.md 规定全局唯一 stroke-width 1.75 且"no emoji as icons"，但 components.md L465（FAB stroke-width=2）、L491（checkbox 勾 stroke-width=3）；sidebar.html L159-173 用 ☻/⚙/▤/⚐ Unicode 字符当图标；wallet L161"扫码收款"为手搓 path，不在 curated 集内。CHANGELOG L39 说"icons 修正为 ~15 个"而 icons.md L41 实为 20 个（CHANGELOG 内部 L68 的 15+5=20 也与之矛盾）。

### 文档可执行性

11. **非法 CSS 写法进入验收门**：checklist.md L66 与 motion.md L262 出现 `var(--glass-blur-rest/active/scrolled)`——这不是合法 CSS 变量语法。checklist 是"done gate"，写法不可执行。
12. **design-system.md 官方示例违反自家强制规则**：[design-system.md L202](file:///workspace/design-system.md#L202) 的 scroll 监听示例未做 rAF 节流，违反 checklist L46/L67 与 motion.md L202-213 的强制要求（motion.md 与 design-system.md 给出两种互相矛盾的官方写法）。
13. **示例大量内联硬编码绕过 token**（违反 SKILL.md"never hard-code a raw value that a token already names"）：`rgba(0,0,0,0.05)` 在 components.md 约 10 处手写而 `--btn-quiet-bg`（tokens.css L72）已存在；阴影 `0 1px 3px rgba(0,0,0,0.12)` / `0 1px 2px rgba(0,0,0,0.22)` 反复硬编码（components L49/L168/L171、liquid-controls L142、toolbar L109）；app.md L151 sheet 圆角字面量 `22px 22px 0 0`（L165 自己说要 `var(--r-panel)`），wallet L104 同病；liquid-controls L104 switch 轨道 `rgba(0,0,0,0.12)` 凭空造灰。components.md L48 还写了 `cubic-bezier(.25,.1,.25,1)`——这就是 CSS `ease` 关键字的展开式，正面撞上 motion.md L259"no default ease"的自检项。
14. **暗色模式细节缺陷**：account `.nav.scrolled`（L41）与 wallet `.navc.show`（L56）滚动发丝线用 `--hairline`（黑色 7% 透明），暗色模式下不可见，且两者均无暗色覆盖；与 checklist L74"sticky chrome 用 `--glass-hairline-*`"不符。
15. **交互实现缺陷**：liquid-controls L283-286 用 `<label>` 包裹 `span[role=checkbox]`，点击文字标签不会切换（label 仅对表单控件生效）；wallet 示例滑轨未设 `touch-action:none`（liquid-controls L256），移动端拖动会与页面滚动手势冲突；sidebar.html ≤760px 时 CSS 强制折叠但 `aria-expanded="true"`、按钮文案仍为"收起侧栏"（L178/218），状态与真实视觉相反（且 opacity:0 的文字仍在读屏树中）；sidebar 折叠动画动 `width`/`margin-left` 两个布局属性——与"只动画 transform/opacity"规范冲突，而该写法恰是 motion.md L184-193 自己规定的（规范内部矛盾）。

---

## 四、P2 轻微问题

1. `lang` 属性不统一（reference/liquid-controls/sidebar/toolbar = `zh-CN`，account/wallet = `zh`）；所有页面均无 `<meta name="description">`。
2. reference.html 48KB / 731 行单文件：色板、字阶、圆角、阴影、降级演示全部依赖 JS 渲染，**无 noscript 兜底**（禁 JS 即大片空白）；heading 层级 h1→h3 跳级；L399 `ds-3col` 类名实际是 4 列；L442 五列 grid 无响应式折叠；`font-weight:550/650` 在非苹果平台回退不可控。
3. CI 工程瑕疵：[accessibility-ci.yml](file:///workspace/.github/workflows/accessibility-ci.yml) 中 `python3 -m http.server & sleep 2` 存在就绪竞态；`npm -g` 无缓存；a11y 阈值 0.9 而非 1.0（对宣称 Apple 级的项目而言偏低）；**审计面只覆盖 3/6 页面**——liquid-controls（控件示范页，恰是 reduced-motion 缺失最重的页）、sidebar、toolbar 完全没有自动化 a11y 审计。
4. 测试体系缺失：无任何视觉回归测试（对一个以像素级一致为卖点的设计规范项目，这是最应该有的）、无 stylelint/htmlhint/w3c 校验、无单测；无 package.json，CONTRIBUTING.md 未提供任何本地自检命令。
5. 仓库卫生：git 历史仅 1 个 squash 提交，而 CHANGELOG 记录 0.1.0 / 2.0.0 / 大段 Unreleased 三个阶段——历史与变更记录脱节，不可追溯；`--link`/`--success`/`--danger` 等 token 在 design-system.md 正文中零文档（quick-ref L247 也遗漏）；`--ease-spring-reverse`（tokens.css L215）从未被任何文档提及；sidebar L200 注释把 reduced-motion 与 reduced-transparency 阶梯混为一谈（tokens.css 阶梯并不含 reduced-motion）。

---

## 五、统计汇总

| 级别 | 数量 | 关键词 |
|---|---|---|
| P0 严重 | 5 | WCAG AA 系统性违规、CI 必然红灯、降级阶梯落空、reduced-motion 缺失、样板页不可达 |
| P1 中等 | 15 | 核心值漂移、z/ARIA 矛盾、硬编码绕 token、非法 CSS 进 checklist |
| P2 轻微 | 5 类 | meta/lang、单文件体积、CI 瑕疵、零测试、仓库卫生 |

## 六、修复优先级建议

1. **先让 CI 真的跑通**：修复 3 处 aria-hidden-focus（sheet 关闭时对内部按钮加 `visibility:hidden`/`inert`）、wallet 悬空 aria-controls、按 tokens.css 注释把 `--text-3` 从所有 <18px 文字场景换为 `--text-2`；把 a11y 阈值提到 1.0，并把 liquid-controls/sidebar/toolbar 纳入审计。
2. **确立唯一真源**：以 design-system.md 数值为准修正 components.md（H1 52→46）与全部示例（44→46、1.06→1.1+、24px→--pad-x）；reference.html 的 DATA 改为由 tokens.css 派生或用脚本校验。
3. **补齐降级阶梯**：tokens.css 阶梯改为属性选择器（`[class*="glass-"]`）或补齐全部类名，并让 account/wallet 的 `.nav/.sheet` 收编为 `.glass-*` 命名；示例补 `@supports not (backdrop-filter)` 与 `prefers-contrast` 回退。
4. **解决"只动 transform/opacity"与玻璃过渡的规范矛盾**：把规则改写为"合成层属性优先，玻璃材质属性（blur/saturate/shadow）作为受控例外，禁止 width/margin/box-shadow 动画"，并统一 motion.md 与 design-system.md 的 rAF 示例。
5. **引入视觉回归与 CSS 校验**（Playwright screenshot + stylelint 禁止裸 rgba/hex），让"single source of truth"有机器保证而非自觉。
