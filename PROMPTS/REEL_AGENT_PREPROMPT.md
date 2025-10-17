## YDB Reels — Agent Preprompt

### Purpose
- Build Motion Canvas reels that explain YDB internals. Each workspace is a reel; scenes are animated explanations.

### How this repo works
- Monorepo with npm workspaces. Workspaces: `3dc-data-recording`, `template`.
- Scene wiring lives in TypeScript: `src/project.ts` via `makeProject` with `scenes`.
- Visual settings (canvas size, fps, exporter) live in `src/project.meta` only.
- Dev/build (from repo root): install `npm install`; start `npm run start -w <workspace>`; build `npm run build -w <workspace>`.


### Creating a new reel
- Copy `template` to a new folder at the repo root (e.g., `joins-explained`).
- **CRITICAL**: Update `YOUR_REEL/package.json` → change `"name"` field to match folder name (e.g., `"joins-explained"`).
- Add the new folder to the root `package.json` `workspaces` array.
- In `YOUR_REEL/src/project.ts`, import your first scene with `?scene` and list it in `scenes`.
- Set canvas size/fps in `YOUR_REEL/src/project.meta`:
  - Vertical format: `1080×1920` via `shared.size`
  - Use `rgb()` format for background colors (e.g., `"background": "rgb(10,14,39)"`).

### Creating a new scene
- Create `YOUR_REEL/src/scenes/MyScene.tsx` exporting a 2D scene.
- In `YOUR_REEL/src/project.ts`, import `./scenes/MyScene?scene` and add it to the `scenes` array (order = playback).

### Brand intro and outro (MANDATORY)

**Rules:**
- **EVERY reel MUST start and end with branded scenes** for consistency
- Place BrandIntro first and BrandOutro last in the `scenes` array
- Content scenes go between them
- **CRITICAL**: Use the YdbIcon component from `../assets/icons/YdbIcon` - do NOT use inline SVG paths
- Import: `import YdbIcon from '../assets/icons/YdbIcon';`
- **CRITICAL**: Use the 3dc-data-recording pattern as the reference implementation

**BrandIntro pattern (from 3dc-data-recording/src/scenes/example.tsx):**
1. Show reel topic title (e.g., "Interconnect") for 3 seconds
2. Fade out topic title
3. YDB icon fades in at starting position
4. Icon moves up (y: -165 → -300) while "YDB" text appears below (y: 200)
5. Hold briefly (~1.5s)
6. Both fade out

Required implementation:
```tsx
import YdbIcon from '../assets/icons/YdbIcon';

export default makeScene2D(function* (view) {
  const ydbIconRef = createRef<Node>();
  const initialTitle = createRef<Txt>();

  // Use YdbIcon component
  view.add(<YdbIcon ref={ydbIconRef} x={-195} y={-165} scale={5} opacity={0} />);

  view.add(<Txt ref={initialTitle} text="Your Topic" fontSize={80} 
    fill="#1185f8ff" fontWeight={700} textAlign="center" 
    x={0} y={0} textWrap={true} marginLeft={50} marginRight={50} opacity={0} />);

  // Show topic title
  yield* initialTitle().opacity(1, 0.5);
  yield* waitFor(3);
  yield* initialTitle().opacity(0, 0.5);

  // Show YDB icon
  yield* ydbIconRef().opacity(1, 1);
  yield* waitFor(0.5);

  // Move icon up and show YDB title
  yield* all(
    ydbIconRef().y(-300, 0.5),
    initialTitle().y(200, 0.5),
    initialTitle().fontSize(130, 0.5),
    initialTitle().text('YDB', 0.5),
    initialTitle().opacity(1, 0.5),
  );

  yield* waitFor(1.5);
  yield* all(ydbIconRef().opacity(0, 0.5), initialTitle().opacity(0, 0.5));
});
```

