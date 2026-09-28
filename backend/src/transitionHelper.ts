import { getValidTransitions } from './services/projectEvaluator';
import { db } from './firebase';

export const transitionProjectState = async (projectId: string, newState: string, userId: string, comment?: string) => {
  const ref = db.collection('vibe_projects').doc(projectId);
  const doc = await ref.get();
  if (!doc.exists) throw new Error('Project not found');
  
  const project = doc.data() as any;
  const validTransitions = getValidTransitions(project.currentStatus);
  
  if (!validTransitions.includes(newState)) {
    throw new Error(`Invalid transition from ${project.currentStatus} to ${newState}`);
  }

  const updates: any = { currentStatus: newState, updatedAt: new Date().toISOString() };
  if (newState === 'COMPLETED') updates.completedAt = new Date().toISOString();
  
  await ref.update(updates);

  // Log activity
  await db.collection('vibe_activities').add({
    type: 'STATE_TRANSITION',
    projectId,
    memberId: project.memberId,
    actorId: userId,
    message: `Project moved to ${newState}`,
    metadata: { oldState: project.currentStatus, newState, comment },
    timestamp: new Date().toISOString()
  });

  return updates;
};
