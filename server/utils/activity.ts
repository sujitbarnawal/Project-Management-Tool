import { db } from "~~/server/database";
import { activityLogs } from "~~/server/database/schema";

export type ActivityAction = 
  | 'created'
  | 'updated'
  | 'deleted'
  | 'moved'
  | 'assigned'
  | 'unassigned'
  | 'commented'
  | 'attached';

export type ActivityEntityType = 
  | 'workspace'
  | 'board'
  | 'list'
  | 'task'
  | 'comment'
  | 'attachment';

export async function createActivityLog(
  workspaceId: string,
  userId: string,
  action: ActivityAction,
  entityType: ActivityEntityType,
  entityId: string,
  metadata?: Record<string, any>
) {
  try {
    await db.insert(activityLogs).values({
      workspaceId,
      userId,
      action,
      entityType,
      entityId,
      metadata: metadata || null,
    });
  } catch (error) {
    console.error('Failed to create activity log:', error);
  }
}