import type { UserRole } from './enums/user-role.enum.js';

// Shape JwtStrategy.validate() puts on request.user. Only the fields every
// ownership/role check needs are declared, so controllers stay honest about
// what they actually rely on.
export type AuthenticatedUser = {
  id: string;
  role: UserRole;
};

export type AuthenticatedRequest = Request & { user?: AuthenticatedUser };
