// TODO: validation utilities / zod schemas
export function isEmail(s) {
  return typeof s === 'string' && s.includes('@');
}
