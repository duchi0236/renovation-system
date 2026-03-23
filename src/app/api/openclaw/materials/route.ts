import { NextRequest, NextResponse } from 'next/server';
import { openclaw } from '@/lib/openclaw';
import { prisma } from '@/lib/prisma';

/**
 * 材料推荐接口
 * 调用 OpenClaw 推荐装修材料
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { projectId, categories, budget } = body;

    if (!projectId) {
      return NextResponse.json({ error: 'Project ID is required' }, { status: 400 });
    }

    // 获取项目信息
    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    // 构建推荐请求
    const recommendRequest = {
      budget: budget || project.budget,
      style: project.style,
      area: project.area,
      categories: categories || [
        '地板',
        '瓷砖',
        '门',
        '橱柜',
        '卫浴',
        '灯具',
        '窗帘',
      ],
    };

    // 调用 OpenClaw 推荐材料
    const result = await openclaw.recommendMaterials(recommendRequest);

    // 保存推荐的材料
    const materials = result.materials || [];
    const createdMaterials = await Promise.all(
      materials.map((material: any) =>
        prisma.material.create({
          data: {
            projectId,
            category: material.category,
            name: material.name,
            brand: material.brand,
            model: material.model,
            price: material.price,
            unit: material.unit,
            quantity: material.quantity,
            imageUrl: material.image,
            purchaseUrl: material.link,
          },
        })
      )
    );

    return NextResponse.json({
      materials: createdMaterials,
      totalBudget: result.totalBudget,
    });
  } catch (error) {
    console.error('Material recommendation error:', error);
    return NextResponse.json(
      { error: 'Failed to recommend materials' },
      { status: 500 }
    );
  }
}
