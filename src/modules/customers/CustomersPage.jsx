import {
  ShoppingBag,
  DollarSign,
  TriangleAlert,
  CalendarDays,
  ArrowRight,
  Package,
} from "lucide-react";

import { Link } from "react-router-dom";

import seedData from "../../projects/caderno-dvinho/seedData";
import { getStoredData } from "../../services/storage";

const PROJECT_ID = "caderno-dvinho";

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

function parseBrazilianDate(date, time = "00:00") {
  const [day, month, year] = date.split("/");
  return new Date(`${year}-${month}-${day}T${time}:00`);
}

function DashboardPage() {
  const orders = getStoredData(
    PROJECT_ID,
    "orders",
    seedData.orders
  );

  const products = getStoredData(
    PROJECT_ID,
    "products",
    seedData.products
  );

  const reservations = getStoredData(
    PROJECT_ID,
    "reservations",
    seedData.reservations
  );

  const validOrders = orders.filter(
    (order) => order.status !== "Cancelado"
  );

  const ordersRevenue = validOrders.reduce(
    (sum, order) => sum + order.total,
    0
  );

  const recentOrders = [...orders]
    .sort((a, b) => {
      const dateA = parseBrazilianDate(a.date, a.time);
      const dateB = parseBrazilianDate(b.date, b.time);

      return dateB - dateA;
    })
    .slice(0, 5);

  const lowStockProducts = products
    .filter(
      (product) => product.stock <= product.minimum
    )
    .sort(
      (a, b) =>
        a.stock / a.minimum -
        b.stock / b.minimum
    )
    .slice(0, 5);

  const lowStockCount = products.filter(
    (product) => product.stock <= product.minimum
  ).length;

  const activeReservations = reservations.filter(
    (reservation) =>
      reservation.status === "Pendente" ||
      reservation.status === "Confirmada"
  );

  const upcomingReservations = [...activeReservations]
    .sort((a, b) => {
      const dateA = parseBrazilianDate(
        a.date,
        a.time
      );

      const dateB = parseBrazilianDate(
        b.date,
        b.time
      );

      return dateA - dateB;
    })
    .slice(0, 3);

  return (
    <div className="dashboard-page">
      <section className="dashboard-heading">
        <div>
          <span className="eyebrow">
            VISÃO OPERACIONAL
          </span>

          <h1>Resumo da operação</h1>

          <p>
            Pedidos, estoque e experiências consolidados em uma
            única visão da Caderno D&apos;Vinho.
          </p>
        </div>

        <div className="dashboard-date">
          <span>Operação ativa</span>
          <strong>Caderno D&apos;Vinho</strong>
        </div>
      </section>

      <section className="metric-grid">
        <MetricCard
          title="Pedidos registrados"
          value={validOrders.length}
          description="Desconsiderando cancelamentos"
          icon={ShoppingBag}
          variant="wine"
        />

        <MetricCard
          title="Receita registrada"
          value={formatCurrency(ordersRevenue)}
          description="Pedidos não cancelados"
          icon={DollarSign}
          variant="olive"
        />

        <MetricCard
          title="Estoque baixo"
          value={lowStockCount}
          description="Produtos exigem atenção"
          icon={TriangleAlert}
          variant="brown"
        />

        <MetricCard
          title="Reservas ativas"
          value={activeReservations.length}
          description="Pendentes ou confirmadas"
          icon={CalendarDays}
          variant="wine"
        />
      </section>

      <section className="dashboard-grid">
        <div className="dashboard-panel dashboard-panel-large">
          <PanelHeader
            title="Pedidos recentes"
            subtitle="Últimas movimentações da operação"
            action="Ver pedidos"
            to="/pedidos"
          />

          <div className="table-wrapper">
            <table className="dashboard-table">
              <thead>
                <tr>
                  <th>Pedido</th>
                  <th>Cliente</th>
                  <th>Canal</th>
                  <th>Data</th>
                  <th>Status</th>
                  <th>Valor</th>
                </tr>
              </thead>

              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id}>
                    <td>
                      <strong>{order.id}</strong>
                    </td>

                    <td>{order.customer}</td>

                    <td>{order.channel}</td>

                    <td>
                      {order.date}
                      <br />
                      <small>{order.time}</small>
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
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="dashboard-panel">
          <PanelHeader
            title="Estoque crítico"
            subtitle="Produtos abaixo do estoque mínimo"
            action="Ver estoque"
            to="/estoque"
          />

          {lowStockProducts.length > 0 ? (
            <div className="stock-list">
              {lowStockProducts.map((product) => {
                const percentage = Math.min(
                  (product.stock / product.minimum) *
                    100,
                  100
                );

                return (
                  <div
                    className="stock-item"
                    key={product.id}
                  >
                    <div className="stock-icon">
                      <Package size={18} />
                    </div>

                    <div className="stock-info">
                      <div className="stock-top">
                        <strong>
                          {product.name}
                        </strong>

                        <span>
                          {product.stock} /{" "}
                          {product.minimum}
                        </span>
                      </div>

                      <div className="stock-progress">
                        <div
                          className="stock-progress-value"
                          style={{
                            width: `${percentage}%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="dashboard-empty">
              Nenhum produto abaixo do estoque mínimo.
            </div>
          )}
        </div>

        <div className="dashboard-panel dashboard-panel-full">
          <PanelHeader
            title="Próximas reservas"
            subtitle="Experiências que exigem acompanhamento"
            action="Ver reservas"
            to="/reservas"
          />

          {upcomingReservations.length > 0 ? (
            <div className="reservation-grid">
              {upcomingReservations.map(
                (reservation) => (
                  <article
                    className="reservation-card"
                    key={reservation.id}
                  >
                    <div className="reservation-date">
                      <CalendarDays size={18} />

                      <div>
                        <strong>
                          {reservation.date}
                        </strong>

                        <span>
                          {reservation.time}
                        </span>
                      </div>
                    </div>

                    <div className="reservation-content">
                      <span>
                        {reservation.id}
                      </span>

                      <h3>
                        {reservation.experience}
                      </h3>

                      <p>
                        {reservation.customer}
                      </p>
                    </div>

                    <div className="reservation-footer">
                      <span>
                        {reservation.people} pessoas
                      </span>

                      <span
                        className={`status-badge status-${normalizeStatus(
                          reservation.status
                        )}`}
                      >
                        {reservation.status}
                      </span>
                    </div>
                  </article>
                )
              )}
            </div>
          ) : (
            <div className="dashboard-empty">
              Nenhuma reserva ativa.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

function MetricCard({
  title,
  value,
  description,
  icon: Icon,
  variant,
}) {
  return (
    <article className="metric-card">
      <div
        className={`metric-icon metric-icon-${variant}`}
      >
        <Icon size={21} />
      </div>

      <div className="metric-card-content">
        <span>{title}</span>
        <strong>{value}</strong>
        <small>{description}</small>
      </div>
    </article>
  );
}

function PanelHeader({
  title,
  subtitle,
  action,
  to,
}) {
  return (
    <div className="panel-header">
      <div>
        <h2>{title}</h2>
        <p>{subtitle}</p>
      </div>

      <Link className="panel-action" to={to}>
        {action}
        <ArrowRight size={16} />
      </Link>
    </div>
  );
}

export default DashboardPage;