import { Outlet } from "react-router";
import Navbar from "./components/layout/Navbar";
import { Toaster } from "sonner";
import Footer from "./components/layout/Footer";
function App() {
  return (
    <>
      <Navbar />
      <Outlet />
      <Toaster richColors position="top-right" />
      <Footer />
    </>
  );
}

export default App;
