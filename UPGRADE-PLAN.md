# 升级计划：从「克制的玻璃点缀」走向「液态玻璃即控制层」

> 本计划基于对微信文章（`mp.weixin.qq.com/s/U7pkDJ3dAUng0aa14cqLsQ`，主题为 Apple WWDC 2025 的 **Liquid Glass** 设计语言）核心思想的提炼，结合本仓库（`apple-liquid-glass` skill）现状的差距分析制定。
>
> 由于微信反爬，原文无法直接抓取，核心论点由 Apple 官方 *Meet Liquid Glass* (WWDC 2025 Session 219)、Apple Newsroom 发布稿、以及多篇 Liquid Glass CSS 实现解析交叉还原。**本文档不改动任何代码，仅输出计划。**

---

## 一、文章核心思想提炼

文章围绕 Apple 在 WWDC 2025 发布的 **Liquid Glass（液态玻璃）** 设计语言展开，这是 Apple 称之为"有史以来最广泛的软件设计更新"，横跨 iOS 26 / iPadOS 26 / macOS Tahoe 26 / watchOS 26 / tvOS 26。其核心论点可归纳为以下七条：

### 1. Liquid Glass 是一种「数字超材料」，而非对物理玻璃的复刻

> "Rather than trying to simply recreate a material from the physical world, Liquid Glass is a new digital meta-material that dynamically bends and shapes light."

它不是拟物，而是一种**全新的数字材料**——动态地弯折与塑形光线。这意味着设计目标不是"像真玻璃"，而是"像一种会响应的数字物质"。

### 2. 它的行为是有机、液态的

> "It behaves and moves organically in a manner that feels more like a lightweight liquid, responding to both the fluidity of touch and the dynamism of modern apps."

它会像轻量液体一样**有机地运动与变形**，响应用户的触摸流畅度与应用本身的动态性。运动不是附加层，而是材料本身的属性。

### 3. 它是控制层与导航层的「主材」，而非点缀

Liquid Glass 覆盖范围**从最小元素（按钮、开关、滑块、文本、媒体控件）到最大元素（标签栏、侧边栏）**，以及系统级表面（锁屏、主屏幕、通知、控制中心）。控件被做成一个**悬浮于应用之上的独立功能层**——让位于内容、随需动态形变。

这与本 skill 当前的"glass is seasoning, not the dish（玻璃是调味料而非主菜）"哲学**直接构成张力**：文章主张玻璃**就是**控制/导航这道菜的主材。

### 4. 内容感知与情境自适应

- 颜色由周围内容决定，在明暗环境间智能切换；
- 实时渲染 + 镜面高光（specular highlights），随移动动态反应；
- 标签栏滚动时**收缩**以聚焦内容，回滚时**流体式展开**；
- 侧边栏**折射**背后内容、**反射**周围壁纸——始终保持情境感。

### 5. 与硬件的「同心」和谐

控件/工具栏/导航重新设计，与现代化硬件的圆角**完美同心**——建立硬件、软件、内容三者间的和谐。圆角不再只是视觉装饰，而是结构性的对齐语言。

### 6. 历史脉络：从 Aqua 到 visionOS 的累积

Liquid Glass 建立在五次演进之上：Mac OS X 的 **Aqua** → iOS 7 的**实时模糊** → iPhone X 的**流畅性** → **灵动岛**的灵活多用 → **visionOS** 的沉浸式界面。Apple 的材质偏好始终是：**模拟光线与材质质感，让数字界面具备可触感与空间感。**

### 7. 争议与边界条件（文章亦坦承）

发布初期遭到吐槽，集中在三点，这些正是 web 实现必须预先设防的：
- **暗色模式下通透性过高** → 控件内容可识别性骤降；
- **高光边缘抢占注意力** → 喧宾夺主；
- **GPU 开销大** → 低端设备帧率下降、耗电。

---

## 二、本 skill 现状与差距分析

