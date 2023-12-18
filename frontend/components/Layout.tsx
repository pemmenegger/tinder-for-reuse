import Footer from "./navigation/Footer";
import { Toaster } from "react-hot-toast";
import Sidebar from "./navigation/Sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-lbeige font-body-400 relative min-h-screen">
      <div className="mx-auto max-w-screen-xl flex flex-col md:flex-row py-4 md:pt-10 md:pb-24">
        <div className="md:fixed lg:w-1/5 lg:max-w-[250px] ">
          <Sidebar />
        </div>
        <main className="px-3 md:px-4 md:px-0 md:w-1/2 md:mx-auto">
          {children}
        </main>
      </div>
      <Footer />
      <Toaster position="top-right" />
    </div>
  );
}
