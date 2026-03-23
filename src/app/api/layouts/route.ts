// src/app/api/layouts/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

// 获取户型列表
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get('projectId');

    const layouts = await prisma.layout.findMany({
      where: projectId ? { projectId } : {},
      include: { project: true },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(layouts);
  } catch (error) {
    console.error('Failed to fetch layouts:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// 上传户型
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const projectId = formData.get('projectId') as string;
    const name = formData.get('name') as string || '未命名户型';

    if (!file || !projectId) {
      return NextResponse.json({ error: 'File and projectId are required' }, { status: 400 });
    }

    // 保存文件
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    await mkdir(uploadDir, { recursive: true });
    
    const fileName = `${Date.now()}-${file.name}`;
    const filePath = path.join(uploadDir, fileName);
    await writeFile(filePath, buffer);

    // 保存到数据库
    const layout = await prisma.layout.create({
      data: {
        projectId,
        name,
        imageUrl: `/uploads/${fileName}`,
      },
    });

    return NextResponse.json(layout, { status: 201 });
  } catch (error) {
    console.error('Failed to upload layout:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
