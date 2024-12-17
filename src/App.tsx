import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useTokenStore } from "./stores/token";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { router } from "./routes";
import { Toaster } from "react-hot-toast";
import { RouterProvider } from "react-router-dom";

const queryClient = new QueryClient();

function App() {
  const accessToken = useTokenStore.getState().accessToken;

  if (
    !accessToken &&
    window.location.pathname !== "/login" &&
    window.location.pathname !== "/signup"
  ) {
    location.href = "/login";
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />

      {import.meta.env.MODE === "development" && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}

      <Toaster position="top-right" />
    </QueryClientProvider>
  );
}

export default App;
