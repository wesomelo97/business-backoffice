import {
  ShoppingBag,
  DollarSign,
  TriangleAlert,
  CalendarDays,
  ArrowRight,
  Package,
} from "lucide-react";

import seedData from "../../projects/caderno-dvinho/seedData";

import { Link } from "react-router-dom";

const formatCurrency = (value) =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);

const statusClass = (status) =>
  status.toLowerCase().replaceAll(" ", "-").replaceAll("ç", "c");

function DashboardPage() {
  const {
    metrics,
    recentOrders,
    lowStockProducts,
    upcomingReservations,
  } = seedData;

  return (
    <div className="dashboard-page">
      <section className="dashboard-heading">
        <div>
          <span className="eyebrow">VISÃO OPERACIONAL</span>
          <h1>Resumo da operação</h1>
          <p>
            Acompanhe pedidos, estoque, reservas e movimentações mais
            importantes da Caderno D&apos;Vinho.
          </p>
        </div>

        <div className="dashboard-date">
          <span>Hoje</span>
          <strong>24 de setembro</strong>
        </div>
      </section>

      <section className="metric-grid">
        <MetricCard
          title="Pedidos hoje"
          value={metrics.ordersToday}
          description="Pedidos registrados"
          icon={ShoppingBag}
          variant="wine"
        />

        <MetricCard
          title="Receita hoje"
          value={formatCurrency(metrics.revenueToday)}
          description="Receita confirmada"
          icon={DollarSign}
          variant="olive"
        />

        <MetricCard
          title="Estoque baixo"
          value={metrics.lowStock}
          description="Produtos exigem atenção"
          icon={TriangleAlert}
          variant="brown"
        />

        <MetricCard
          title="Reservas hoje"
          value={metrics.reservationsToday}
          description="Pessoas confirmadas"
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
                  <th>Horário</th>
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
                    <td>{order.time}</td>
                    <td>
                      <span
                        className={`status-badge status-${statusClass(
                          order.status
                        )}`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td>
                      <strong>{formatCurrency(order.total)}</strong>
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

          <div className="stock-list">
            {lowStockProducts.map((product) => {
              const percentage = Math.min(
                (product.stock / product.minimum) * 100,
                100
              );

              return (
                <div className="stock-item" key={product.name}>
                  <div className="stock-icon">
                    <Package size={18} />
                  </div>

                  <div className="stock-info">
                    <div className="stock-top">
                      <strong>{product.name}</strong>

                      <span>
                        {product.stock} / {product.minimum}
                      </span>
                    </div>

                    <div className="stock-progress">
                      <div
                        className="stock-progress-value"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="dashboard-panel dashboard-panel-full">
          <PanelHeader
            title="Próximas reservas"
            subtitle="Experiências que exigem acompanhamento"
            action="Ver reservas"
            to="/reservas"
          />

          <div className="reservation-grid">
            {upcomingReservations.map((reservation) => (
              <article className="reservation-card" key={reservation.id}>
                <div className="reservation-date">
                  <CalendarDays size={18} />

                  <div>
                    <strong>{reservation.date}</strong>
                    <span>{reservation.time}</span>
                  </div>
                </div>

                <div className="reservation-content">
                  <span>{reservation.id}</span>
                  <h3>{reservation.experience}</h3>
                  <p>{reservation.customer}</p>
                </div>

                <div className="reservation-footer">
                  <span>{reservation.people} pessoas</span>

                  <span
                    className={`status-badge status-${statusClass(
                      reservation.status
                    )}`}
                  >
                    {reservation.status}
                  </span>
                </div>
              </article>
            ))}
          </div>
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
      <div className={`metric-icon metric-icon-${variant}`}>
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

function PanelHeader({ title, subtitle, action, to }) {
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