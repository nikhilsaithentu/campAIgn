import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <div
      className="
        flex
        min-h-screen
        bg-slate-50
        dark:bg-slate-950
        transition-colors
      "
    >
      <Sidebar />

      <div className="flex flex-1 flex-col overflow-hidden">

        <Topbar />

        <main
          className="
            flex-1
            overflow-y-auto
            bg-slate-50
            dark:bg-slate-950
            transition-colors
          "
        >
          <div className="mx-auto max-w-[1700px] p-8">
            <Outlet />
          </div>
        </main>

      </div>
    </div>
  );
}