**BrandOutro pattern (from 3dc-data-recording/src/scenes/example.tsx):**
1. YDB icon fades in at starting position
2. Wait 1 second
3. Icon moves to top (y: -300) with "YDB" text appearing (y: 200, fontSize: 130)
4. Hold briefly (~1s)
5. "YDB" text fades out
6. Text changes to "Scale it easy" at original size
7. "Scale it easy" fades in
8. Hold (~3s)

Required implementation:
```tsx
import YdbIcon from '../assets/icons/YdbIcon';

export default makeScene2D(function* (view) {
  const ydbIconRef = createRef<Node>();
  const initialTitle = createRef<Txt>();

  // Use YdbIcon component
  view.add(<YdbIcon ref={ydbIconRef} x={-195} y={-165} scale={5} opacity={0} />);

  view.add(<Txt ref={initialTitle} text="" fontSize={70} 
    fill="#1185f8ff" fontWeight={700} textAlign="center" 
    x={0} y={0} textWrap={true} marginLeft={50} marginRight={50} opacity={0} />);

  yield* all(ydbIconRef().opacity(1, 2.5));
  yield* waitFor(1);
  
  yield* all(
    ydbIconRef().y(-300, 0.5),
    initialTitle().y(200, 0.5),
    initialTitle().fontSize(130, 0.5),
    initialTitle().text('YDB', 0.5),
    initialTitle().opacity(1, 0.5),
  );
  
  yield* waitFor(1);
  yield* all(
    initialTitle().opacity(0, 0.5),
    initialTitle().text('', 0.5),
    initialTitle().fontSize(70, 0.5),
  );

  yield* all(waitFor(0.5), initialTitle().text('Scale it easy', 0));
  yield* initialTitle().opacity(1, 0.5);
  yield* waitFor(3);
});
```

**File naming:**
- Intro: `src/scenes/BrandIntro.tsx`
- Outro: `src/scenes/BrandOutro.tsx`
- Import with `?scene` suffix in project.ts

**Scene order in project.ts:**
```tsx
scenes: [
  brandIntro,     // Required first
  intro,          // Your content intro
  // ... content scenes ...
  brandOutro,     // Required last
]
```

### Correct import patterns (CRITICAL)

**ALWAYS use these exact import paths** to avoid build errors:

```tsx
// Scene and components
import {makeScene2D} from '@motion-canvas/2d/lib/scenes';
import {Txt, Rect, Circle, Line, Node, Path, Layout} from '@motion-canvas/2d/lib/components';

// Flow control and refs
import {all, waitFor, sequence, chain, loop} from '@motion-canvas/core/lib/flow';
import {createRef} from '@motion-canvas/core/lib/utils';

// Types and utilities
import {Vector2, Direction} from '@motion-canvas/core/lib/types';
import {easeOutCubic, easeInCubic} from '@motion-canvas/core/lib/tweening';

// Colors (workspace-local)
import {TEXT_COLOR, PRIMARY_COLOR, SUCCESS_COLOR} from '../assets/colors';

// Icons (direct file imports, NOT barrel imports)
import YdbIcon from '../assets/icons/YdbIcon';
import DatabasesIcon from '../assets/icons/DatabasesIcon';
import ClusterIcon from '../assets/icons/ClusterIcon';
```

**Common mistakes to avoid:**
- ❌ `import {makeScene2D, Txt} from '@motion-canvas/2d'` — too generic
- ❌ `import {createRef} from '@motion-canvas/core/lib/flow'` — wrong module
- ❌ `import {DatabasesIcon} from '../assets/icons'` — barrel imports don't exist

**When in doubt**: Check `template/src/scenes/example.tsx` for reference imports.

### Icon library (components + metadata)
- Location: `template/src/assets/icons/`
- Metadata type: `IconMeta` (fields: `id`, `name`, `description`, optional `tags`, `recommended` with `scale`, `x`, `y`, `colorNotes`).
- Usage pattern: import the icon component (default export) from its file and place it in your scene; animate via standard Node props/signals (`x`, `y`, `scale`, `opacity`, etc.). Keep brand colors unless the storyboard requires overrides.
- **Color handling**: All icons accept an optional `fill` prop (defaults to `#2399FF`). Pass color explicitly: `<DatabasesIcon fill={PRIMARY_COLOR} />`. Do NOT use CSS `currentColor` - Motion Canvas doesn't support it.
- **Scale values**: Recommended scales are starting points; adjust based on visual context (e.g., ClusterIcon often works better at 0.2 vs recommended 0.5 in dense layouts).

