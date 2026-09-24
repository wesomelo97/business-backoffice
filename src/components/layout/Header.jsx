import { Search, Bell } from "lucide-react";

function Header() {
  return (
    <header className="topbar">
      <div>
        <h2>Dashboard</h2>
        <p>Visão geral da operação</p>
      </div>

      <div className="topbar-actions">
        <div className="search">
          <Search size={18} />
          <input type="text" placeholder="Buscar..." />
        </div>

        <button className="icon-button">
          <Bell size={20} />
        </button>

        <div className="operator">
          <div className="operator-avatar">OP</div>

          <div>
            <strong>Operador</strong>
            <span>Administrador</span>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;