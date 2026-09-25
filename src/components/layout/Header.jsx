import {
  Search,
  Bell,
} from "lucide-react";

import { useLocation } from "react-router-dom";

const pageInfo = {
  "/dashboard": {
    title: "Dashboard",
    subtitle: "Visão geral da operação",
  },

  "/pedidos": {
    title: "Pedidos",
    subtitle: "Gestão dos pedidos da operação",
  },

  "/estoque": {
    title: "Produtos & Estoque",
    subtitle: "Controle de produtos e disponibilidade",
  },

  "/clientes": {
    title: "Clientes",
    subtitle: "Relacionamento e histórico comercial",
  },

  "/reservas": {
    title: "Reservas",
    subtitle: "Gestão das experiências da marca",
  },
};

function Header() {
  const location = useLocation();

  const currentPage =
    pageInfo[location.pathname] ||
    pageInfo["/dashboard"];

  return (
    <header className="topbar">
      <div>
        <h2>{currentPage.title}</h2>
        <p>{currentPage.subtitle}</p>
      </div>

      <div className="topbar-actions">
        <div className="search">
          <Search size={18} />

          <input
            type="text"
            placeholder="Buscar..."
          />
        </div>

        <button
          className="icon-button"
          title="Notificações"
        >
          <Bell size={20} />
        </button>

        <div className="operator">
          <div className="operator-avatar">
            OP
          </div>

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