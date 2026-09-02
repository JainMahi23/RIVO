import AppRoutes from "./routes/AppRoutes.jsx";

// App is intentionally thin: it wires providers (context, i18n, etc.)
// around the route tree. No business logic lives here.
export default function App() {
  return <AppRoutes />;
}