### 现状定位

本 skill 命名为 `apple-liquid-glass`，但其**实际哲学是克制**，口号是：

> "Apple light grey-white ground + unified white surfaces + hairline dividers; **glass only where layers truly overlap. Restraint is the luxury.**"

它把玻璃严格限制在 nav / overlay / CTA 三处，其余一律纯白 + 软阴影。它甚至在 `design-system.md` 中明确写道：

> "the dynamic light refraction of native Liquid Glass cannot be fully replicated."

### 差距矩阵

| 维度 | 文章主张（真·Liquid Glass） | 本 skill 现状 | 差距性质 |
|---|---|---|---|
| **玻璃的角色** | 控制层/导航层的主材，覆盖按钮/开关/滑块/标签栏/侧边栏 | 调味料，仅 nav/overlay/CTA | **哲学级张力** |
| **玻璃的动态性** | 动态弯折光线、镜面高光、随移动反应、内容感知变色 | 静态 `backdrop-filter` 固定配方 | 表现力不足 |
| **自适应形变** | 标签栏滚动收缩/展开、控件让位内容、动态 morph | 仅 large-title 滚动折叠 + scroll-edge hairline | 形变词汇表过窄 |
| **内容感知** | 颜色由周围内容决定、明暗自适应 | 固定 `rgba(245,245,247,0.72)` 配方，无内容感知 | 缺失整层能力 |
| **侧边栏** | 折射背后内容 + 反射周围壁纸 | 未提供侧边栏组件 | 组件缺失 |
| **同心圆角** | 与硬件圆角同心对齐 | 有 radius 分层，但无"同心"对齐规则 | 缺对齐语言 |
| **明暗模式玻璃** | 智能切换、保持可读性 | 有 dark tokens，但玻璃配方在暗色下未单独调优 | 已部分覆盖，需深化 |
| **性能/降级** | （文章警示 GPU 开销） | 有 `prefers-reduced-transparency` 但无性能降级阶梯 | 缺分级降级 |
| **运动与材质** | 材料本身会"materialize"，运动是材料属性 | `motion.md` 已有 materialize（blur+scale+opacity），但仅用于召唤/ dismissal | 基础已具备，可扩展 |
| **克制 vs 表达** | 表达性、活力、delight | 极致克制、restraint is luxury | 需重新平衡 |

### 核心结论

本 skill 名为 Liquid Glass，实则践行的是 **apple.com / Apple Newsroom 的"克制白底"美学**，而**非** iOS 26 的 Liquid Glass 材料美学。文章的方向与本 skill 当前方向**部分冲突但可融合**：内容表面（文章/列表/表单）保持克制仍然正确；但**控制层与导航层**应当升级为真正的、动态的、内容感知的液态玻璃主材。

升级的本质是：**把玻璃从"被严格限制的点缀"提升为"控制/导航层的头等材料"，并赋予它动态、自适应、内容感知的活力——同时守住内容表面的克制与 web 的现实约束。**

---

## 三、升级愿景与设计原则

### 一句话愿景

> **内容表面克制如初（白底 + 发丝线 + 灰阶），控制层与导航层升级为动态、内容感知、会形变的液态玻璃——让"玻璃"真正成为这道菜的主材，而非调味料。**

### 五条升级原则（在现有 5 条哲学之上叠加）

