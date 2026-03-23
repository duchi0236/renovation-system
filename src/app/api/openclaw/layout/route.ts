import { NextRequest, NextResponse } from 'next/server';
import { openclaw } from '@/lib/openclaw';
import { prisma } from '@/lib/prisma';

/**
 * 布局生成接口
 * 调用 OpenClaw Codex 生成布局方案
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { projectId, layoutData, requirements } = body;

    if (!projectId) {
      return NextResponse.json({ error: 'Project ID is required' }, { status: 400 });
    }

    // 获取项目信息
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: {
        layouts: { orderBy: { createdAt: 'desc' }, take: 1 },
      },
    });

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    // 构建布局生成请求
    const layoutRequest = {
      area: project.area,
      rooms: project.rooms,
      livingRooms: project.livingRooms,
      bathrooms: project.bathrooms,
      existingLayout: project.layouts[0]?.layoutData || null,
      requirements: requirements || {
        style: project.style,
        budget: project.budget,
      },
    };

    // 调用 OpenClaw 生成布局
    const result = await openclaw.generateLayout(layoutRequest, layoutRequest.requirements);

    // 保存生成的布局方案
    const layout = await prisma.layout.create({
      data: {
        projectId,
        name: `布局方案 ${new Date().toLocaleString()}`,
        layoutData: result.layoutData || result,
        options: result.options || result.layouts,
      },
    });

    return NextResponse.json({
      layout,
      result,
    });
  } catch (error) {
    console.error('Layout generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate layout' },
      { status: 500 }
    );
  }
}
