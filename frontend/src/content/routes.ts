// Central route path constants. Import this instead of writing route
// strings inline — when a route's path changes, or a new one is added,
// this is the only file that needs to know.
export const ROUTES = {
  home: '/',
  signup: '/signup',
  login: '/login',
  catalog: '/catalog',
} as const
