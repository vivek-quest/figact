# 🧩 **FigAct — Figma → React Design System Sync (CLI)**

**FigAct** is a lightweight, developer-friendly CLI that bridges your **Figma Design System** with your **React codebase**.

It automatically pulls design tokens, styles, components, variables, and other design data from Figma — then converts them into real, usable frontend artifacts.

> Today, FigAct focuses on **importing Figma styles** (colors, fills, effects, text styles) into React-ready output.
> But the roadmap unlocks: **components, variables, design tokens, utilities, TypeScript modules**, and full design-system sync.

---

## 🚀 **Why FigAct?**

Modern design systems live in Figma — but engineering still manually copies:

* Colors
* Typography
* Spacing
* Effects / shadows
* Component properties
* Tokens

FigAct eliminates that manual work by generating the code **directly from your design source of truth**.

### **Current capabilities**

✔ Export Figma **styles** → React project
✔ Generate CSS files or style modules
✔ Supports filtering by style names
✔ Environment-variable aware `.figactrc`
✔ CLI overrides for tokens, file keys, etc.
✔ Safe dry-run mode
✔ Output directory + file naming control

### **Future capabilities (in-progress)**

🚧 Extract design **variables** (Figma 2024 variables API)
🚧 Generate **React components** from Figma components
🚧 Token → CSS variable → JS module sync
🚧 Tailwind preset generation
🚧 React Native style output
🚧 Full design-system export including grids, primitives, component props

---

# 📦 Installation

```bash
npm install -D figact
```

or

```bash
yarn add -D figact
```

---

# ⚙️ Configuration

Create a `.figactrc` file in your project root:

```json
{
  "personalAccessToken": "$FIGMA_TOKEN",
  "fileKey": "$FIGMA_FILE",
  "outDir": "src/styles/figact"
}
```

### 🔐 Environment variable support

Any value starting with `$` is resolved from `process.env`.

Example:

```json
{
  "personalAccessToken": "$FIGMA_PAT",
  "fileKey": "$FIGMA_FILE_ID"
}
```

Set them:

```bash
export FIGMA_PAT="my-secret-token"
export FIGMA_FILE_ID="xxxxxxx"
```

💡 **Add `.figactrc` to `.gitignore`** if you store secrets inside it.

---

# ▶️ Usage

### Generate all FILL styles:

```bash
npx figact styles --type=FILL
```

### Filter by style names:

```bash
npx figact styles --type=FILL --name='Primary,Secondary,Brand Accent'
```

### Custom output directory and filename:

```bash
npx figact styles --type=TEXT --outDir=src/tokens --filename=text.css
```

### Dry-run (no files written):

```bash
npx figact styles --type=FILL --dry-run
```

### Override config tokens via CLI:

```bash
npx figact styles \
  --personal-access-token=xxx \
  --file-key=yyy
```

---

# 🧩 Commands

## `styles`

Generate CSS/React styles from Figma design system tokens.

**Options:**

| Flag                | Description                            |          |                            |
| ------------------- | -------------------------------------- | -------- | -------------------------- |
| `--type <FILL       | TEXT                                   | EFFECT>` | Figma style type to export |
| `--name <list>`     | Comma-separated style names to include |          |                            |
| `--outDir <dir>`    | Output directory                       |          |                            |
| `--filename <file>` | Output file name                       |          |                            |
| `--prefix <prefix>` | Prefix class names                     |          |                            |
| `--dry-run`         | Print result without saving            |          |                            |

More commands coming soon…

---

# 🔮 Vision & Roadmap

FigAct is designed to grow into a **full design system pipeline**, enabling:

### 🟦 1. Token Sync

* Colors
* Typography
* Spacing
* Radii
* Grids
* Shadows
* Variables

### 🟩 2. Code Generation

* React components mapped from Figma components
* Token-driven utility modules
* Tailwind/Tailwind plugin generation
* SCSS/CSS variables
* React Native styles

### 🟧 3. Continuous Integration

* Rebuild styles when Figma updates
* Design system versioning
* Changelog detection from design diffs

### 🟪 4. Team Collaboration

* Onboarding-friendly CLI
* Framework-agnostic builds
* Composable tokens and modules

If your team uses Figma as a design source of truth, FigAct will serve as your engineering sync tool.

---

# 🛠 Local Development (for contributors)

Run in dev mode:

```bash
npm run dev -- styles --type=FILL
```

Build:

```bash
npm run build
```

Create a pack to test installation:

```bash
npm pack
```

Link globally:

```bash
npm link
figact styles --dry-run
```

---

# 🤝 Contributing

PRs, issues, and feature suggestions are welcome!
If your design system has a special structure, open an issue — FigAct aims to be flexible.

---

# 📄 License

MIT © 2025