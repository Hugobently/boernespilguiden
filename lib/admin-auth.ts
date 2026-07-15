/**
 * Shared auth check for admin API routes.
 * Fails closed: if ADMIN_SECRET is not configured, nothing is authorized
 * (otherwise "Bearer undefined" would match the interpolated template).
 */
export function isAdminAuthorized(request: Request): boolean {
  const secret = process.env.ADMIN_SECRET;
  if (!secret) return false;
  return request.headers.get('authorization') === `Bearer ${secret}`;
}
