import { type RouteConfig, index, prefix, route } from '@react-router/dev/routes';

// The following routing definition is what is called Framework routing
// There's other modes like: Data and Declarative routing
// See https://reactrouter.com/start/modes for more details
export default [
  route('/:id?', 'routes/home.tsx'),
  // The following route handles the well-known path to avoid a harmless routing error in the console
  {
    path: '/.well-known/*',
    file: 'routes/well-known.tsx',
  },
  // API routes for todos (server-side handlers)
  // There's several ways to define nested routes; here's one using 'prefix' and 'route' helpers
  ...prefix('api/todos', [
    index('routes/api/todos/index.tsx'),
    route(':id', 'routes/api/todos/$id.tsx'),
  ]),
  // The following are examples of how to define the same routes without helpers
  // {
  //   path: "api/todos",
  //   file: "routes/api/todos/index.tsx",
  // },
  // {
  //   path: "api/todos/:id",
  //   file: "routes/api/todos/$id.tsx",
  // },
] satisfies RouteConfig;


// Routes by file structure could be achieved by using @react-router/fs-routes (https://reactrouter.com/how-to/file-route-conventions),
// but for clarity and explicitness in this example, we're defining them manually.