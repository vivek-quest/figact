Here is a polished, professional-quality **README.md** for your `figact` CLI — clear, clean, and ready for npm/GitHub.

You can copy this directly into your project.

---

# 🧩 **figact — Figma → React Style Generator (CLI)**

**figact** is a lightweight, TypeScript-powered CLI tool that fetches style information from your **Figma file** and converts it into **CSS** or **utility classes** inside your React project.

Perfect for teams who want to sync Figma design tokens (colors, fills, text styles, etc.) into real code — automatically.

---

## 🚀 Features

* ⚡ **Fast CLI** (TypeScript, compiled to Node.js)
* 🔐 Supports **environment variables** inside `.figactrc`
* 🎯 Override config via **CLI flags**
* 🗂 Output clean, organized CSS to your project
* 📁 Custom output directory + file naming
* 🎨 Extract FILL / TEXT / EFFECT styles (more to come)
* 🧪 Dry-run mode for safe testing
* 🔧 Perfect for CI pipelines

---

## 📦 Installation

Install as a dev dependency:

```bash
npm install -D figact
```

Or via yarn:

```bash
yarn add -D figact
```

---

## ⚙️ Configuration (required)

Create a `.figactrc` file in your project root:

```json
{
  "personalAccessToken": "$FIGMA_TOKEN",
  "fileKey": "$FIGMA_FILE_KEY",
  "outDir": "src/styles/figact"
}
```

### 🔐 Using environment variables

If a value starts with `$`, figact will automatically resolve it from `process.env`.

Example:

```json
{
  "personalAccessToken": "$FIGMA_TOKEN",
  "fileKey": "$FIGMA_FILE"
}
```

Set them in your terminal or CI:

```bash
export FIGMA_TOKEN="your-figma-pat"
export FIGMA_FILE="your-file-key"
```

### 🛑 Important

If your `.figactrc` contains secrets, **add it to `.gitignore`**:

```
.figactrc
```

---

## ▶️ Usage

Generate styles:

```bash
npx figact styles --type=FILL
```

### With options:

```bash
npx figact styles \
  --type=FILL \
  --outDir=src/styles/tokens \
  --filename=colors.css \
  --prefix=fg
```

### Dry run (no files written)

```bash
npx figact styles --type=FILL --dry-run
```

### Override config via CLI flags

```bash
npx figact styles \
  --personal-access-token=xxx \
  --file-key=yyy
```

---

## 🧩 Commands

### 🔧 `styles`

Generate style output based on Figma design tokens.

**Options**

| Flag                | Description                                   |          |                           |
| ------------------- | --------------------------------------------- | -------- | ------------------------- |
| `--type <FILL       | TEXT                                          | EFFECT>` | What style type to export |
| `--name <name>`     | Comma-separated list of style names to filter |          |                           |
| `--outDir <dir>`    | Output directory (defaults from config)       |          |                           |
| `--filename <file>` | Output filename (ex: `styles.css`)            |          |                           |
| `--prefix <prefix>` | Class name prefix                             |          |                           |
| `--dry-run`         | Show result without writing files             |          |                           |

---

## 🛠 Examples

### Export only specific colors:

```bash
npx figact styles --type=FILL --name=Primary,Secondary
```

### Export text styles:

```bash
npx figact styles --type=TEXT
```

### Export effect styles:

```bash
npx figact styles --type=EFFECT
```

---

## 🧪 Local Development (for contributors)

Build:

```bash
npm run build
```

Run without building:

```bash
npm run dev -- styles --type=FILL
```

Test pack (simulate npm publish):

```bash
npm pack
```

Link globally:

```bash
npm link
figact styles --dry-run
```

---

## 📘 Config Reference

| Key                             | Description                           |
| ------------------------------- | ------------------------------------- |
| `personalAccessToken`           | Figma personal access token           |
| `fileKey`                       | Figma file key (from URL)             |
| `outDir`                        | Output directory for generated styles |
| `styleFilePattern` *(optional)* | Custom naming pattern                 |

Supports nested objects and deep `$ENV` replacement.

---

## 🧱 Roadmap

* [ ] Support for Gradients
* [ ] Support for Figma Variables API
* [ ] React Native output mode
* [ ] Token grouping & naming strategies
* [ ] Multiple file outputs per style type

---

## 🤝 Contributing

PRs, issues, and feature suggestions are welcome!

---

## 📄 License

MIT © 2025

---

If you want, I can also generate:

✅ Badges (npm version, downloads, license, etc.)
✅ A “Quick Start GIF” showing usage
✅ A documentation wiki structure
Just tell me!
