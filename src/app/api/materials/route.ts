// src/app/api/materials/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// 获取材料列表
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get('projectId');
    const category = searchParams.get('category');

    const materials = await prisma.material.findMany({
      where: {
        projectId: projectId || undefined,
        category: category || undefined,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(materials);
  } catch (error) {
    console.error('Failed to fetch materials:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// 添加材料
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { projectId, category, name, brand, price, unit, quantity, imageUrl, purchaseUrl } = body;

    if (!projectId || !name) {
      return NextResponse.json({ error: 'Project ID and name are required' }, { status: 400 });
    }

    const material = await prisma.material.create({
      data: {
        projectId,
        category: category || '其他',
        name,
        brand,
        price: price || 0,
        unit,
        quantity,
        imageUrl,
        purchaseUrl,
      },
    });

    return NextResponse.json(material, { status: 201 });
  } catch (error) {
    console.error('Failed to create material:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// 批量更新材料选择状态
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { materialIds, isSelected } = body;

    await prisma.material.updateMany({
      where: { id: { in: materialIds } },
      data: { isSelected },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to update materials:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
