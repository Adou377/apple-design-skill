# Apple Liquid Glass 设计技能项目 · 第三轮复评报告

- 复评日期：2026-11-18
- 复评对象：`main` 分支新提交 [`ac26d59 fix(a11y): remediate contrast, degradation ladder, and control semantics`](file:///workspace/.git)（改动 25 个文件、+338/−191 行，含新增 package.json / .stylelintrc.json / .htmlhintrc）
- 复评基线：[audit-report.md](file:///workspace/audit-report.md)（首评 25 项）与 [audit-report-v2.md](file:///workspace/audit-report-v2.md)（第二轮，当时修复未入库）
- 复评方法：git 分支差异比对 → 逐文件定向检索 → 逐条重验 25 项原始证据位置 → CHANGELOG 声明二次核验

## 一、总结论

**本轮修复真实落地，质量高。25 项发现中 21 项完全修复、4 项基本修复（仅剩孤立残留点），无一项未修复，未发现修复引入的阻断性新问题。** 修复方式不是打补丁，而是结构性收敛：新增 `inert` 焦点管理、token 阶梯改用 `:is()` 覆盖全部玻璃类、删除无实现的 `prefers-reduced-data`、motion.md 重写解决规范自相矛盾、reference.html 样板间重做可达性。CHANGELOG 本轮新增的条目逐条核验属实。

| 判定 | 数量 | 占比 |
|---|---|---|
| ✔ 已修复 | 21 | 84% |
| ◐ 基本修复（残留孤立点） | 4 | 16% |
| ✘ 未修复 | 0 | — |

## 二、逐项核验表

### P0 严重（5/5 已修复）

| 编号 | 首评问题 | 判定 | 修复证据 |
|---|---|---|---|
| P0-1 | `--text-3`（≈3.5:1）系统性用于 12–13.5px 小字 | ✔ | 全项目 HTML 中小字号 `text-3` 清零；eyebrow/标签/状态文字改用 `text-2`（#6e6e73，5.74:1）；"最热/热议"标签改用新增的 `--heat-fg`/`--x-blue-strong` 前景色 token；wallet 渐变上的 `rgba(255,255,255,0.8)` 与 account `.fine` 0.72 透明度文字均改为实色；[tokens.css L15](file:///workspace/tokens.css#L15) 注释补上精确阈值（"never <24px regular / <18.66px bold"） |
| P0-2 | CI 必然红灯（aria-hidden 内可聚焦 / 悬空 aria-controls / 对比度） | ✔ | 三处 sheet 关闭态补 `inert` 并随开合正确增删（[account L334/L360](file:///workspace/examples/account.html#L334)、wallet L166/L186、reference L473/L757）；wallet 三个悬空 `aria-controls` 修复——`walletPanel` 现为真实 DOM 主内容区，"卡片/我的" tab 移除空指向；Lighthouse a11y 阈值 0.9→**1.0**；CI 审计面 3/6→**6/6**（桌面+移动双跑）；`sleep 2` 改为 40×0.25s 就绪探测循环 + 终验 |
| P0-3 | 降级阶梯覆盖承诺落空 | ✔ | [tokens.css 阶梯](file:///workspace/tokens.css#L226) 改为 `:is()` 覆盖 18 个玻璃类，含 `.glass-base/.glass-slider/.glass-check/.glass-radio/.glass-context/.glass-clear-base`；account/wallet 自造类名补齐 `prefers-contrast` 与 `@supports not (backdrop-filter)` 双级处理（account L29-36、wallet L37-42，覆盖 nav/sheet/chip） |
| P0-4 | reduced-motion 覆盖不一致 + 规范自相矛盾 | ✔ | liquid-controls/sidebar/toolbar 三页补齐 `prefers-reduced-motion`（此前为 0）；[tokens.css](file:///workspace/tokens.css#L268) 增加全局减弱动态兜底（动画时长压至 0.01ms、pulse-dot 无限脉冲停止）；[motion.md L97](file:///workspace/motion.md#L97) 重写为"位移只动画 transform/opacity；玻璃材质属性作为**已文档化的受控例外**整体过渡"——首评指出的 L96/L184 自相矛盾已消除，侧栏折射段（L182-198）改为 transform + 同步 blur、stagger 删除 |
| P0-5 | reference.html 样板间示范不可达模式 | ✔ | tabbar showcase 换真 `<button role="tab">` + roving tabindex + min-height 44px（L356-358）；开关补 `role="switch"`/`aria-checked` + Enter/Space（L375/L657）；滑块补 `role="slider"` + valuemin/max/now/text（L384）；glass-seg 补方向键循环导航（L700-703）并挂真实 `role="tabpanel"`（L398）；伪按钮 span 全部消除 |

### P1 中等（12/15 已修复，3 项残留孤立点）

| 编号 | 首评问题 | 判定 | 修复证据 / 残留 |
|---|---|---|---|
| P1-1 | H1 字号 5 个版本 | ◐ | 全部示例页 + design-system.md L61 + components.md L25 统一为 `clamp(28px,5vw,44px)` lh1.08 ✓；**残留**：[components.md L106](file:///workspace/components.md#L106) 的实时代码样例 h1 仍为 `clamp(32px,6vw,52px)` lh1.06，与其上方 L25 自相矛盾 |
| P1-2 | hero 副文案宽度漂移 + pad-x 硬编码 | ◐ | account/sidebar/toolbar 均归一 600px；reference `padding:0 24px` 已改 token ✓；**残留**：[liquid-controls.html L67](file:///workspace/examples/liquid-controls.html#L67) 仍 620px |
| P1-3 | 玻璃过渡两版（spec spring vs 示例 out-quart） | ✔ | `.28s ease-out-quart` 全项目清零，21 处统一 `.3s var(--ease-spring)` ✓；sheet 用 .4s spring 与 motion.md L44 "sheet/dialog standard" 一致；仅 account L48 nav 悬停态用 out-quart（悬停微交互，属合理细分级差，不再构成冲突） |
| P1-4 | token 手工复制 / "eliminates token drift" 不实 | ✔ | [reference.html L527](file:///workspace/reference.html#L527) 改为 `getComputedStyle().getPropertyValue()` 实时读取 CSS 变量，DATA 对象不再抄值；seg 激活阴影等硬编码收敛为 `--sh-seg-active-strong` 等新 token；该 CHANGELOG 声明现在成立 |
| P1-5 | 降级阶梯演示语义错位（丢 print） | ✔ | [reference LADDER](file:///workspace/reference.html#L708) 重做为 5 格：明确标注第 1 格"基线·完整玻璃（**非降级级**）"+ 4 个降级级 RT→contrast→@supports→print，与 checklist/design-system 文字完全对齐 |
| P1-6 | `prefers-reduced-data` 死代码 | ✔ | tokens.css/design-system.md/checklist.md 中 `reduced-data` 计数为 0，已在 tokens.css 内文档化删除理由 |
| P1-7 | z 阶梯语义滥用 | ✔ | scrim 三处统一 `--z-modal`；homebar 统一 `--z-toast`；刘海/灵动岛 `--z-sidebar`；fab-toast `--z-toast`、FAB `--z-fab`；app.md 与全部示例完全一致 |
| P1-8 | 分段控件两套 ARIA | ✔ | components.md 分段控件改 `role="tab"`+`aria-selected`+roving tabindex（L306/345），`aria-pressed` 模式删除；checklist L49 收录 tab/switch/slider/menu 完整模式；文档-验收单一致 |
| P1-9 | 触摸区 40px < 44px | ✔ | 全项目 `height:40px` 清零：wallet glass-chip 44px（L84）、转账/收款换真 `<button>`、account btn-block/destroy 同步 44px |
| P1-10 | 图标规范自我违规 | ✔ | stroke-width 2/3 清零（components.md 8 处均为 1.75）；sidebar Unicode 字符（☻/⚙/▤/⚐）全部换 SVG；扫码 icon 收编进 curated 集（icons.md 现声明 **21 icons**，与 CHANGELOG 一致） |
| P1-11 | blur 状态变量未定义 | ✔ | 维持（tokens.css L96-98 已定义，首评基线内即成立） |
| P1-12 | design-system scroll 示例无 rAF | ✔ | [design-system.md L214](file:///workspace/design-system.md#L214) 示例已套 rAF 节流 |
| P1-13 | 大量硬编码绕 token | ✔ | components.md `rgba(0,0,0,0.05)` 计数 0（改 `--btn-soft-bg`/`--btn-soft-border`）；`cubic-bezier(.25,.1,.25,1)`（ease 展开式）删除；app.md/wallet sheet 圆角改 `var(--r-panel)`；switch 轨道灰改 token |
| P1-14 | 暗色滚动发丝线不可见 | ✔ | account/wallet 改用 `--glass-hairline-light` 并配 dark 覆盖 `--glass-hairline-dark`（account L17/L49、wallet L21），符合 checklist `--glass-hairline-*` 要求 |
| P1-15 | 交互实现缺陷 | ◐ | 滑轨补 `touch-action:none`（liquid-controls L261）✓；liquid-controls checkbox 改为自持 `aria-label` 的独立 checkbox（label 包裹结构废除）✓；sidebar 初始化即 `syncShell()` + `matchMedia change` 监听，≤760px 时 aria-expanded 与视觉同步 ✓；**残留**：sidebar.html 折叠仍动画 `width`+`margin-left`（L35/L124），而 motion.md L182-198 规范样板已改为 transform translateX——示例与规范存在实现路径分歧（示例 L202 已自我声明为特性，非文档矛盾） |

### P2 轻微（4/5 已修复，1 项残留）

| 编号 | 首评问题 | 判定 | 修复证据 / 残留 |
|---|---|---|---|
| P2-1 | lang 不统一 / 无 meta description | ✔ | 6 页全部 `lang="zh-CN"`，全部补 `<meta name="description">` |
| P2-2 | reference 无 noscript、标题跳级、网格命名与响应式 | ✔ | 补 `<noscript>` 提示；标题层级 h1→h2（01/02 章节节）→h3；`ds-3col` 回归 3 列并加移动端折叠，4 列改 `ds-4col`；降级演示 5 列与 5 格匹配；`font-weight:550/650` 清零 |
| P2-3 | CI 瑕疵（sleep 竞态 / 无缓存 / 阈值 0.9 / 审计面 3/6） | ◐ | 就绪探测、`actions/cache@v4`、阈值 1.0、6/6 页面均已落地 ✓；**残留**：新增的 stylelint/htmlhint 只存在于 package.json scripts，[accessibility-ci.yml](file:///workspace/.github/workflows/accessibility-ci.yml) 无 lint step，lint 不会在 CI 强制执行 |
| P2-4 | 零测试 / 零 lint / 无 package.json | ✔ | 新增 package.json（lint:html/lint:css/a11y 三脚本 + devDeps）+ `.stylelintrc.json` + `.htmlhintrc`，CONTRIBUTING 更新本地自检命令 |
| P2-5 | 修复无提交记录 / token 零文档 | ✔ | 修复以独立提交 `ac26d59` 入库、CHANGELOG Unreleased 增补 2026-11-18 修复段（逐条核验属实）；design-system.md L41-43 补 `--link`/`--success`/`--danger` 及前景色变体文档；`--ease-spring-reverse` 在 motion.md L46 有语义说明 |

## 三、残留问题清单（本轮全部遗留，共 4 项，均为低危）

1. **components.md L106**：实时代码样例 h1 仍 `clamp(32px,6vw,52px)` / lh1.06，与本文件 L25 及全项目统一的 44px 矛盾——这是 H1 统一收口的最后一块碎片。建议：改为 `clamp(28px,5vw,44px)`，lh 1.08。
2. **liquid-controls.html L67**：hero 副文案 `max-width:620px`，其余 3 页均为 600px，CHANGELOG "normalized to 600px" 声明在此页未兑现。建议：620→600。
3. **CI 缺 lint step**：stylelint/htmlhint 配置与脚本齐全但 CI 不执行，质量门只覆盖 axe/Lighthouse。建议：CI 增加 `npm ci && npm run lint:css && npm run lint:html`（注意 devDeps 依赖 npm install，配合已有 cache）。
4. **sidebar.html 折叠动画**：仍过渡 `width`/`margin-left` 两个布局属性；motion.md 规范样板已是 transform 方案。建议：要么示例改为 transform（侧栏加 `will-change` 谨慎处理），要么在 motion.md 把"持久侧栏宽度折叠"增补为第二种已文档化例外，使示例与规范再次对齐。

## 四、最终评分

| 维度 | 首评 | 本轮 |
|---|---|---|
| 文档组织 / 结构 | ★★★★☆ | ★★★★☆ |
| Token 体系设计 | ★★★★☆ | ★★★★☆ |
| 规范一致性 | ★★☆☆☆ | ★★★★★ |
| 示例代码质量 | ★★★☆☆ | ★★★★☆ |
| 可访问性 | ★★☆☆☆ | ★★★★★ |
| 工程化 / 测试 | ★★☆☆☆ | ★★★★☆（缺 CI lint step） |

**综合：从 ★★★（2 星档）提升至 ★★★★★−（4 星档）。** 剩余 4 个残留点均为 <15 分钟的收尾工作量，修完后本 skill 的"Apple 级质量 / WCAG AA"核心主张与其实现将完全自洽。
