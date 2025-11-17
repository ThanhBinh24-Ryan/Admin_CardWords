export const USER_ROLES = {
  USER: 'ROLE_USER',
  ADMIN: 'ROLE_ADMIN'
} as const;

export type UserRole = typeof USER_ROLES[keyof typeof USER_ROLES];

export const ROLE_OPTIONS = [
  { value: USER_ROLES.USER, label: 'User' },
  { value: USER_ROLES.ADMIN, label: 'Admin' }
];