### Available icons
- YdbIcon
  - id: `ydb-icon`
  - name: YDB Logo
  - description: Official YDB logo as vector Paths for Motion Canvas; use for branding/intros in YDB-related scenes; supports standard Node props and animations.
  - tags: logo, ydb, brand, database
  - recommended: `scale: 5`, `x: -195`, `y: -165`, `colorNotes: primary #2399FF; white inner paths`
  - File: `template/src/assets/icons/YdbIcon.tsx`
  - Notes: Keep proportions when scaling; sub-paths are animatable if needed.
 - DiskIcon
  - id: `disk-icon`
  - name: Disk
  - description: Stylized disk glyph for racks/storage visuals; animatable as a Node; use DISK_COLOR for default, SUCCESS_DISK_COLOR for highlight, ERROR_COLOR for failures.
  - tags: disk, storage, rack, ydb
  - recommended: `scale: 2`, `x: -105`, `y: 0`, `colorNotes: default via DISK_COLOR; animate fill for transitions`
  - File: `template/src/assets/icons/DiskIcon.tsx`
 - ClusterIcon
  - id: `cluster-icon`
  - name: Cluster
  - description: Cluster/datacenter topology icon for YDB infrastructure visuals. Use for cluster overviews, datacenter representations, or infrastructure diagrams.
  - tags: cluster, datacenter, infrastructure, topology, ydb
  - recommended: `scale: 0.5`, `x: 0`, `y: 0`, `colorNotes: accepts fill prop (default #2399FF)`
  - File: `template/src/assets/icons/ClusterIcon.tsx`
 - DatabasesIcon
  - id: `databases-icon`
  - name: Databases
  - description: Database/storage icon for YDB database representations. Use for database listings, storage visualizations, or data management scenes.
  - tags: databases, storage, data, management, ydb
  - recommended: `scale: 3`, `x: 0`, `y: 0`, `colorNotes: accepts fill prop (default #2399FF)`
  - File: `template/src/assets/icons/DatabasesIcon.tsx`
 - MonitoringIcon
  - id: `monitoring-icon`
  - name: Monitoring
  - description: Chart/monitoring icon for YDB metrics and monitoring visuals. Use for monitoring dashboards, metrics charts, or performance visualization scenes.
  - tags: monitoring, charts, metrics, performance, ydb
  - recommended: `scale: 4`, `x: 0`, `y: 0`, `colorNotes: accepts fill prop (default #2399FF)`
  - File: `template/src/assets/icons/MonitoringIcon.tsx`

### Color palette

- Global/brand
  - YDB_BLUE: #2399FF

- Template (default reel palette)
  - TEXT_COLOR: #2399FF
  - SUCCESS_COLOR: #00fa92ff
  - ERROR_COLOR: #ff1100ff
  - PRIMARY_COLOR: #0317f4ff
  - BORDER_COLOR: #1a52f9ff

- 3dc-data-recording (workspace-specific palette)
  - DC_COLOR: #a8b2ffff
  - DISK_COLOR: #1185f8ff
  - DISK_ACTIVE_COLOR: #9BB5D1
  - SUCCESS_DISK_COLOR: #00ff6aff
  - TEXT_COLOR: #0053f9ff
  - SUCCESS_COLOR: #00fa92ff
  - ERROR_COLOR: #ff1100ff
  - PRIMARY_COLOR: #0317f4ff
  - FAILURE_DC_COLOR: #ff000080
  - BORDER_COLOR: #1a52f9ff

Usage
- Import colors from `YOUR_REEL/src/assets/colors.ts` instead of hardcoded hex values.
- Example: `import {TEXT_COLOR, PRIMARY_COLOR} from '../assets/colors';`

### Docs-driven workflow (RAG)