1. **玻璃分层级，主材有主位。** 区分「内容表面」（纯白 + 阴影，克制）与「控制/导航表面」（液态玻璃主材，动态）。玻璃不再仅限 nav/overlay/CTA，而是覆盖**整个交互控制层**：按钮组、工具栏、标签栏、侧边栏、分段控件、浮岛。
2. **动态是材料的属性，不是动画的附加。** 玻璃的模糊强度、饱和度、高光、形变随**滚动 / 悬停 / 聚焦 / 内容明暗**实时响应。`backdrop-filter` 不再是一个静态值，而是一个状态函数。
3. **内容感知而非固定配方。** 玻璃的颜色与对比度由背后内容驱动：明内容上自动加暗化层，暗内容上保持通透；明暗模式切换时玻璃配方随之改变。
4. **形变词汇表要完整。** 标签栏滚动收缩/展开、控件让位内容、悬浮态抬起与高光、侧边栏折射——这些都是"玻璃作为活物"的基本动作，需作为标准组件提供。
5. **Web 现实约束是硬边界。** 无法做实时折射/镜面高光；必须提供性能降级阶梯与 `prefers-*` 三件套；暗色模式玻璃可读性是第一优先级。**克制仍是内容表面的奢侈品。**

### 与现有哲学的兼容性

现有 5 条哲学**全部保留**，升级原则是**叠加**而非替换：
- "Unified surface > fragmented cards" → 仍适用于内容表面；
- "Glass is seasoning" → **修订为"Glass is seasoning on content, but the main material on the control layer"**；
- "Restraint is luxury" → 仍适用于内容表面与装饰决策；控制层的"表达性"不等于"堆砌"；
- "Hierarchy from weight + size + grayscale" → 仍适用，颜色仍是 accent only；
- "Quality is in the details" → 升级后细节更多（高光、形变、自适应），要求更高。

---

## 四、分阶段升级计划

按"先地基、后表现、再组件、最后验收"的顺序，分四个阶段。每个阶段产出明确的文件改动清单（本计划仅列出，不执行）。

### 阶段 0：哲学与文档对齐（地基）

**目标**：让 skill 的自我认知从"克制白底"校准为"内容克制 + 控制层液态玻璃"的双轨模型。

| 文件 | 改动要点 |
|---|---|
| `SKILL.md` | 1) 修订一句话口号为双轨："内容表面：白底 + 发丝线 + 克制；控制层：液态玻璃主材 + 动态形变。" 2) 修订第 2 条哲学"Glass is seasoning"为分层表述。 3) 在 workflow 中新增"判断当前表面属于内容层还是控制层"的决策步骤。 4) Anti-slop 列表保留，新增"控制层不要做成纯白"反例。 |
| `design-system.md` | 1) Philosophy 第 2 条改为分层。 2) 新增 **§4.1 控制层液态玻璃规格**（区别于现有仅 nav/overlay 的配方）。 3) 新增"玻璃状态函数"概念表（见下文阶段 1）。 4) 修订 glass 出现位置清单：从 nav/overlay/CTA 扩展到"所有交互控制层"。 |
| `README.md` / `README.zh-CN.md` | 同步口号与"what's in the box"描述，明确双轨模型。 |

**验收**：文档自洽，口号与哲学不再与"liquid glass"命名矛盾；读者能清晰区分两层。

---

### 阶段 1：Token 与配方升级（材料科学）

**目标**：把玻璃从"一个静态配方"升级为"一组状态感知的配方族"。

#### 1.1 `tokens.css` 新增「液态玻璃状态变量」

```
/* 概念性命名（具体值在执行阶段确定） */
--glass-blur-rest / --glass-blur-active / --glass-blur-scrolled
--glass-sat-rest / --glass-sat-active
--glass-tint-light / --glass-tint-dark          /* 内容明暗自适应着色 */
--glass-highlight: rgba(255,255,255,0.x)        /* 顶部高光边 */
--glass-edge: 1px solid rgba(255,255,255,0.22)  /* 同心高光描边 */
--glass-shadow-control / --glass-shadow-floating
--glass-radius-concentric                        /* 与容器圆角同心的内/外圆角关系 */
```

#### 1.2 `design-system.md` §4 重写为「液态玻璃配方族」

定义**三档玻璃**（对应 Apple HIG 的 regular / clear，并新增 web 专用的 adaptive）：

