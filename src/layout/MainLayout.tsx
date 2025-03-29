import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
  return (
    <>
      <Navbar />
      <section className="py-10">
        <Outlet />
      </section>
      <Footer />
    </>
  );
};

export default MainLayout;
