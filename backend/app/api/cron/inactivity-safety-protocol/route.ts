import { NextResponse } from 'next/server';
import { sendInactivityAlert } from '@/lib/email';
import { dbManager } from '@/lib/dbManager';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const now = new Date();
    const users = await dbManager.getUsers();

    let processedCount = 0;

    for (const user of users) {
      if (user.accessUnlocked) continue;

      const lastActiveDate = user.lastActive ? new Date(user.lastActive) : new Date();
      const daysInactive = Math.floor((now.getTime() - lastActiveDate.getTime()) / (1000 * 60 * 60 * 24));
      const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/reset-activity?userId=${user.id || user._id}`;

      // Level 1: 15 days inactivity alert
      if (daysInactive >= 15 && (user.remindersSent || 0) === 0) {
        await sendInactivityAlert(user.email, 15, resetUrl);
        user.remindersSent = 1;
        await dbManager.saveUser(user);
        processedCount++;
      }
      // Level 2: 30 days inactivity alert
      else if (daysInactive >= 30 && user.remindersSent === 1) {
        await sendInactivityAlert(user.email, 30, resetUrl);
        user.remindersSent = 2;
        await dbManager.saveUser(user);
        processedCount++;
      }
      // Level 3: 60 days final warning alert
      else if (daysInactive >= 60 && user.remindersSent === 2) {
        await sendInactivityAlert(user.email, 60, resetUrl);
        user.remindersSent = 3;
        await dbManager.saveUser(user);
        processedCount++;
      }
      // Level 4: 90 days - INACTIVITY SAFETY PROTOCOL TRIGGERED!
      else if (daysInactive >= 90 && user.remindersSent === 3) {
        user.accessUnlocked = true;
        await dbManager.saveUser(user);

        // Unlock nominee access
        const nominees = await dbManager.getNominees(user.id || user._id);
        for (const n of nominees) {
          n.hasEmergencyAccess = true;
          n.accessExpiresAt = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString();
          await dbManager.saveNominee(n);
        }

        await dbManager.saveAuditLog({
          ownerId: user.id || user._id,
          action: 'INACTIVITY_SAFETY_PROTOCOL_TRIGGERED',
          performedBy: 'System Cron Engine',
          details: `90-day inactivity threshold met. Asset transfer unlocked for verified nominees.`,
          status: 'Released',
        });

        processedCount++;
      }
    }

    return NextResponse.json({
      message: 'Inactivity Safety Protocol Cron executed successfully',
      processedCount,
      timestamp: now.toISOString(),
    });
  } catch (error: any) {
    console.error('Inactivity Safety Protocol Cron Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
