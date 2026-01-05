# 🔐 API Key 更新指南

当 API Key 泄露或被禁用时，需要更新所有相关配置。

## 📋 服务端框架环境变量配置

本项目使用 **Motia Framework** 作为后端，环境变量通过以下方式配置：

### 1. 本地开发环境
- 环境变量存储在 `.env` 文件中
- 服务端代码通过 `process.env.GOOGLE_API_KEY` 和 `process.env.GEMINI_API_KEY` 读取

### 2. Motia Cloud 部署环境
- 环境变量通过 GitHub Secrets 存储
- GitHub Actions 在部署时从 Secrets 创建 `.env` 文件
- 通过 `--env-file .env` 参数传递给 Motia Cloud
- Motia Cloud 将环境变量注入到运行环境中

### 3. 代码中的使用位置

**后端服务端（Motia）:**
- `steps/api/initiateTeleport.step.ts` (第 106 行): `process.env.GOOGLE_API_KEY`
- `steps/events/generateImage.step.ts` (第 101-102 行): `process.env.GOOGLE_API_KEY` 和 `process.env.GEMINI_API_KEY`

**前端（Vite）:**
- 通过 `VITE_GOOGLE_API_KEY` 环境变量注入到构建时
- 在 `frontend/vite.config.ts` 中配置

---

## 🚀 快速更新流程

### 方法 1: 使用自动化脚本（推荐）

```bash
# 1. 在 Google Cloud Console 创建新的 API Key
# 2. 运行更新脚本
./scripts/update-google-api-key.sh <新的_GOOGLE_API_KEY> [新的_GEMINI_API_KEY]

# 3. 触发重新部署
git add .env
git commit -m "chore: update Google API keys"
git push origin main
```

### 方法 2: 手动更新

#### 步骤 1: 获取新的 API Key

1. **Google Maps API Key:**
   - 前往 [Google Cloud Console](https://console.cloud.google.com/google/maps-apis/credentials)
   - 创建新的 API Key
   - 启用以下 API：
     - ✅ Maps JavaScript API
     - ✅ Street View Static API
     - ✅ Geocoding API
     - ✅ Places API

2. **Gemini API Key (如果使用):**
   - 前往 [Google AI Studio](https://aistudio.google.com/apikey)
   - 创建新的 API Key

#### 步骤 2: 更新本地 .env 文件

```bash
# 编辑 .env 文件
GOOGLE_API_KEY=<新的_GOOGLE_API_KEY>
GEMINI_API_KEY=<新的_GEMINI_API_KEY>
VITE_GOOGLE_API_KEY=<新的_GOOGLE_API_KEY>
```

#### 步骤 3: 更新 GitHub Secrets

```bash
# 使用 GitHub CLI
gh secret set GOOGLE_API_KEY --repo yuezheng2006/time-traveller-1
gh secret set GEMINI_API_KEY --repo yuezheng2006/time-traveller-1

# 或者通过 GitHub Web UI:
# Settings → Secrets → Actions → 更新对应的 Secret
```

#### 步骤 4: 触发重新部署

**方式 A: 自动部署（推送到 main）**
```bash
git add .env
git commit -m "chore: update Google API keys"
git push origin main
```

**方式 B: 手动触发 GitHub Actions**
1. 前往: https://github.com/yuezheng2006/time-traveller-1/actions/workflows/deploy.yml
2. 点击 "Run workflow" → "Run workflow"

#### 步骤 5: 更新前端部署（如果使用 Vercel）

1. 前往 [Vercel Dashboard](https://vercel.com/dashboard)
2. 选择项目 → Settings → Environment Variables
3. 更新 `VITE_GOOGLE_API_KEY`

---

## 🔍 验证更新

### 测试本地环境

```bash
# 测试 Gemini API Key
node scripts/test-gemini-key.js

# 启动本地后端
npm run backend

# 启动前端
npm run dev
```

### 检查部署状态

1. 查看 GitHub Actions 运行状态
2. 检查 Motia Cloud 部署日志
3. 测试生产环境 API 调用

---

## ⚠️ 重要提示

1. **永远不要将 API Key 提交到 Git**
   - `.env` 文件已在 `.gitignore` 中
   - 使用 GitHub Secrets 存储生产环境 Key

2. **Key 泄露后的处理**
   - 立即在 Google Cloud Console 撤销旧 Key
   - 创建新 Key 并更新所有配置
   - 清理 Git 历史记录（如已泄露）

3. **环境变量优先级**
   - 用户提供的 Key（最高优先级）
   - 存储在 Redis 中的用户 Key
   - 环境变量 `process.env.GOOGLE_API_KEY`（默认）

---

## 📚 相关文档

- [Motia Cloud 部署文档](https://motia.cloud/docs)
- [Google Maps API 文档](https://developers.google.com/maps/documentation)
- [GitHub Secrets 文档](https://docs.github.com/en/actions/security-guides/encrypted-secrets)