**CRITICAL: Documentation research is MANDATORY before creating any reel**

**Step 1: Deep documentation analysis (REQUIRED)**
1. **Search broadly first**: Run multiple doc queries with different terms to understand the topic comprehensively
   - Use core concept terms: `"tablets architecture"`, `"tablet state storage"`, `"tablet leader follower"`
   - Use scenario terms: `"tablet failover"`, `"tablet lifecycle"`, `"tablet bootstrapper"`
2. **Read thoroughly**: Read ALL relevant documentation chunks, not just the top results
3. **Analyze deeply**: Understand the complete picture:
   - What is the core concept?
   - What are the key components and their relationships?
   - What are the sequences of operations (flows)?
   - What are the edge cases and failure modes?
   - What are the guarantees and invariants?
4. **Extract visuals**: Identify what should be visualized:
   - Component diagrams (architecture, topology)
   - Sequence diagrams (flows, interactions)
   - State diagrams (lifecycle, transitions)
   - Failure scenarios (error handling, recovery)
5. **Think deeply**: Don't start coding immediately. Plan the visual narrative first.

**Step 2: Source docs**
- Local mirror: `knowledge/ydb-docs/` (mirrors YDB docs)
- Upstream reference: [YDB docs](https://github.com/ydb-platform/ydb/tree/main/ydb/docs/en)
- Refresh instructions: see `knowledge/README.md`

**Step 3: Build/update the local index**
- Build: `node scripts/build-docs-index.mjs` → outputs `knowledge/ydb-docs.index.json`
- Query: `node scripts/query-docs.mjs "<query terms>"`
- Use queries like: `"quorum replication failover"`, `"mvcc transactions"`, `"backup recovery"`

**Step 4: Content design principles (MANDATORY)**

**Visual-first approach:**
- ❌ **WRONG**: Text-heavy slides with bullet points
- ✅ **RIGHT**: Animated diagrams, schemas, and visual flows with minimal text

**Text usage rules:**
- Text is **supporting**, not primary content
- Keep text **concise**: 1-2 short sentences per screen maximum
- Use text for:
  - Scene titles (1-5 words)
  - Key terms/labels on diagrams (1-3 words)
  - Brief explanations of what's happening (1 sentence)
- **Avoid**:
  - Paragraphs of text
  - Bullet point lists
  - Long explanations
  - Redundant descriptions of what's visible

**Prefer visual storytelling:**
1. **Component diagrams**: Show architecture with boxes, connections, labels
2. **Animated flows**: Show data/command movement with arrows that animate
3. **State changes**: Show components changing color, size, or appearance
4. **Sequences**: Show step-by-step processes with timed animations
5. **Failure scenarios**: Show errors with visual indicators (red colors, X marks)

**Example structure:**
```
Scene: Tablet Failover
❌ WRONG:
- Text: "When a node fails, the tablet leader is lost"
- Text: "Hive detects the failure"
- Text: "A new leader is elected on another node"

✅ RIGHT:
- Title: "Tablet Failover"
- Visual: Node with tablet (green box)
- Animation: Node turns red, X appears
- Text (brief): "Connection lost"
- Animation: Arrow from Hive to new node
- Visual: New tablet appears (green), generation number increments
- Text (brief): "Service continues"
```

**Step 5: Use docs to author reels**
- Create a short scenario spec: title, summary, actors, preconditions, postconditions
- For each scene:
  - Visual diagram type (sequence/topology/state/flow)
  - Animated elements (what moves, changes, appears)
  - Minimal text (title + 1-2 brief labels/explanations)
  - Doc citation (file path + chunk id from query output)
- Animate flows and state changes (acks, retries, failover) rather than static slides
- Keep terminology consistent with docs

**Step 6: Quality gates**
- Steps and invariants match the cited docs; failure modes/limits reflected
- Terms and metrics (acks/quorum, latency) mirror the source text
- Visuals tell the story; text is minimal and supporting
- Every animation serves a purpose (shows flow, change, or interaction)
- Re-run queries when claims change; update citations in scene metadata/comments

### Creating informative diagrams

**Progressive element reveal pattern:**
- Build understanding by revealing elements progressively, not all at once
- Show base elements first (e.g., nodes, containers)
- Then add connecting elements (e.g., lines, arrows)
- Then add labels and annotations to explain what's shown
- Finally add supplementary information text

**Example pattern from interconnect-explained:**
```tsx
// 1. Show title
yield* titleRef().opacity(1, 0.8);
yield* waitFor(0.2);

// 2. Show description
yield* descRef().opacity(1, 0.7);
yield* waitFor(0.3);

// 3. Show main components (nodes)
yield* all(
  node1Ref().opacity(1, 0.6),
  node2Ref().opacity(1, 0.6)
);
yield* waitFor(0.3);

// 4. Show connection layer
yield* interconnectRef().opacity(0.9, 0.8);
yield* waitFor(0.4);

// 5. Animate connecting lines
yield* all(
  line1Ref().opacity(1, 0.3),
  line1Ref().end(1, 0.6),
  line2Ref().opacity(1, 0.3),
  line2Ref().end(1, 0.6)
);
yield* waitFor(0.3);

// 6. Add informational labels
yield* all(
  tcpLabel1Ref().opacity(1, 0.5),
  tcpLabel2Ref().opacity(1, 0.5)
);
yield* waitFor(0.5);

// 7. Add supplementary info
yield* infoLabelRef().opacity(1, 0.6);
```

**Making diagrams informative:**
1. **Add protocol/technology labels**: Show what's being used (e.g., "TCP", "HTTP", "gRPC")
2. **Label roles**: Identify actors clearly (e.g., "Sender", "Receiver", "Leader", "Follower")
3. **Show state**: Display current state or values (e.g., "Connected", "2ms latency", "Generation: 42")
4. **Explain purpose**: Brief text explaining what component does (e.g., "Message routing & serialization")
5. **Progressive detail**: Start simple, add detail as scene progresses

**Informative text placement:**
- **Titles**: Top of scene (y: -420 to -450)
- **Descriptions**: Below title (y: -340 to -370)  
- **Component labels**: Near or inside components
- **Supplementary info**: Bottom or near interactive elements (y: 300 to 400)
- **Role labels**: Above actors/components (small offset, e.g., y: -310 for component at y: -280)

**Visual feedback patterns:**
1. **Success indicators**: Change color to SUCCESS_COLOR, increase scale slightly
2. **Active state**: Brighter colors, animated pulse/glow effects
3. **Flow direction**: Animated arrows with `end={0}` to `end={1}`
4. **Relationships**: Lines connecting related components
5. **Hierarchy**: Size differences, Z-index layering, opacity variations

**Example: Informative message flow scene:**
```tsx
// Show sender/receiver labels
<Txt ref={senderLabelRef} text="Sender" fontSize={26} 
  x={-300} y={-310} opacity={0} />
<Txt ref={receiverLabelRef} text="Receiver" fontSize={26}
  x={300} y={-310} opacity={0} />

// Show message label on arrow
<Txt ref={messageLabelRef} text="Message" fontSize={30}
  x={0} y={-100} opacity={0} />

// Show protocol/connection type
<Txt ref={protocolLabelRef} text="TCP" fontSize={28}
  x={-380} y={-135} opacity={0} />

// Show outcome
<Txt ref={receivedLabelRef} text="Message received" fontSize={32}
  fill={SUCCESS_COLOR} y={320} opacity={0} />
```

### Motion Canvas patterns & best practices

**Reference handling (CRITICAL)**
- When creating multiple refs for animation, store the `createRef()` return value itself, not the dereferenced value
- **Simple pattern (recommended for most cases)**:
  ```tsx
  const ref1 = createRef<Circle>();
  const ref2 = createRef<Circle>();
  const refs = [ref1, ref2];  // Simple array, no type annotation needed
  
  // Later, animate:
  refs.map(ref => ref().fill(COLOR, 0.5))  // Dereference with () when using
  ```
- **Dynamic creation (for loops/maps)**:
  ```tsx
  const refs = items.map(() => createRef<Circle>());
  // Or if you need explicit typing:
  // const refs: ReturnType<typeof createRef<Circle>>[] = [];
  
  items.map((item, i) => <Circle ref={refs[i]} />);
  // Later: refs.map(ref => ref().fill(COLOR, 0.5))
  ```
- **WRONG patterns**:
  ```tsx
  const refs: Circle[] = [];  // ❌ Don't type as the component
  refs.push(ref());  // ❌ DON'T dereference before mount - will be undefined
  refs.map(ref => ref.fill(COLOR, 0.5))  // ❌ Will fail - ref is a function, not component
  ```
- Key rule: Store the ref, dereference when using: `ref()` not `ref`

**Component wrapping**
- Icons are Node components; wrap them in a Node if you need to animate the wrapper separately
- Example: `<Node ref={iconRef} scale={2.5}><DatabasesIcon fill={PRIMARY_COLOR} /></Node>`
- Pass icon-specific props (like `fill`) directly to the icon component, not the wrapper Node

**Color values**
- Motion Canvas requires explicit color values (hex, rgb, etc.)
- CSS keywords like `currentColor`, `inherit` are NOT supported
- Always use color constants from `../assets/colors` or explicit hex values

**Arrow animations (CRITICAL)**
- Lines must have `end={0}` property to enable drawing animation
- Animate `end` from 0 to 1 to create "drawing" effect: `arrowRef().end(1, 0.5)`
- Use absolute coordinates in `points`, not relative with x/y positioning
- Calculate actual component positions (account for component size/2 for edges)
- Example:
  ```tsx
  // CORRECT:
  <Line
    ref={arrowRef}
    points={[
      new Vector2(-300, -180),  // Absolute start position
      new Vector2(-300, -60)     // Absolute end position
    ]}
    stroke={SUCCESS_COLOR}
    lineWidth={5}
    endArrow
    arrowSize={15}
    opacity={0}
    end={0}  // Start hidden
  />
  // Later animate:
  yield* all(
    arrowRef().end(1, 0.5),      // Draw the line
    arrowRef().opacity(1, 0.5)   // Fade in
  );
  
  // WRONG:
  <Line
    points={[Vector2.zero, Vector2.down.scale(120)]}
    x={-300}
    y={-180}
    // Missing end={0}
  />
  ```

### Authoring tips

**Mandatory workflow (MUST FOLLOW IN ORDER):**
1. **📚 RESEARCH FIRST**: Run multiple doc queries, read thoroughly, analyze deeply (see "Docs-driven workflow" section)
2. **🎨 PLAN VISUALS**: Design visual narrative - what diagrams, flows, animations will tell the story
3. **📝 MINIMIZE TEXT**: Text is supporting only - titles, labels, brief explanations
4. **⚙️ IMPLEMENT**: Create scenes with BrandIntro/BrandOutro, animated diagrams, proper arrows
5. **✅ VERIFY**: Check against documentation, verify all visual elements animate correctly

**Mandatory for every reel:**
- ✅ Deep documentation research BEFORE starting (multiple queries, thorough reading)
- ✅ Visual-first design (animated diagrams, not text slides)
- ✅ Concise text (1-2 sentences max per screen, prefer 1-3 word labels)
- ✅ BrandIntro scene (first in scenes array, includes reel topic)
- ✅ BrandOutro scene (last in scenes array)
- ✅ Arrows with `end={0}` property and `end` animation
- ✅ Absolute coordinates for Line points, not relative with x/y
- ✅ White background (`rgb(255,255,255)`) in project.meta
- ✅ Vertical format 1080×1920 in project.meta

**Content design principles:**
- **SHOW, don't tell**: Use animated visuals to explain concepts
- **Text is secondary**: Diagrams are primary, text supports understanding
- **Every animation has purpose**: Shows flow, change, interaction, or state transition
- **Keep it dynamic**: Components move, change color, appear/disappear - not static
- **Terminology from docs**: Use exact terms from documentation for consistency

**Best practices:**
- Keep scene files focused; extract reusable visuals (like icons) under `src/assets/`.
- Order `scenes` in `src/project.ts` by playback sequence.
- Use `project.meta` to tweak fps/export; do not hardcode visual settings in TypeScript.
- Import colors from `../assets/colors.ts` instead of hardcoded values.

### Verification & troubleshooting

**Pre-flight checklist (verify before building):**

**Documentation & content:**
- [ ] Ran multiple doc queries with different search terms
- [ ] Read and analyzed ALL relevant documentation chunks
- [ ] Identified key components, flows, and relationships
- [ ] Planned visual narrative (diagrams, not text slides)
- [ ] Text is concise (1-2 sentences max, prefer labels)
- [ ] Visuals tell the story, text supports
- [ ] Animations show flows/changes/interactions
- [ ] Terminology matches documentation

**Technical implementation:**
- [ ] BrandIntro.tsx exists and is first in scenes array
- [ ] BrandOutro.tsx exists and is last in scenes array
- [ ] BrandIntro includes customized topic subtitle
- [ ] All Line components have `end={0}` property
- [ ] All arrow animations use `arrowRef().end(1, duration)`
- [ ] Line points use absolute coordinates (new Vector2(x, y))
- [ ] Background is white: `"background": "rgb(255,255,255)"` in project.meta
- [ ] Package.json name matches folder name
- [ ] All imports use correct paths (from "Correct import patterns")

**Build and verify:**
- Build the affected workspace after nontrivial edits: `npm run build -w <workspace>`
- If you change any API or shared asset, search usages and update callers.

### Text handling (CRITICAL)

**Multi-line text requires textWrap:**
- When text contains newline characters (`\n`), you MUST add `textWrap={true}` property
- Without it, `\n` will display literally instead of creating new lines
- Always use curly braces for multi-line strings
- Example:
  ```tsx
  // ✅ CORRECT
  <Txt
    text={"First line\nSecond line"}
    textWrap={true}
    fontSize={40}
  />
  
  // ❌ WRONG - newlines won't work
  <Txt
    text="First line\nSecond line"
    fontSize={40}
  />
  ```

### Component reuse patterns

**Prefer reusable components over inline definitions:**
- Extract commonly used visual elements (logos, icons, shapes) into components
- Benefits: Cleaner code, consistency, easier updates
- Icon components should be in `src/assets/icons/` directory
- Import and use directly: `<IconComponent />` instead of copying SVG/Path elements
- Example:
  ```tsx
  // ✅ PREFER - Component approach
  import BrandIcon from '../assets/icons/BrandIcon';
  <BrandIcon ref={iconRef} x={-195} y={-165} scale={5} />
  
  // ❌ AVOID - Inline definitions (verbose, hard to maintain)
  <Node ref={iconRef}>
    <Path data="..." fill="..." />
    <Path data="..." fill="..." />
    {/* Many more paths... */}
  </Node>
  ```

### Optimizing reel length

**Combine related scenes for better pacing:**
- Long reels (10+ scenes) can feel slow - consider combining related content
- Look for natural combinations:
  - **Problem + Solution**: Present challenge and resolution together
  - **Concept + Example**: Show theory with immediate practical demonstration  
  - **Multi-step processes**: Display sequential steps side-by-side
  - **Setup + Usage**: Show configuration alongside how it's used
- Target: Aim for 6-10 scenes total for optimal engagement
- Benefits:
  - 20-40% shorter duration while keeping all information
  - More dynamic pacing and flow
  - Fewer repetitive transitions
  - Better narrative cohesion
- Implementation pattern:
  ```tsx
  // Before: Separate scenes
  function ProblemScene() { /* Show problem */ }
  function SolutionScene() { /* Show solution */ }
  
  // After: Combined scene
  function ProblemAndSolutionScene() {
    // 1. Show problem section
    // 2. Transition
    // 3. Show solution section
  }
  ```

### Including practical examples

**Balance concepts with concrete demonstrations:**
- Abstract explanations need real-world grounding
- Include practical elements:
  - **Actual syntax**: Show real code/commands, not pseudocode
  - **Realistic data**: Use believable names, values, not "Example 1, Example 2"
  - **Visual results**: Show actual outcomes, not just process
  - **Metrics/numbers**: Display percentages, scores, timing where relevant
- Example patterns:
  - For search features: Show query → display actual matching results
  - For configurations: Show setup code → demonstrate effect
  - For performance: Show before/after with real metrics
- Visual indicators:
  - Success: green checkmarks, highlighted borders
  - Results: show percentage matches, similarity scores
  - Non-matches: gray out irrelevant items to show selectivity

### Displaying technical content

**Best practices for showing code/configuration:**
- **Visual styling**:
  - Monospace font: `fontFamily="monospace"`
  - Light background for code blocks: `fill="#f5f5f5"` or similar
  - Dark text for contrast: `fill="#2c3e50"` or similar
  - Bordered containers: `stroke` with `lineWidth={3-4}`
  - Rounded corners: `radius={10-15}` for modern look
- **Content formatting**:
  - Keep code concise - show key parts only
  - Use `...` or comments for omitted sections
  - Proper indentation for readability
  - Line breaks at logical points
- **Layout considerations**:
  - Side-by-side for before/after comparisons
  - Stacked for sequential steps
  - Adequate padding around code blocks
- Example structure:
  ```tsx
  <Rect
    width={900}
    height={400}
    fill="#f5f5f5"
    stroke={PRIMARY_COLOR}
    lineWidth={3}
    radius={12}
  />
  <Txt
    text={`// Key code here
function example() {
  // Implementation
}`}
    fontFamily="monospace"
    fontSize={36}
    fill="#2c3e50"
    textAlign="left"
  />
  ```

**Common errors & fixes**
- `Module has no exported member 'createRef'` or `Module has no exported member 'makeScene2D'`: Wrong import path. Check the "Correct import patterns" section above and use exact paths (e.g., `@motion-canvas/core/lib/utils` not `lib/flow`).
- `Cannot find module '../assets/icons'`: Don't use barrel imports. Import directly: `import ClusterIcon from '../assets/icons/ClusterIcon'`.
- `must not have multiple workspaces with the same name`: Forgot to update `package.json` name field in the new workspace folder.
- `Cannot read properties of undefined (reading 'fill'/'scale'/etc.)`: You're storing dereferenced values in arrays. Store the ref itself, dereference when using: `ref().method()`.
- `unknown format: currentColor`: Motion Canvas doesn't support CSS color keywords. Use explicit color values or props with defaults.
- `Property 'fill' does not exist on type 'NodeProps'`: Don't pass fill to Node wrappers. Pass it to the icon component inside: `<Node><Icon fill={COLOR} /></Node>`.
- **Arrows don't animate (appear instantly)**: Missing `end={0}` property on Line component OR missing `arrowRef().end(1, duration)` in animation. Add both.
- **Arrows don't touch start/end positions**: Use absolute coordinates in points, not relative coordinates with x/y positioning. Calculate actual component positions (accounting for size/2 for edges). Example: `points={[new Vector2(-300, -180), new Vector2(-300, -60)]}` instead of `points={[Vector2.zero, Vector2.down.scale(120)]}` with `x={-300} y={-180}`.
- **Missing brand intro/outro**: Every reel MUST have BrandIntro (first) and BrandOutro (last) in scenes array. Copy from existing reel and customize the topic subtitle.
- **Too much text, not enough visuals**: Reel is text-heavy with bullet points or paragraphs. REDESIGN: Replace text with animated diagrams, flows, and schemas. Text should be minimal (1-2 sentences max).
- **Static slides instead of animations**: Components appear but don't move, change, or interact. ADD: Arrows that draw, components that change color/size, flows that show movement.
- **Skipped documentation research**: Content doesn't match YDB docs or is incomplete. RESTART: Run multiple doc queries, read thoroughly, analyze deeply before coding.
