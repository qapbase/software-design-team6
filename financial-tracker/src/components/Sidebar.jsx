import { NavLink } from "react-router-dom";
import { LayoutDashboard, CalendarDays, Bot, User, Info } from "lucide-react";

function Sidebar() {

  const menu = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: LayoutDashboard
    },
    {
      name: "Calendar",
      path: "/calendar",
      icon: CalendarDays
    },
    {
      name: "Assistant",
      path: "/assistant",
      icon: Bot
    },
    {
      name: "Profile",
      path: "/profile",
      icon: User
    },
    {
      name: "About",
      path: "/about",
      icon: Info
    }
  ];

  return (

    <aside className="w-64 min-h-screen bg-[#050725] text-white flex flex-col">

      {/* LOGO */}
      <div className="flex items-center gap-3 px-6 py-6 border-b border-white/10">

        <div className="w-10 h-10 bg-[#F9B672] rounded-xl flex items-center justify-center text-[#050725] font-bold">
          ₱
        </div>

        <div>
          <h1 className="text-sm font-semibold">
            Financial Tracker
          </h1>

          <p className="text-xs text-gray-400">
            Budget Prediction
          </p>
        </div>

      </div>


      {/* MENU */}
      <nav className="flex flex-col gap-2 mt-6 px-3">

        {menu.map((item) => {

          const Icon = item.icon;

          return (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition
                ${
                  isActive
                    ? "bg-[#2C2F45] text-white"
                    : "text-gray-400 hover:bg-[#2C2F45] hover:text-white"
                }`
              }
            >
              <Icon size={18} />
              {item.name}
            </NavLink>
          );
        })}

      </nav>

    </aside>

  );
}

export default Sidebar;