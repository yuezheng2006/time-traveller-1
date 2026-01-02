# 身份验证系统设计文档

本文档详细介绍了 Time Traveller 系统的登录与身份验证机制。

## 1. 技术栈

系统采用了三方授权与自研 JWT 结合的混合方案：

- **前端**: `@supabase/supabase-js` —— 负责与 Supabase Auth 交互，处理 OAuth 流程。
- **后端 (Motia)**: 
    - `@supabase/supabase-js` (Admin 模式) —— 用于服务端验证 Supabase 凭证。
    - `jsonwebtoken` (JWT) —— 用于签发系统内部业务令牌。
- **中间件**: Motia 自定义中间件 —— 负责接口层级的权限校验。

## 2. 核心原理：令牌交换 (Token Exchange)

本系统不直接使用 Supabase 签发的 Token 访问业务 API，而是通过一个“交换”过程来获取更具业务针对性的自定义令牌。

### 登录全流程

1.  **前端 OAuth 授权**:
    - 用户点击 Google/GitHub 登录。
    - 前端调用 `supabase.auth.signInWithOAuth` 跳转至三方平台。
    - 授权成功后，Supabase 回调应用并由前端 SDK 自动获取 `access_token` (Supabase Token)。

2.  **令牌交换请求**:
    - 前端将获取到的 `supabase_token` 发送到后端 API 路径 `/auth` (`steps/api/auth.step.ts`)。

3.  **后端验证与签发**:
    - **验证**: 后端接收到 Token 后，利用 `supabaseAdmin` 调用 `getUser()` 接口。此步骤确保了该 Token 确实由 Supabase 签发且处于有效期内。
    - **同步状态**: 后端获取用户信息（ID、Email、头像等），并使用 `state.set('users', userId, user)` 将其同步到系统的 Redis 状态管理中。
    - **签发业务 Token**: 验证通过后，后端使用 `JWT_SECRET` 对用户信息进行重新签名，生成一个新的 **业务 JWT** 并返回给前端。

4.  **业务请求鉴权**:
    - 前端将业务 JWT 存储在 `localStorage`。
    - 在随后的所有业务请求（如传送、查询历史等）中，前端在 Headers 中添加 `Authorization: Bearer <业务JWT>`。
    - **中间件校验**: 后端中间件 `authRequired` 拦截请求，解析并校验该 JWT。校验成功后，将 `userId` 注入到请求上下文中，供 Step 逻辑使用。

## 3. 关键文件索引

- **前端 Context**: `frontend/contexts/AuthContext.tsx` (处理登录状态、Token 交换逻辑)
- **后端 Service**: `services/supabase/authService.ts` (封装 Supabase Admin 验证及 JWT 签发逻辑)
- **API Step**: `steps/api/auth.step.ts` (定义 `/auth` 令牌交换接口)
- **中间件**: `steps/middlewares/auth.middleware.ts` (实现 `authRequired` 鉴权逻辑)

## 4. 安全性考量

1.  **Secret 隔离**: 前端仅持有 Anon Key（低权限），核心校验逻辑在后端使用 Service Role Key（高权限）完成，避免了关键 Key 暴露在客户端。
2.  **自定义过期策略**: 通过自定义 JWT，我们可以独立控制业务会话的有效期（默认为 30 天，见 `JWT_EXPIRATION`）。
3.  **无状态鉴权**: 后端接口通过 JWT 实现无状态化，便于水平扩展，同时利用 `state` 缓存用户信息提高性能。
