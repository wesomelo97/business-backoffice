import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Users,
  CalendarDays,
} from "lucide-react";

import { NavLink } from "react-router-dom";

const menuItems = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    path: "/dashboard",
  },
  {
    label: "Pedidos",
    icon: ShoppingBag,
    path: "/pedidos",
  },
  {
    label: "Produtos & Estoque",
    icon: Package,
    path: "/estoque",
  },
  {
    label: "Clientes",
    icon: Users,
    path: "/clientes",
  },
  {
    label: "Reservas",
    icon: CalendarDays,
    path: "/reservas",
  },
];

function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <h1>Caderno D'Vinho</h1>
        <span>Operação</span>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map(({ label, icon: Icon, path }) => (
          <NavLink
            key={label}
            to={path}
            className={({ isActive }) =>
              `sidebar-link ${isActive ? "active" : ""}`
            }
          >
            <Icon size={20} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;