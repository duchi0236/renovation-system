import { NextRequest, NextResponse } from 'next/server';
import { openclaw } from '@/lib/openclaw';
import { prisma } from '@/lib/prisma';

/**
 * OpenClaw AI 对话接口
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, projectId, sessionKey } = body;

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    // 如果有项目 ID，关联上下文
    let context = '';
    if (projectId) {
      const project = await prisma.project.findUnique({
        where: { id: projectId },
        include: {
          layouts: { where: { isSelected: true }, take: 1 },
          designs: { orderBy: { createdAt: 'desc' }, take: 1 },
        },
      });

      if (project) {
        context = `
项目信息：
- 项目名称：${project.name}
- 面积：${project.area}㎡
- 户型：${project.rooms}室${project.livingRooms}厅${project.bathrooms}卫
- 风格：${project.style}
- 预算：${project.budget}元
`;
      }
    }

    // 构建完整消息
    const fullMessage = context ? `${context}\n\n用户消息：${message}` : message;

    // 调用 OpenClaw
    const response = await openclaw.chat(
      fullMessage,
      sessionKey || `project:${projectId || 'default'}`
    );

    return NextResponse.json({
      message: response,
      projectId,
    });
  } catch (error) {
    console.error('OpenClaw chat error:', error);
    return NextResponse.json(
      { error: 'Failed to process message' },
      { status: 500 }
    );
  }
}
