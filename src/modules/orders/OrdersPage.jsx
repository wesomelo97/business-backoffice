import { useMemo, useState } from "react";
import {
  Search,
  SlidersHorizontal,
  Eye,
  ChevronDown,
} from "lucide-react";

import seedData from "../../projects/caderno-dvinho/seedData";
import {
  getStoredData,
  saveStoredData,
} from "../../services/storage";

const PROJECT_ID = "caderno-dvinho";

const orderStatuses = [
  "Recebido",
  "Pago",
  "Separação",
  "Enviado",
  "Entregue",
  "Cancelado",
];

const formatCurrency = (value) =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);

const normalizeStatus = (status) =>
  status
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replaceAll(" ", "-");

function OrdersPage() {
  const [orders, setOrders] = useState(() =>
    getStoredData(PROJECT_ID, "orders", seedData.orders)
  );

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("Todos");
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  const selectedOrder =
    orders.find((order) => order.id === selectedOrderId) || null;

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const search = searchTerm.toLowerCase();

      const matchesSearch =
        order.id.toLowerCase().includes(search) ||
        order.customer.toLowerCase().includes(search) ||
        order.channel.toLowerCase().includes(search);

      const matchesStatus =
        statusFilter === "Todos" || order.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [orders, searchTerm, statusFilter]);

  function updateOrderStatus(orderId, newStatus) {
    const updatedOrders = orders.map((order) =>
      order.id === orderId
        ? {
            ...order,
            status: newStatus,
          }
        : order
    );

    setOrders(updatedOrders);

    saveStoredData(
      PROJECT_ID,
      "orders",
      updatedOrders
    );
  }

  return (
    <div className="module-page">
      <section className="module-heading">
        <div>
          <span className="eyebrow">OPERAÇÃO</span>

          <h1>Pedidos</h1>

          <p>
            Acompanhe os pedidos realizados no e-commerce e nos quiosques.
          </p>
        </div>
      </section>

      <section className="module-toolbar">
        <div className="module-search">
          <Search size={18} />

          <input
            type="text"
            placeholder="Buscar por pedido, cliente ou canal..."
            value={searchTerm}
            onChange={(event) =>
              setSearchTerm(event.target.value)
            }
          />
        </div>

        <div className="filter-control">
          <SlidersHorizontal size={16} />

          <select
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(event.target.value)
            }
          >
            <option>Todos</option>

            {orderStatuses.map((status) => (
              <option key={status}>
                {status}
              </option>
            ))}
          </select>

          <ChevronDown size={15} />
        </div>
      </section>

      <section className="module-panel">
        <div className="module-panel-header">
          <div>
            <h2>Lista de pedidos</h2>

            <p>
              {filteredOrders.length} pedidos encontrados
            </p>
          </div>
        </div>

        <div className="table-wrapper">
          <table className="management-table">
            <thead>
              <tr>
                <th>Pedido</th>
                <th>Cliente</th>
                <th>Data</th>
                <th>Canal</th>
                <th>Pagamento</th>
                <th>Itens</th>
                <th>Status</th>
                <th>Valor</th>
                <th></th>
              </tr>
            </thead>

            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order.id}>
                  <td>
                    <strong>{order.id}</strong>
                  </td>

                  <td>
                    <div className="customer-cell">
                      <strong>
                        {order.customer}
                      </strong>

                      <span>
                        {order.email}
                      </span>
                    </div>
                  </td>

                  <td>
                    <div className="date-cell">
                      <span>
                        {order.date}
                      </span>

                      <small>
                        {order.time}
                      </small>
                    </div>
                  </td>

                  <td>
                    {order.channel}
                  </td>

                  <td>
                    {order.payment}
                  </td>

                  <td>
                    {order.items}
                  </td>

                  <td>
                    <span
                      className={`status-badge status-${normalizeStatus(
                        order.status
                      )}`}
                    >
                      {order.status}
                    </span>
                  </td>

                  <td>
                    <strong>
                      {formatCurrency(order.total)}
                    </strong>
                  </td>

                  <td>
                    <button
                      className="table-action"
                      onClick={() =>
                        setSelectedOrderId(order.id)
                      }
                      title="Ver pedido"
                    >
                      <Eye size={17} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredOrders.length === 0 && (
          <div className="empty-state">
            Nenhum pedido encontrado com esses filtros.
          </div>
        )}
      </section>

      {selectedOrder && (
        <div
          className="drawer-overlay"
          onClick={() =>
            setSelectedOrderId(null)
          }
        >
          <aside
            className="order-drawer"
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            <div className="drawer-header">
              <div>
                <span className="eyebrow">
                  DETALHES DO PEDIDO
                </span>

                <h2>
                  {selectedOrder.id}
                </h2>
              </div>

              <button
                className="drawer-close"
                onClick={() =>
                  setSelectedOrderId(null)
                }
              >
                ×
              </button>
            </div>

            <div className="drawer-section">
              <span>Cliente</span>

              <strong>
                {selectedOrder.customer}
              </strong>

              <p>
                {selectedOrder.email}
              </p>
            </div>

            <div className="drawer-info-grid">
              <div>
                <span>Data</span>

                <strong>
                  {selectedOrder.date}
                </strong>
              </div>

              <div>
                <span>Horário</span>

                <strong>
                  {selectedOrder.time}
                </strong>
              </div>

              <div>
                <span>Canal</span>

                <strong>
                  {selectedOrder.channel}
                </strong>
              </div>

              <div>
                <span>Pagamento</span>

                <strong>
                  {selectedOrder.payment}
                </strong>
              </div>
            </div>

            <div className="drawer-section">
              <span>Status do pedido</span>

              <div className="status-editor">
                <span
                  className={`status-badge status-${normalizeStatus(
                    selectedOrder.status
                  )}`}
                >
                  {selectedOrder.status}
                </span>

                <select
                  value={selectedOrder.status}
                  onChange={(event) =>
                    updateOrderStatus(
                      selectedOrder.id,
                      event.target.value
                    )
                  }
                >
                  {orderStatuses.map((status) => (
                    <option key={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>

              <p className="status-help">
                A alteração é salva automaticamente neste navegador.
              </p>
            </div>

            <div className="drawer-total">
              <span>Total do pedido</span>

              <strong>
                {formatCurrency(
                  selectedOrder.total
                )}
              </strong>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}

export default OrdersPage;