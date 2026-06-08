/**
 * User roles returned by the `/api/v1/user/me` `role_name` field.
 * `roleName` is the canonical backend value; `labelKey` points at the i18n
 * string for displaying the role to the user. Use `getRoleLabelKey` to resolve
 * the translation key from a backend role name.
 */

/**
 * Capabilities a role is allowed to perform. Screens should read these via
 * `getRolePermissions` (or `useUser`-derived helpers) to gate edit/add/upload
 * UI. View-only roles (IT Admin, IT Member) can browse every page but cannot
 * mutate data.
 *
 * NOTE: this config is the single source of truth for role capabilities, but it
 * is not yet wired into the screens — that gating will be added later.
 */
export interface RolePermissions {
  /** Can open and read screens. */
  canView: boolean;
  /** Can modify existing records (inline edits, register/save). */
  canEdit: boolean;
  /** Can create / add new records. */
  canAdd: boolean;
  /** Can upload files (CSV/template uploads). */
  canUpload: boolean;
}

const VIEW_ONLY_PERMISSIONS: RolePermissions = {
  canView: true,
  canEdit: false,
  canAdd: false,
  canUpload: false,
};

const FULL_ACCESS_PERMISSIONS: RolePermissions = {
  canView: true,
  canEdit: true,
  canAdd: true,
  canUpload: true,
};

/** Permissions applied when the user has no recognized role. */
export const NO_ACCESS_PERMISSIONS: RolePermissions = {
  canView: false,
  canEdit: false,
  canAdd: false,
  canUpload: false,
};

export interface RoleInfo {
  roleName: string;
  labelKey: string;
  permissions: RolePermissions;
}

export const USER_ROLES = {
  IT_ADMIN: {
    roleName: "IT ADMIN",
    labelKey: "roles.itAdmin",
    // View-only: IT Admin can browse all pages but cannot edit/add/upload.
    permissions: VIEW_ONLY_PERMISSIONS,
  },
  IT_MEMBER: {
    roleName: "IT MEMBER",
    labelKey: "roles.itMember",
    // View-only: IT Member can browse all pages but cannot edit/add/upload.
    permissions: VIEW_ONLY_PERMISSIONS,
  },
  OPERATIONS_STAFF: {
    roleName: "OPERATION STAFF",
    labelKey: "roles.operationsStaff",
    permissions: FULL_ACCESS_PERMISSIONS,
  },
  BUSINESS_PLANNING: {
    roleName: "BUSINESS PLANNING",
    labelKey: "roles.businessPlanning",
    permissions: FULL_ACCESS_PERMISSIONS,
  },
} as const satisfies Record<string, RoleInfo>;

export type UserRoleKey = keyof typeof USER_ROLES;
export type UserRoleName = (typeof USER_ROLES)[UserRoleKey]["roleName"];

/**
 * Menu item / screen ids the Business Planning role is allowed to reach. This
 * role only works with adjustment data, so the home page, the sidebar, and the
 * route guard all hide/deny every other screen.
 */
export const BUSINESS_PLANNING_ALLOWED_ITEM_IDS: readonly string[] = [
  "adjustment-data-upload",
  "adjustment-file-deletion",
];

/**
 * Whether a user with `roleName` may access the menu item / screen `itemId`.
 * Business Planning is restricted to the adjustment upload + deletion screens;
 * every other recognized role can access all menu items (admin items remain
 * gated separately to IT Admin via `createMenuSections` / route guards).
 */
export function canAccessMenuItem(
  roleName: string | null | undefined,
  itemId: string,
): boolean {
  if (roleName === USER_ROLES.BUSINESS_PLANNING.roleName) {
    return BUSINESS_PLANNING_ALLOWED_ITEM_IDS.includes(itemId);
  }
  return true;
}

/** Resolve the i18n label key for a backend role name (e.g. "IT Admin"). */
export function getRoleLabelKey(roleName: string): string | undefined {
  return Object.values(USER_ROLES).find((r) => r.roleName === roleName)
    ?.labelKey;
}

/**
 * Whether the given backend `role_name` is one of the recognized application
 * roles. Anything else (including `null`, `"Unassigned"`, or an unknown value)
 * is treated as not having an assigned role.
 */
export function hasAssignedRole(roleName: string | null | undefined): boolean {
  if (!roleName) return false;
  return Object.values(USER_ROLES).some((r) => r.roleName === roleName);
}

/** Whether the given backend `role_name` is the IT Admin role. */
export function isItAdmin(roleName: string | null | undefined): boolean {
  return roleName === USER_ROLES.IT_ADMIN.roleName;
}

/**
 * Resolve the capability config for a backend `role_name`. Unknown / unassigned
 * roles get `NO_ACCESS_PERMISSIONS`.
 */
export function getRolePermissions(
  roleName: string | null | undefined,
): RolePermissions {
  if (!roleName) return NO_ACCESS_PERMISSIONS;
  return (
    Object.values(USER_ROLES).find((r) => r.roleName === roleName)
      ?.permissions ?? NO_ACCESS_PERMISSIONS
  );
}
