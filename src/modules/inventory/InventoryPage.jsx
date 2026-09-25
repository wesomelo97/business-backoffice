import { useMemo, useState } from "react";
import {
  Search,
  Package,
  TriangleAlert,
  Boxes,
  Eye,
  ArrowDownToLine,
  ArrowUpFromLine,
} from "lucide-react";

import seedData from "../../projects/caderno-dvinho/seedData";
import {
  getStoredData,
  saveStoredData,
} from "../../services/storage";

const PROJECT_ID = "caderno-dvinho";

const formatCurrency = (value) =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);

function getStockStatus(stock, minimum) {
  if (stock <= minimum * 0.5) return "Crítico";
  if (stock <= minimum) return "Baixo";
  return "Normal";
}

function normalizeStatus(status) {
  return status
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function InventoryPage() {
  const [products, setProducts] = useState(() =>
    getStoredData(PROJECT_ID, "products", seedData.products)
  );

  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("Todas");
  const [statusFilter, setStatusFilter] = useState("Todos");
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [movementType, setMovementType] = useState("entrada");
  const [movementQuantity, setMovementQuantity] = useState(1);
  const [movementReason, setMovementReason] = useState("");

  const selectedProduct =
    products.find((product) => product.id === selectedProductId) || null;

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const status = getStockStatus(product.stock, product.minimum);

      const matchesSearch =
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.id.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory =
        categoryFilter === "Todas" ||
        product.category === categoryFilter;

      const matchesStatus =
        statusFilter === "Todos" ||
        status === statusFilter;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [products, searchTerm, categoryFilter, statusFilter]);

  const totalStock = products.reduce(
    (sum, product) => sum + product.stock,
    0
  );

  const criticalCount = products.filter(
    (product) =>
      getStockStatus(product.stock, product.minimum) !== "Normal"
  ).length;

  const stockValue = products.reduce(
    (sum, product) => sum + product.stock * product.cost,
    0
  );

  function registerMovement() {
    const quantity = Number(movementQuantity);

    if (!selectedProduct || quantity <= 0) return;

    const updatedProducts = products.map((product) => {
      if (product.id !== selectedProduct.id) return product;

      const newStock =
        movementType === "entrada"
          ? product.stock + quantity
          : Math.max(0, product.stock - quantity);

      return {
        ...product,
        stock: newStock,
      };
    });

    setProducts(updatedProducts);

    saveStoredData(
      PROJECT_ID,
      "products",
      updatedProducts
    );

    setMovementQuantity(1);
    setMovementReason("");
  }

  return (
    <div className="module-page">
      <section className="module-heading">
        <div>
          <span className="eyebrow">OPERAÇÃO</span>
          <h1>Produtos & Estoque</h1>
          <p>
            Controle de produtos, disponibilidade e movimentações de estoque.
          </p>
        </div>
      </section>

      <section className="metric-grid">
        <article className="metric-card">
          <div className="metric-icon metric-icon-wine">
            <Package size={21} />
          </div>
          <div className="metric-card-content">
            <span>SKUs cadastrados</span>
            <strong>{products.length}</strong>
            <small>Produtos ativos</small>
          </div>
        </article>

        <article className="metric-card">
          <div className="metric-icon metric-icon-olive">
            <Boxes size={21} />
          </div>
          <div className="metric-card-content">
            <span>Unidades em estoque</span>
            <strong>{totalStock}</strong>
            <small>Somatório atual</small>
          </div>
        </article>

        <article className="metric-card">
          <div className="metric-icon metric-icon-brown">
            <TriangleAlert size={21} />
          </div>
          <div className="metric-card-content">
            <span>Exigem atenção</span>
            <strong>{criticalCount}</strong>
            <small>Baixo ou crítico</small>
          </div>
        </article>

        <article className="metric-card">
          <div className="metric-icon metric-icon-wine">
            <Package size={21} />
          </div>
          <div className="metric-card-content">
            <span>Valor em estoque</span>
            <strong>{formatCurrency(stockValue)}</strong>
            <small>A custo estimado</small>
          </div>
        </article>
      </section>

      <section className="module-toolbar">
        <div className="module-search">
          <Search size={18} />
          <input
            type="text"
            placeholder="Buscar produto ou código..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
        </div>

        <div className="inventory-filters">
          <select
            value={categoryFilter}
            onChange={(event) => setCategoryFilter(event.target.value)}
          >
            <option>Todas</option>
            <option>Tinto</option>
            <option>Branco</option>
            <option>Rosé</option>
            <option>Espumante</option>
          </select>

          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
          >
            <option>Todos</option>
            <option>Normal</option>
            <option>Baixo</option>
            <option>Crítico</option>
          </select>
        </div>
      </section>

      <section className="module-panel">
        <div className="module-panel-header">
          <div>
            <h2>Estoque atual</h2>
            <p>{filteredProducts.length} produtos encontrados</p>
          </div>
        </div>

        <div className="table-wrapper">
          <table className="management-table">
            <thead>
              <tr>
                <th>Produto</th>
                <th>Categoria</th>
                <th>Linha</th>
                <th>Preço</th>
                <th>Estoque</th>
                <th>Mínimo</th>
                <th>Situação</th>
                <th></th>
              </tr>
            </thead>

            <tbody>
              {filteredProducts.map((product) => {
                const status = getStockStatus(
                  product.stock,
                  product.minimum
                );

                return (
                  <tr key={product.id}>
                    <td>
                      <div className="customer-cell">
                        <strong>{product.name}</strong>
                        <span>{product.id}</span>
                      </div>
                    </td>

                    <td>{product.category}</td>
                    <td>{product.line}</td>
                    <td>{formatCurrency(product.price)}</td>
                    <td>
                      <strong>{product.stock}</strong>
                    </td>
                    <td>{product.minimum}</td>

                    <td>
                      <span
                        className={`stock-status stock-status-${normalizeStatus(
                          status
                        )}`}
                      >
                        {status}
                      </span>
                    </td>

                    <td>
                      <button
                        className="table-action"
                        onClick={() =>
                          setSelectedProductId(product.id)
                        }
                      >
                        <Eye size={17} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {selectedProduct && (
        <div
          className="drawer-overlay"
          onClick={() => setSelectedProductId(null)}
        >
          <aside
            className="order-drawer"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="drawer-header">
              <div>
                <span className="eyebrow">PRODUTO</span>
                <h2>{selectedProduct.name}</h2>
              </div>

              <button
                className="drawer-close"
                onClick={() => setSelectedProductId(null)}
              >
                ×
              </button>
            </div>

            <div className="drawer-info-grid">
              <div>
                <span>Categoria</span>
                <strong>{selectedProduct.category}</strong>
              </div>

              <div>
                <span>Linha</span>
                <strong>{selectedProduct.line}</strong>
              </div>

              <div>
                <span>Preço</span>
                <strong>
                  {formatCurrency(selectedProduct.price)}
                </strong>
              </div>

              <div>
                <span>Custo</span>
                <strong>
                  {formatCurrency(selectedProduct.cost)}
                </strong>
              </div>
            </div>

            <div className="inventory-current-stock">
              <span>Estoque atual</span>
              <strong>{selectedProduct.stock}</strong>
              <small>
                Mínimo recomendado: {selectedProduct.minimum}
              </small>
            </div>

            <div className="drawer-section">
              <span>Movimentação de estoque</span>

              <div className="movement-type">
                <button
                  className={
                    movementType === "entrada"
                      ? "movement-button active"
                      : "movement-button"
                  }
                  onClick={() => setMovementType("entrada")}
                >
                  <ArrowDownToLine size={17} />
                  Entrada
                </button>

                <button
                  className={
                    movementType === "saida"
                      ? "movement-button active"
                      : "movement-button"
                  }
                  onClick={() => setMovementType("saida")}
                >
                  <ArrowUpFromLine size={17} />
                  Saída
                </button>
              </div>

              <label className="movement-field">
                <span>Quantidade</span>
                <input
                  type="number"
                  min="1"
                  value={movementQuantity}
                  onChange={(event) =>
                    setMovementQuantity(event.target.value)
                  }
                />
              </label>

              <label className="movement-field">
                <span>Motivo</span>
                <input
                  type="text"
                  placeholder="Ex.: reposição do fornecedor"
                  value={movementReason}
                  onChange={(event) =>
                    setMovementReason(event.target.value)
                  }
                />
              </label>

              <button
                className="primary-button"
                onClick={registerMovement}
              >
                Registrar movimentação
              </button>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}

export default InventoryPage;