import {
  RefreshCcw,
} from "lucide-react";

import { useLocation } from "react-router-dom";

import { resetProjectData } from "../../services/storage";

const PROJECT_ID = "caderno-dvinho";

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

  function handleResetDemo() {
    const confirmed = window.confirm(
      "Restaurar todos os dados da demonstração? As alterações feitas em pedidos, estoque, clientes e reservas serão apagadas."
    );

    if (!confirmed) return;

    resetProjectData(PROJECT_ID);

    window.location.reload();
  }

  return (
    <header className="topbar">
      <div>
        <h2>{currentPage.title}</h2>
        <p>{currentPage.subtitle}</p>
      </div>

      <div className="topbar-actions">
        <button
          className="reset-demo-button"
          onClick={handleResetDemo}
          title="Restaurar dados iniciais"
        >
          <RefreshCcw size={16} />

          <span>
            Restaurar demonstração
          </span>
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