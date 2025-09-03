// FILE: /lib/scope.ts
import { getServerUser } from './auth';

/**
 * Firm scoping helpers for ensuring data isolation between firms
 */

export interface ScopedQuery {
  firmId: string;
  [key: string]: any;
}

/**
 * Add firm scope to any query object
 */
export function withFirmScope(query: any, firmId: string): ScopedQuery {
  return { ...query, firmId };
}

/**
 * Get firm ID from current user context
 */
export async function getCurrentFirmId(): Promise<string> {
  const user = await getServerUser();
  if (!user?.firmId) {
    throw new Error('User not associated with any firm');
  }
  return user.firmId;
}

/**
 * Create a scoped query with current user's firm
 */
export async function withCurrentFirmScope(query: any = {}): Promise<ScopedQuery> {
  const firmId = await getCurrentFirmId();
  return withFirmScope(query, firmId);
}

/**
 * Validate that a resource belongs to the current user's firm
 */
export async function validateFirmAccess(resourceFirmId: string): Promise<boolean> {
  const currentFirmId = await getCurrentFirmId();
  return resourceFirmId === currentFirmId;
}

/**
 * Ensure a resource belongs to the current user's firm (throws if not)
 */
export async function requireFirmAccess(resourceFirmId: string): Promise<void> {
  if (!(await validateFirmAccess(resourceFirmId))) {
    throw new Error('Access denied: Resource does not belong to your firm');
  }
}

/**
 * Helper for client-scoped queries (both firm and client)
 */
export async function withClientScope(query: any = {}, clientId?: string): Promise<ScopedQuery> {
  const scopedQuery = await withCurrentFirmScope(query);
  if (clientId) {
    scopedQuery.clientId = clientId;
  }
  return scopedQuery;
}
