import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { generateDigitalWill } from '@/lib/gemini';
import { dbManager } from '@/lib/dbManager';

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const { residence, specialInstructions } = await req.json();

    const user = await dbManager.getUserById(payload.userId);
    const userName = user ? user.name : payload.name || 'Vault Owner';
    const nominees = await dbManager.getNominees(payload.userId);

    const formattedNominees = nominees.map((n: any) => ({
      name: n.name,
      relation: n.relation,
      assignedCategories: n.assignedCategories || ['Documents'],
    }));

    const willText = await generateDigitalWill({
      userName,
      residence: residence || 'India',
      executors: [{ name: 'Ankit Sharma (Legal Advisor)', relation: 'Digital Executor', email: 'executor@lawfirm.in' }],
      nominees: formattedNominees.length > 0 ? formattedNominees : [
        { name: 'Rakesh Kumar', relation: 'Father', assignedCategories: ['Documents', 'Credentials'] },
        { name: 'Sunita Kumar', relation: 'Mother', assignedCategories: ['Memory Capsules'] }
      ],
      specialInstructions,
    });

    await dbManager.saveAuditLog({
      ownerId: payload.userId,
      action: 'AI_WILL_GENERATED',
      performedBy: userName,
      performedById: payload.userId,
      details: 'Drafted Last Will & Testament document using Gemini AI Generator.',
      status: 'Verified',
    });

    return NextResponse.json({
      message: 'AI Digital Will generated successfully',
      willText,
      generatedAt: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('AI Will Generation API Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
