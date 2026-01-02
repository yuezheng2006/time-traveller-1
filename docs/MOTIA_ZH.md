# Motia 框架简介

**Motia** 是一个现代化的 TypeScript 后端框架，专为构建复杂的工作流、实时应用和 AI 驱动的服务而设计。它不仅提供了强大的代码开发能力，还内置了可视化的 **Workbench (工作台)**，方便开发者实时监控、调试和管理后台流程。

---

## 🚀 核心概念

### 1. Steps (步骤)
Steps 是 Motia 的基本构建块。所有的业务逻辑都按照类型组织在不同的 Step 中：
- **API Steps**: 定义 HTTP REST 接口（如 GET, POST）。支持 Zod 模式校验和自动生成的类型安全。
- **Event Steps**: 异步后台任务处理器。通过 `emit()` 触发，适合处理长耗时任务（如 AI 生成、邮件发送）。
- **Cron Steps**: 定时任务，使用标准的 Cron 表达式（如 `0 0 * * *`）。
- **Noop Steps**: 空操作步骤，通常用于可视化流程中的手动触发或 UI 占位。
- **UI Steps**: 为 Workbench 提供自定义的可视化组件，提升流程的可读性。

### 2. Flows (工作流)
Flows 是 Step 的逻辑分组。在 Workbench 中，属于同一个 Flow 的 Step 会被组合在一起展示，形成清晰的流程图，帮助开发者理解各组件之间的调用关系。

### 3. State (状态管理)
Motia 内置了基于 Redis 的持久化状态管理。
- 使用 `await state.set(namespace, key, value)` 存储数据。
- 使用 `await state.get(namespace, key)` 获取数据。
状态在不同的 Step 之间是共享的，非常适合跨步骤的数据传递。

### 4. Streams (实时流)
通过 WebSocket 实现数据的实时推送。前端可以订阅特定的 Stream 频道，后端通过 `streams.name.set()` 即时更新前端 UI。

---

## 🎨 Workbench (可视化工作台)

Motia 最显著的特色是内置的可视化环境。
- **访问地址**: 默认在 `http://localhost:3000` 运行。
- **功能**:
  - **流程监控**: 查看 API 调用如何触发后续的 Event。
  - **数据回溯**: 检查每个步骤的输入、输出和日志。
  - **手动触发**: 在 UI 中直接触发 Event 或 Noop 步骤，方便测试。
  - **实时日志**: 汇总展示所有 Step 的运行日志。

---

## 🛠 开发模式

### 代码结构
推荐采用领域驱动设计 (DDD)，将逻辑分为两层：
- **`steps/`**: 入口层（控制器），处理请求校验、事件触发。
- **`services/`**: 业务层，处理具体的复杂逻辑（如 AI 接口调用、数据库操作）。

### 示例代码 (API Step)
```typescript
import { ApiRouteConfig, Handlers } from 'motia';
import { z } from 'zod';

export const config: ApiRouteConfig = {
  name: 'HelloWorld',
  type: 'api',
  path: '/hello',
  method: 'GET',
  flows: ['example-flow']
};

export const handler: Handlers['HelloWorld'] = async (req, { logger }) => {
  logger.info('收到请求');
  return {
    status: 200,
    body: { message: 'Hello from Motia!' }
  };
};
```

---

## 🌟 为什么选择 Motia？

1. **可见性**: 复杂的异步流程不再是黑盒，通过 Workbench 一目了然。
2. **类型安全**: 全程支持 TypeScript，配置与逻辑紧密集成，减少运行期错误。
3. **快速迭代**: 内置了状态、事件、定时任务和 WebSocket 等常用后端功能，无需从零搭建基础架构。
4. **AI 友好**: 框架设计初衷即为处理不可预测的 AI 任务（如长时生成的异步化处理）。

---

## 🚩 常用命令

- **启动后台**: `npm run backend`
- **构建后台**: `npm run backend:build`
- **云端部署**: `npx motia cloud deploy`
