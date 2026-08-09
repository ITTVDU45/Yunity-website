/**
 * Reine Funktion: Rollenzuweisungen + Rollendokumente -> effektive Rechte.
 * Getrennt vom Service, damit sie ohne Datenbank testbar ist.
 */

export interface RoleLike {
  id: string;
  permissions: readonly string[];
  isGlobal: boolean;
}

export interface AssignmentLike {
  roleId: string;
  siteId: string | null;
}

export interface ResolvedAccess {
  globalPermissions: string[];
  permissionsBySite: Record<string, string[]>;
}

export function resolveAccess(
  assignments: readonly AssignmentLike[],
  rolesById: ReadonlyMap<string, RoleLike>,
): ResolvedAccess {
  const globalPermissions = new Set<string>();
  const bySite = new Map<string, Set<string>>();

  for (const assignment of assignments) {
    const role = rolesById.get(assignment.roleId);
    if (!role) {
      continue;
    }

    if (role.isGlobal || assignment.siteId === null) {
      for (const permission of role.permissions) {
        globalPermissions.add(permission);
      }
      continue;
    }

    const siteSet = bySite.get(assignment.siteId) ?? new Set<string>();
    for (const permission of role.permissions) {
      siteSet.add(permission);
    }
    bySite.set(assignment.siteId, siteSet);
  }

  return {
    globalPermissions: [...globalPermissions],
    permissionsBySite: Object.fromEntries(
      [...bySite.entries()].map(([siteId, keys]) => [siteId, [...keys]]),
    ),
  };
}
