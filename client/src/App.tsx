import AppRoutes from "./routes/AppRoutes"
import { Toaster } from 'react-hot-toast';
import ScrollToTop from "./components/functional/ScrollToTop";
import { useUserRealTime } from "./hooks/user/useUserRealTime";

const App = () => {
  useUserRealTime();

  return (
    <>
      <ScrollToTop />
      <AppRoutes />
      <Toaster position="top-right" />
    </>
  )
}

export default App