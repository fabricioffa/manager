import type { Roles } from '~/types/globals';
import type {
  SignedInAuthObject,
  SignedOutAuthObject,
} from '@clerk/nextjs/server';

export const checkRole = (
  auth: SignedInAuthObject | SignedOutAuthObject,
  role: Roles
) => {
console.log('%c role', 'color: green', role)
  console.log('%c auth.sessionClaims?.metadata.role', 'color: green', auth.sessionClaims?.metadata.role)
  return auth.sessionClaims?.metadata.role === role;
};
