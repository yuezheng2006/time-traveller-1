# OAuth 登录配置指南

本文档说明如何为 Time Traveller 项目配置 Google 和 GitHub OAuth 登录。

## 前置要求

- Supabase 项目已创建
- 项目 ID: `mwmwvtrejwinowrobcgn`
- Supabase URL: `https://mwmwvtrejwinowrobcgn.supabase.co`

## 一、配置 Google OAuth

### 1.1 在 Google Cloud Console 创建 OAuth 凭据

1. **访问 Google Cloud Console**
   ```
   https://console.cloud.google.com/apis/credentials
   ```

2. **配置 OAuth 同意屏幕**（首次配置需要）
   - 点击左侧 **OAuth consent screen**
   - User Type: **External**
   - 填写应用信息：
     - App name: `Time Traveller`
     - User support email: 你的邮箱
     - Developer contact information: 你的邮箱
   - 点击 **Save and Continue**
   - Scopes: 保持默认，点击 **Save and Continue**
   - Test users: 可选，点击 **Save and Continue**

3. **创建 OAuth 2.0 Client ID**
   - 返回 **Credentials** 页面
   - 点击 **+ CREATE CREDENTIALS**
   - 选择 **OAuth client ID**
   - Application type: **Web application**
   - Name: `Time Traveller`

4. **配置授权来源和重定向 URI**

   **Authorized JavaScript origins:**
   ```
   http://localhost:5173
   https://mwmwvtrejwinowrobcgn.supabase.co
   ```

   **Authorized redirect URIs:**
   ```
   https://mwmwvtrejwinowrobcgn.supabase.co/auth/v1/callback
   ```

5. **保存并复制凭据**
   - 点击 **CREATE**
   - 复制显示的 **Client ID**
   - 复制 **Client Secret**
   - 妥善保存这两个值

### 1.2 在 Supabase 配置 Google Provider

1. **访问 Supabase Auth 设置**
   ```
   https://supabase.com/dashboard/project/mwmwvtrejwinowrobcgn/auth/providers
   ```

2. **启用并配置 Google**
   - 找到 **Google** 提供商
   - 点击展开配置面板
   - 开启 **Enable Sign in with Google**
   - 填入 Google OAuth 凭据：
     - **Client ID (for OAuth)**: 粘贴 Google Client ID
     - **Client Secret (for OAuth)**: 粘贴 Google Client Secret
   - 点击 **Save**

---

## 二、配置 GitHub OAuth

### 2.1 在 GitHub 创建 OAuth App

1. **访问 GitHub Developer Settings**
   ```
   https://github.com/settings/developers
   ```

2. **创建新的 OAuth App**
   - 点击 **OAuth Apps** 标签
   - 点击 **New OAuth App**

3. **填写应用信息**
   ```
   Application name: Time Traveller
   Homepage URL: http://localhost:5173
   Application description: AI-powered time travel experience - Visit any place in any era
   Authorization callback URL: https://mwmwvtrejwinowrobcgn.supabase.co/auth/v1/callback
   ```

4. **注册并获取凭据**
   - 点击 **Register application**
   - 复制显示的 **Client ID**
   - 点击 **Generate a new client secret**
   - 复制 **Client Secret**（只显示一次，务必保存）

### 2.2 在 Supabase 配置 GitHub Provider

1. **访问 Supabase Auth 设置**
   ```
   https://supabase.com/dashboard/project/mwmwvtrejwinowrobcgn/auth/providers
   ```

2. **启用并配置 GitHub**
   - 找到 **GitHub** 提供商
   - 点击展开配置面板
   - 开启 **Enable Sign in with GitHub**
   - 填入 GitHub OAuth 凭据：
     - **Client ID (for OAuth)**: 粘贴 GitHub Client ID
     - **Client Secret (for OAuth)**: 粘贴 GitHub Client Secret
   - 点击 **Save**

---

## 三、验证配置

### 3.1 启动应用

```bash
# Terminal 1: 启动后端
npm run backend

# Terminal 2: 启动前端
npm run dev
```

### 3.2 测试登录流程

1. 访问应用: `http://localhost:5173`
2. 点击页面上的登录按钮
3. 选择 **Google** 或 **GitHub** 登录
4. 完成 OAuth 授权流程
5. 验证是否成功返回应用并显示用户信息

### 3.3 检查登录状态

