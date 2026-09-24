import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Users,
  CalendarDays,
} from "lucide-react";

const menuItems = [
  { label: "Dashboard", icon: LayoutDashboard },
  { label: "Pedidos", icon: ShoppingBag },
  { label: "Produtos & Estoque", icon: Package },
  { label: "Clientes", icon: Users },
  { label: "Reservas", icon: CalendarDays },
];

function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <h1>Caderno D'Vinho</h1>
        <span>Operação</span>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map(({ label, icon: Icon }, index) => (
          <button
            key={label}
            className={`sidebar-link ${index === 0 ? "active" : ""}`}
          >
            <Icon size={20} />
            <span>{label}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;