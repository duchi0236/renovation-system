// src/app/api/progress/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// 获取施工进度
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get('projectId');

    if (!projectId) {
      return NextResponse.json({ error: 'Project ID is required' }, { status: 400 });
    }

    const progress = await prisma.progress.findMany({
      where: { projectId },
      orderBy: { createdAt: 'asc' },
    });

    return NextResponse.json(progress);
  } catch (error) {
    console.error('Failed to fetch progress:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// 创建进度记录
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { projectId, phase, status, notes } = body;

    if (!projectId || !phase) {
      return NextResponse.json({ error: 'Project ID and phase are required' }, { status: 400 });
    }

    const progress = await prisma.progress.create({
      data: {
        projectId,
        phase,
        status: status || 'PENDING',
        notes,
      },
    });

    // 同时更新项目状态
    if (status === 'IN_PROGRESS') {
      await prisma.project.update({
        where: { id: projectId },
        data: { status: 'CONSTRUCTION' },
      });
    }

    return NextResponse.json(progress, { status: 201 });
  } catch (error) {
    console.error('Failed to create progress:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// 更新进度状态
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { progressId, status, notes } = body;

    const progress = await prisma.progress.update({
      where: { id: progressId },
      data: { 
        status: status || undefined,
        notes: notes || undefined,
        endDate: status === 'COMPLETED' ? new Date() : undefined,
      },
    });

    return NextResponse.json(progress);
  } catch (error) {
    console.error('Failed to update progress:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