| 档位 | 用途 | 配方要点 |
|---|---|---|
| **Regular（承重）** | 承载文字的控制层：工具栏、标签栏、侧边栏、模态 | `blur(20px) saturate(180%)` + 明暗自适应着色层；文字必须达到 WCAG AA |
| **Clear（通透）** | 悬浮于富媒体之上：图片/视频上的浮岛控件 | `blur(8–12px)` 无亮度偏移；明内容上加 `rgba(0,0,0,0.35)` 暗化层 |
| **Adaptive（自适应，web 新增）** | 滚动形变控件：标签栏、large-title nav | 状态函数：rest/active/scrolled 三态，blur 与 shadow 随状态变化 |

#### 1.3 暗色模式玻璃单独调优

当前 dark mode 只换了 tokens，玻璃配方沿用亮色。需新增：
- 暗色下玻璃底色从 `rgba(245,245,247,0.72)` 改为 `rgba(28,28,30,0.72)`；
- 暗色下提高文字对比度（vibrancy：加粗 + 字距 + 更高前景对比）；
- 暗色下降低高光强度，避免边缘抢注意力（文章警示点）。

#### 1.4 性能降级阶梯

```
prefers-reduced-transparency: reduce  → 纯色 + 无 blur（已有，保留）
prefers-reduced-data: save            → 关闭 saturate，仅保留 blur（新增）
低端设备检测 (navigator.hardwareConcurrency ≤ 4 等) → 降低 blur 半径或回退纯色
```

**验收**：玻璃配方从 1 个变为"3 档 × 2 模式 × 3 降级态"的明确矩阵；所有配方在暗色下文字可读性达标。

---

### 阶段 2：组件层升级（控制层主材化）

**目标**：把玻璃从"仅 nav/overlay/CTA"扩展到完整控制层组件库。

#### 2.1 `components.md` 新增/升级组件

| 组件 | 现状 | 升级 |
|---|---|---|
| **玻璃工具栏/操作栏** | 无 | 新增：悬浮于内容上的工具栏，regular 玻璃，滚动时 blur 加深 |
| **玻璃标签栏（web 版）** | 无（仅 app.md 有 iOS tab bar） | 新增：web 顶部/底部标签栏，滚动收缩/展开形变 |
| **玻璃侧边栏** | 无 | 新增：macOS 风格侧边栏，折射背后内容（`backdrop-filter` + 内容层），支持折叠 |
| **玻璃分段控件** | 有（纯白 pill） | 升级：active pill 改为液态玻璃材质（blur + 高光边），非 active 透明 |
| **玻璃浮岛按钮** | 有 secondary（半透明白） | 升级：明确的"浮岛"按钮——玻璃材质 + 顶部高光边 + 悬停抬起 + 同心圆角 |
| **玻璃开关/滑块** | 无 | 新增：iOS 风格开关与滑块，轨道玻璃化，把手高光 |
| **悬浮 FAB/动作岛** | 无 | 新增：右下角悬浮动作按钮，clear 玻璃，content 上加暗化层 |

#### 2.2 同心圆角规则

在 `design-system.md` 新增"同心圆角"规则：
- 玻璃控制层容器的**内圆角 = 外圆角 − padding**（如外 22px、padding 4px → 内 18px）；
- 嵌套玻璃层遵循"外大内小、差值为间距"的同心关系，呼应硬件圆角。

#### 2.3 内容感知暗化层

为 clear 玻璃组件提供标准"内容明暗探测"模式：
- 纯 CSS 方案：在玻璃层下放置 `backdrop` 暗化层，默认 `rgba(0,0,0,0.35)`；
- 进阶（可选）：用 `@media (prefers-color-scheme)` + 容器查询切换暗化强度。

**验收**：控制层组件齐全；玻璃不再是"只在 nav/overlay/CTA 出现的稀客"；同心圆角规则可执行。

---

### 阶段 3：运动与形变升级（材料会动）

