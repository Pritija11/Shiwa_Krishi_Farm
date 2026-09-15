// Login lives at an unguessable path instead of /admin/login so it isn't
// discoverable by casual visitors or bots scanning common admin URLs.
// forgot-password and reset-password are physically nested folders under
// this same path (see src/app/admin/), so deriving them here keeps the
// string always in sync with the actual file structure — if you ever move
// the folder, update ADMIN_LOGIN_PATH and the other two follow correctly.
//
// No server-only imports here (bcrypt/Prisma/NextAuth) so this is safe to
// import from both server code and client components.
export const ADMIN_LOGIN_PATH = "/admin/gate-1d2a951ba82a";
export const ADMIN_FORGOT_PASSWORD_PATH = `${ADMIN_LOGIN_PATH}/forgot-password`;
export const ADMIN_RESET_PASSWORD_PATH = `${ADMIN_LOGIN_PATH}/reset-password`;