登录成功后，应该能看到：
- 用户头像和名称显示在页面上
- 可以访问历史记录功能
- 可以保存生成的图像到云端

---

## 四、配置检查清单

### Google OAuth
- [ ] Google Cloud Console 项目已创建
- [ ] OAuth 同意屏幕已配置
- [ ] OAuth Client ID 已创建
- [ ] Authorized JavaScript origins 包含本地和 Supabase URL
- [ ] Authorized redirect URIs 包含 Supabase 回调地址
- [ ] Client ID 和 Secret 已复制
- [ ] Supabase Google Provider 已启用
- [ ] Google 凭据已填入 Supabase

### GitHub OAuth
- [ ] GitHub OAuth App 已创建
- [ ] Homepage URL 设置正确
- [ ] Authorization callback URL 设置为 Supabase 回调地址
- [ ] Client ID 和 Secret 已复制
- [ ] Supabase GitHub Provider 已启用
- [ ] GitHub 凭据已填入 Supabase

### 应用测试
- [ ] 后端服务运行正常
- [ ] 前端服务运行正常
- [ ] Google 登录功能正常
- [ ] GitHub 登录功能正常
- [ ] 用户信息正确显示
- [ ] 历史记录功能可用

---

## 五、常见问题

### 问题 1: "Redirect URI mismatch" 错误

**原因**: OAuth 回调 URL 不匹配

**解决方案**:
- 确保 Google/GitHub 中配置的 redirect URI 完全匹配
- 正确的 URI: `https://mwmwvtrejwinowrobcgn.supabase.co/auth/v1/callback`
- 注意不要有多余的空格或斜杠

### 问题 2: "Invalid client" 错误

**原因**: Client ID 或 Secret 不正确

**解决方案**:
- 重新检查复制的 Client ID 和 Secret
- 确保没有多余的空格或换行符
- 在 Supabase 中重新粘贴凭据

### 问题 3: 登录后没有跳转回应用

**原因**: 前端或后端服务未运行

**解决方案**:
- 确保 `npm run backend` 在 3000 端口运行
- 确保 `npm run dev` 在 5173 端口运行
- 检查浏览器控制台是否有错误信息

### 问题 4: "Authentication not configured" 错误

**原因**: 环境变量未正确配置

**解决方案**:
- 检查 `.env` 文件中的 Supabase 配置
- 确保 `VITE_SUPABASE_URL` 和 `VITE_SUPABASE_ANON_KEY` 已设置
- 重启前端服务以加载新的环境变量

### 问题 5: OAuth 同意屏幕显示 "This app isn't verified"

**原因**: Google OAuth 应用未经过验证（正常现象）

**解决方案**:
- 开发环境下，点击 "Advanced" → "Go to Time Traveller (unsafe)"
- 生产环境需要提交 Google 验证申请

---

## 六、生产环境配置

### 更新 Redirect URIs

生产环境部署后，需要添加生产域名到 OAuth 配置：

**Google Cloud Console:**
- Authorized JavaScript origins: 添加 `https://your-domain.com`
- Authorized redirect URIs: 保持 Supabase 回调地址不变

**GitHub OAuth App:**
- Homepage URL: 更新为 `https://your-domain.com`
- Authorization callback URL: 保持 Supabase 回调地址不变

### 环境变量

确保生产环境的 `.env` 文件包含正确的配置：

```bash
VITE_SUPABASE_URL=https://mwmwvtrejwinowrobcgn.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
VITE_API_URL=https://your-backend-url.com
```

---

## 七、安全建议

1. **保护 Client Secret**
   - 永远不要将 Client Secret 提交到 Git
   - 使用环境变量管理敏感信息
   - 定期轮换 OAuth 凭据

2. **限制 OAuth Scope**
   - 只请求必要的用户权限
   - 当前配置只请求基本的用户信息（email, profile）

3. **监控登录活动**
   - 在 Supabase Dashboard 中查看认证日志
   - 监控异常登录行为

4. **HTTPS 要求**
   - 生产环境必须使用 HTTPS
   - OAuth 回调 URL 必须是 HTTPS（Supabase 已提供）

---

## 参考链接

- [Google OAuth 文档](https://developers.google.com/identity/protocols/oauth2)
- [GitHub OAuth 文档](https://docs.github.com/en/apps/oauth-apps/building-oauth-apps)
- [Supabase Auth 文档](https://supabase.com/docs/guides/auth)
- [项目 README](../README.md)
