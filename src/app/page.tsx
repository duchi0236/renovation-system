import Link from 'next/link';
import { Home, Layout, Palette, HardHat, ArrowRight } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, rgba(59, 130, 246, 0.3) 0%, transparent 50%),
                             radial-gradient(circle at 75% 75%, rgba(147, 51, 234, 0.3) 0%, transparent 50%)`
          }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 py-24">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
              A集团装修助手
            </h1>
            <p className="text-xl md:text-2xl text-slate-300 mb-12 max-w-2xl mx-auto">
              基于 AI 的全案装修自动化系统
              <br />
              从需求分析到施工落地，全程智能辅助
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/api/auth/signin"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition"
              >
                立即开始
                <ArrowRight size={20} />
              </Link>
              <Link
                href="#features"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-slate-700/50 text-white rounded-xl font-semibold hover:bg-slate-700 transition"
              >
                了解更多
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="max-w-7xl mx-auto px-4 py-24">
        <h2 className="text-3xl font-bold text-white text-center mb-16">
          核心功能
        </h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-slate-800/50 backdrop-blur p-6 rounded-2xl border border-slate-700">
            <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mb-4">
              <Home className="text-blue-400" size={24} />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">AI 顾问</h3>
            <p className="text-slate-400">
              智能对话，理解你的装修需求，提供专业建议
            </p>
          </div>

          <div className="bg-slate-800/50 backdrop-blur p-6 rounded-2xl border border-slate-700">
            <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center mb-4">
              <Layout className="text-purple-400" size={24} />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">智能布局</h3>
            <p className="text-slate-400">
              上传户型图，AI 自动生成多版布局方案
            </p>
          </div>

          <div className="bg-slate-800/50 backdrop-blur p-6 rounded-2xl border border-slate-700">
            <div className="w-12 h-12 bg-pink-500/20 rounded-xl flex items-center justify-center mb-4">
              <Palette className="text-pink-400" size={24} />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">效果预览</h3>
            <p className="text-slate-400">
              AI 生成装修效果图，所见即所得
            </p>
          </div>

          <div className="bg-slate-800/50 backdrop-blur p-6 rounded-2xl border border-slate-700">
            <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center mb-4">
              <HardHat className="text-green-400" size={24} />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">施工管家</h3>
            <p className="text-slate-400">
              全程跟踪施工进度，AI 辅助质量验收
            </p>
          </div>
        </div>
      </div>

      {/* Tech Stack */}
      <div className="max-w-7xl mx-auto px-4 py-24 border-t border-slate-800">
        <h2 className="text-3xl font-bold text-white text-center mb-16">
          技术架构
        </h2>
        
        <div className="flex flex-wrap justify-center gap-8">
          {[
            { name: 'Next.js', desc: '全栈框架' },
            { name: 'OpenClaw', desc: 'AI 网关' },
            { name: 'Codex', desc: '代码生成' },
            { name: 'PostgreSQL', desc: '数据库' },
            { name: 'A2A Protocol', desc: 'Agent 通信' },
          ].map((tech) => (
            <div
              key={tech.name}
              className="text-center"
            >
              <div className="px-6 py-3 bg-slate-800 rounded-full border border-slate-700">
                <span className="text-white font-medium">{tech.name}</span>
              </div>
              <p className="text-slate-500 text-sm mt-2">{tech.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-slate-500">
            © 2026 A集团装修助手. 基于 OpenClaw + Codex 构建.
          </p>
        </div>
      </footer>
    </div>
  );
}
