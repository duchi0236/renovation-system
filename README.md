# A集团装修自动化系统

基于 OpenClaw + Codex 的 AI 装修全案自动化系统

## 技术栈

- **前端**: Next.js 14 + Tailwind CSS
- **后端**: Next.js API Routes
- **AI**: OpenClaw + Codex + Stable Diffusion
- **数据库**: PostgreSQL + Prisma
- **存储**: 本地存储 / OSS

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境变量

```env
# .env.local
DATABASE_URL="postgresql://user:password@localhost:5432/renovation"
NEXTAUTH_SECRET="your-secret-key"

# OpenClaw
OPENCLAW_URL="ws://localhost:18789"
OPENCLAW_TOKEN="your-gateway-token"
```

### 3. 数据库迁移

```bash
npx prisma migrate dev
```

### 4. 启动开发服务器

```bash
npm run dev
```

## 项目结构

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API 路由
│   │   ├── auth/         # 认证
│   │   ├── projects/    # 项目管理
│   │   ├── layouts/     # 户型管理
│   │   ├── designs/     # 方案设计
│   │   └── openclaw/    # OpenClaw 集成
│   └── (dashboard)/      # 页面
├── components/            # React 组件
├── lib/                  # 工具库
│   ├── openclaw.ts      # OpenClaw 客户端
│   ├── prisma.ts        # Prisma 客户端
│   └── a2a.ts           # A2A 协议
├── stores/               # Zustand 状态
└── types/                # TypeScript 类型
```

## 核心功能

- [x] 用户认证
- [x] 户型上传与管理
- [x] AI 布局生成
- [x] 效果图生成
- [x] 材料推荐
- [x] 施工进度跟踪
