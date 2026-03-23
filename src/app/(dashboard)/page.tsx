'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Home, Layout, Palette, Package, HardHat, ChevronRight } from 'lucide-react';

interface Project {
  id: string;
  name: string;
  status: string;
  area?: number;
  rooms?: number;
  style?: string;
  budget?: number;
  updatedAt: string;
  _count?: {
    layouts: number;
    designs: number;
    materials: number;
  };
}

export default function Dashboard() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await fetch('/api/projects');
      const data = await res.json();
      setProjects(data);
    } catch (error) {
      console.error('Failed to fetch projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; color: string }> = {
      DRAFT: { label: '草稿', color: 'bg-gray-100 text-gray-800' },
      DEMAND_ANALYSIS: { label: '需求分析', color: 'bg-blue-100 text-blue-800' },
      DESIGNING: { label: '设计中', color: 'bg-purple-100 text-purple-800' },
      MATERIALS: { label: '材料选购', color: 'bg-yellow-100 text-yellow-800' },
      CONSTRUCTION: { label: '施工中', color: 'bg-orange-100 text-orange-800' },
      COMPLETED: { label: '已完成', color: 'bg-green-100 text-green-800' },
    };
    const config = statusMap[status] || statusMap.DRAFT;
    return <span className={`px-2 py-1 rounded-full text-xs ${config.color}`}>{config.label}</span>;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">A集团装修助手</h1>
          <Link
            href="/projects/new"
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus size={20} />
            新建项目
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Link
            href="/ai"
            className="p-6 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl text-white hover:from-blue-600 hover:to-blue-700 transition"
          >
            <div className="flex items-center gap-3">
              <Home size={24} />
              <div>
                <div className="font-semibold">AI 对话</div>
                <div className="text-sm opacity-80">智能顾问</div>
              </div>
            </div>
          </Link>
          <Link
            href="/layouts"
            className="p-6 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl text-white hover:from-purple-600 hover:to-purple-700 transition"
          >
            <div className="flex items-center gap-3">
              <Layout size={24} />
              <div>
                <div className="font-semibold">户型管理</div>
                <div className="text-sm opacity-80">上传 & 编辑</div>
              </div>
            </div>
          </Link>
          <Link
            href="/materials"
            className="p-6 bg-gradient-to-br from-green-500 to-green-600 rounded-xl text-white hover:from-green-600 hover:to-green-700 transition"
          >
            <div className="flex items-center gap-3">
              <Palette size={24} />
              <div>
                <div className="font-semibold">材料库</div>
                <div className="text-sm opacity-80">选材 & 比价</div>
              </div>
            </div>
          </Link>
          <Link
            href="/construction"
            className="p-6 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl text-white hover:from-orange-600 hover:to-orange-700 transition"
          >
            <div className="flex items-center gap-3">
              <HardHat size={24} />
              <div>
                <div className="font-semibold">施工进度</div>
                <div className="text-sm opacity-80">查看 & 跟进</div>
              </div>
            </div>
          </Link>
        </div>

        {/* Projects List */}
        <div className="bg-white rounded-xl shadow-sm">
          <div className="px-6 py-4 border-b">
            <h2 className="text-lg font-semibold">我的装修项目</h2>
          </div>

          {loading ? (
            <div className="p-8 text-center text-gray-500">加载中...</div>
          ) : projects.length === 0 ? (
            <div className="p-8 text-center">
              <Package size={48} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500 mb-4">暂无装修项目</p>
              <Link
                href="/projects/new"
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Plus size={20} />
                创建第一个项目
              </Link>
            </div>
          ) : (
            <div className="divide-y">
              {projects.map((project) => (
                <Link
                  key={project.id}
                  href={`/projects/${project.id}`}
                  className="flex items-center justify-between p-6 hover:bg-gray-50 transition"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Home className="text-blue-600" size={24} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-gray-900">{project.name}</h3>
                        {getStatusBadge(project.status)}
                      </div>
                      <div className="text-sm text-gray-500 mt-1">
                        {project.area}㎡ · {project.rooms}室 ·
                        {project.style || '未设定风格'}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-sm text-gray-500">
                        {project._count?.layouts || 0} 户型
                      </div>
                      <div className="text-sm text-gray-500">
                        {project._count?.designs || 0} 方案
                      </div>
                    </div>
                    <ChevronRight className="text-gray-400" size={20} />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
