'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Home, ChevronRight, MoreVertical } from 'lucide-react';

interface Project {
  id: string;
  name: string;
  status: string;
  area?: number;
  rooms?: number;
  style?: string;
  budget?: number;
  updatedAt: string;
}

export default function ProjectsPage() {
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
    return statusMap[status] || statusMap.DRAFT;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">我的项目</h1>
            <p className="text-gray-500 mt-1">管理你的装修项目</p>
          </div>
          <Link
            href="/projects/new"
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus size={20} />
            新建项目
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto"></div>
            <p className="text-gray-500 mt-4">加载中...</p>
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl">
            <Home size={48} className="mx-auto text-gray-300 mb-4" />
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => {
              const status = getStatusBadge(project.status);
              return (
                <Link
                  key={project.id}
                  href={`/projects/${project.id}`}
                  className="bg-white rounded-xl shadow-sm hover:shadow-md transition p-6 group"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-gray-900 group-hover:text-blue-600">
                          {project.name}
                        </h3>
                        <span className={`px-2 py-0.5 rounded-full text-xs ${status.color}`}>
                          {status.label}
                        </span>
                      </div>
                      <div className="text-sm text-gray-500 space-y-1">
                        {project.area && <p>{project.area}㎡</p>}
                        {project.rooms && (
                          <p>{project.rooms}室{project.bathrooms ? `${project.bathrooms}卫` : ''}</p>
                        )}
                        {project.style && <p>{project.style}</p>}
                        {project.budget && <p>预算: ¥{project.budget.toLocaleString()}</p>}
                      </div>
                    </div>
                    <ChevronRight className="text-gray-400 group-hover:text-blue-600" size={20} />
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
