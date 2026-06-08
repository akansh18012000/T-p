import { useUser } from "../context/UserContext.js";
import {
  getRolePermissions,
  type RolePermissions,
} from "../constants/roles.js";

/**
 * Resolves the current user's capability config from their role. Screens use
 * this to gate edit/add/upload UI — e.g. view-only roles (IT Admin, IT Member)
 * get `canEdit`/`canAdd`/`canUpload` = false so screens render in read-only
 * mode. See `USER_ROLES` in `constants/roles.ts` for the per-role config.
 */
export function usePermissions(): RolePermissions {
  const { user } = useUser();
  return getRolePermissions(user?.role_name);
}
