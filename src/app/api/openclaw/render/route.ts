import { NextRequest, NextResponse } from 'next/server';
import { openclaw } from '@/lib/openclaw';
import { prisma } from '@/lib/prisma';

/**
 * 效果图生成接口
 * 调用 OpenClaw + Stable Diffusion 生成效果图
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { projectId, layoutId, style } = body;

    if (!projectId) {
      return NextResponse.json({ error: 'Project ID is required' }, { status: 400 });
    }

    // 获取布局数据
    const layout = layoutId
      ? await prisma.layout.findUnique({ where: { id: layoutId } })
      : await prisma.layout.findFirst({
          where: { projectId, isSelected: true },
          orderBy: { createdAt: 'desc' },
        });

    if (!layout) {
      return NextResponse.json({ error: 'Layout not found' }, { status: 404 });
    }

    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });

    // 调用 OpenClaw 生成效果图
    const result = await openclaw.generateRendering(
      layout.layoutData,
      style || project?.style || '现代简约'
    );

    // 保存设计方案
    const design = await prisma.design.create({
      data: {
        projectId,
        type: 'RENDERING',
        name: `${style || project?.style} 效果图`,
        data: {
          layoutId: layout.id,
          style: style || project?.style,
        },
        images: result.images || [],
        status: 'COMPLETED',
      },
    });

    return NextResponse.json({
      design,
      images: result.images,
    });
  } catch (error) {
    console.error('Rendering generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate rendering' },
      { status: 500 }
    );
  }
}