**目标**：让玻璃控制层"活"起来——形变、自适应、内容感知的运动。

#### 3.1 `motion.md` 扩展「控制层动态形变」章节

现有 `motion.md` 聚焦"召唤/ dismissal 的流体运动"。新增章节覆盖**控制层常驻动态**：

| 形变 | 触发 | 实现 |
|---|---|---|
| **标签栏滚动收缩** | 内容滚动 | `scroll` 监听 → 切换 `.compact` 类 → height/blur/shadow 过渡 |
| **工具栏让位** | 内容滚动接近 | 玻璃 blur 减弱、高度收缩、文字字号缩小 |
| **悬浮态抬起 + 高光** | hover/focus | `translateY(-2px)` + 顶部高光边增强 + shadow 加深 |
| **聚焦态光晕** | focus | 玻璃边缘出现 focus ring（与 `--focus-ring` 协同） |
| **按压态内陷** | active | `scale(0.97)` + 高光减弱（材料被"按下"） |
| **内容明暗切换** | 背景内容变化 | 暗化层 opacity 过渡（`prefers-reduced-motion` 下瞬切） |

#### 3.2 玻璃 materialize 扩展到常驻态

现有 materialize（blur+scale+opacity）仅用于"召唤"。扩展为：**玻璃的 blur 半径本身是可过渡属性**，在状态切换（rest→active→scrolled）时平滑过渡，使材料"呼吸"。注意：`backdrop-filter` 过渡在某些浏览器有性能成本，需在降级阶梯中处理。

#### 3.3 侧边栏折射动画

侧边栏展开/折叠时，背后内容的模糊度随之过渡（折叠时内容被折射得更模糊，展开时清晰），强化"玻璃在塑造光线"的感知。

**验收**：控制层组件至少具备 3 种状态形变；所有形变在 `prefers-reduced-motion` 下退化为瞬切或交叉淡入。

---

### 阶段 4：App 层与示例升级（端到端验证）

**目标**：把升级落到 `app.md`、`reference.html`、`examples/`，确保可验证。

#### 4.1 `app.md` 升级

- iOS 标签栏从"固定玻璃"升级为"滚动收缩/展开形变"（文章重点特性）；
- 新增"侧边栏折射"组件（iPadOS 风格）；
- large-title 折叠 nav 的玻璃配方接入阶段 1 的 adaptive 档；
- 控件（开关/滑块/分段）全部玻璃化。

#### 4.2 `reference.html` 重制

- 新增"控制层液态玻璃"专区：展示工具栏/标签栏/侧边栏/浮岛按钮/分段控件；
- 演示滚动形变（标签栏收缩）、悬停抬起、明暗模式玻璃切换；
- 保留现有"内容表面克制"专区，形成双轨对照。

#### 4.3 `examples/` 新增示例

- `examples/toolbar.html`：web 玻璃工具栏 + 滚动形变；
- `examples/sidebar.html`：折射侧边栏；
- `examples/liquid-controls.html`：玻璃控件全家桶（开关/滑块/分段/浮岛）；
- 升级 `examples/account.html` / `examples/wallet.html`：把现有 nav/overlay 接入新配方，标签栏接入滚动形变。

#### 4.4 `checklist.md` 新增检查项

- [ ] 控制层组件使用液态玻璃（regular/clear/adaptive），而非纯白；
- [ ] 玻璃配方随状态（rest/active/scrolled）形变；
- [ ] 暗色模式玻璃文字达 WCAG AA；
- [ ] 同心圆角规则已应用；
- [ ] 性能降级三阶梯已配置；
- [ ] 侧边栏/标签栏有折射或形变行为。

**验收**：`reference.html` 双轨对照清晰；新示例可在浏览器中演示形变；checklist 覆盖所有新增能力。

---

## 五、风险与权衡

| 风险 | 应对 |
|---|---|
| **web 无法做实时折射/镜面高光** | 诚实标注"web 近似"；用 `backdrop-filter` + 暗化层 + 高光边模拟；不假装能达到原生效果 |
| **`backdrop-filter` 性能成本** | 性能降级阶梯（阶段 1.4）；`will-change` 谨慎使用；低端设备回退纯色 |
| **暗色模式可读性**（文章警示点） | 阶段 1.3 单独调优；glass 文字 vibrancy 规则；checklist 强制 WCAG AA |
| **过度玻璃化破坏克制** | 严格区分"内容层 vs 控制层"；内容表面仍纯白；anti-slop 新增"控制层别做成纯白"反向也保留"内容层别做成玻璃" |
| **与现有"restraint is luxury"口号冲突** | 口号修订为双轨；明确"克制针对内容，表达针对控制层" |
| **浏览器兼容** | `-webkit-backdrop-filter` 双写；不支持的浏览器回退为半透明纯色（graceful degradation） |
| **组件复杂度上升** | 每个新组件配独立示例；`components.md` 保持 copy-paste 友好；不引入构建步骤 |

---

## 六、与 `apple-design` skill 的关系

本仓库的 `motion.md` 已声明改编自 `emilkowalski/skills` 的 `apple-design`（MIT）。该上游 skill 的核心是 *Designing Fluid Interfaces* (WWDC 2018) 的流体运动原则。本次升级的**运动/形变**部分应继续与该上游保持概念一致（springs、interruptibility、velocity handoff），**材料/玻璃**部分则是本 skill 的独立演进方向，向上游回馈时需明确标注为" Liquid Glass (WWDC 2025) 扩展"。

---

## 七、成功标准

升级完成后，应满足：

1. **命名自洽**：skill 名为 `apple-liquid-glass`，其控制层组件确实以液态玻璃为主材，不再与"glass is seasoning"自相矛盾。
2. **双轨清晰**：读者/agent 能在 30 秒内区分"内容表面（克制白底）"与"控制层（液态玻璃主材）"，并知道何时用哪个。
3. **动态可感**：`reference.html` 中至少 3 个控制层组件展示状态形变（滚动收缩/悬停抬起/明暗切换）。
4. **暗色达标**：所有玻璃组件在 dark mode 下文字对比度达 WCAG AA。
5. **降级完整**：三档 `prefers-*` + 低端设备检测均有明确回退路径。
6. **不破坏现有**：现有 `examples/account.html` / `wallet.html` 的内容表面外观不变，仅控制层升级。
7. **可 copy-paste**：所有新组件仍为纯 HTML/CSS，无构建步骤，无新依赖。

---

## 八、执行顺序建议

```
阶段 0（文档对齐）→ 阶段 1（token/配方）→ 阶段 2（组件）→ 阶段 3（运动/形变）→ 阶段 4（app/示例/验收）
```

每个阶段独立可验收，可分多次提交。阶段 0 与阶段 1 可并行起草；阶段 2 依赖阶段 1 的 token；阶段 3 依赖阶段 2 的组件；阶段 4 依赖前三者。

---

## 附：文章核心论点一句话索引

| 论点 | 出处 |
|---|---|
| Liquid Glass 是数字超材料，非物理复刻 | *Meet Liquid Glass*, WWDC 2025 Session 219 |
| 有机液态行为，响应触摸与动态 | 同上 |
| 控制层主材，从按钮到标签栏 | Apple Newsroom 2025-06-09 发布稿 |
| 内容感知、明暗自适应、镜面高光 | 同上 |
| 标签栏滚动收缩/展开 | 同上 |
| 侧边栏折射背后内容 + 反射壁纸 | 同上 |
| 与硬件圆角同心 | 同上 |
| 历史脉络：Aqua→iOS7→iPhone X→灵动岛→visionOS | *Meet Liquid Glass* 开场 |
| 暗色可读性 / GPU 开销 争议 | 多篇评测 + 赛复观察科普文 |
