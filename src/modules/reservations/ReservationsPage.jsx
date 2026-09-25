import { useMemo, useState } from "react";
import {
  Search,
  CalendarDays,
  Users,
  Clock,
  CircleCheck,
  Eye,
} from "lucide-react";

import seedData from "../../projects/caderno-dvinho/seedData";
import {
  getStoredData,
  saveStoredData,
} from "../../services/storage";

const PROJECT_ID = "caderno-dvinho";

const reservationStatuses = [
  "Pendente",
  "Confirmada",
  "Concluída",
  "Cancelada",
];

function normalizeStatus(status) {
  return status
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function ReservationsPage() {
  const [reservations, setReservations] = useState(() =>
    getStoredData(
      PROJECT_ID,
      "reservations",
      seedData.reservations
    )
  );

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("Todos");
  const [selectedReservationId, setSelectedReservationId] =
    useState(null);

  const filteredReservations = useMemo(() => {
    return reservations.filter((reservation) => {
      const search = searchTerm.toLowerCase();

      const matchesSearch =
        reservation.customer.toLowerCase().includes(search) ||
        reservation.experience.toLowerCase().includes(search) ||
        reservation.location.toLowerCase().includes(search) ||
        reservation.id.toLowerCase().includes(search);

      const matchesStatus =
        statusFilter === "Todos" ||
        reservation.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [reservations, searchTerm, statusFilter]);

  const selectedReservation =
    reservations.find(
      (reservation) =>
        reservation.id === selectedReservationId
    ) || null;

  const confirmedCount = reservations.filter(
    (reservation) => reservation.status === "Confirmada"
  ).length;

  const pendingCount = reservations.filter(
    (reservation) => reservation.status === "Pendente"
  ).length;

  const totalPeople = reservations
    .filter(
      (reservation) =>
        reservation.status !== "Cancelada"
    )
    .reduce(
      (sum, reservation) => sum + reservation.people,
      0
    );

  const completedCount = reservations.filter(
    (reservation) => reservation.status === "Concluída"
  ).length;

  function updateReservationStatus(
    reservationId,
    newStatus
  ) {
    const updatedReservations = reservations.map(
      (reservation) =>
        reservation.id === reservationId
          ? {
              ...reservation,
              status: newStatus,
            }
          : reservation
    );

    setReservations(updatedReservations);

    saveStoredData(
      PROJECT_ID,
      "reservations",
      updatedReservations
    );
  }

  return (
    <div className="module-page">
      <section className="module-heading">
        <div>
          <span className="eyebrow">
            EXPERIÊNCIAS
          </span>

          <h1>Reservas</h1>

          <p>
            Acompanhe degustações, experiências e reservas dos
            quiosques.
          </p>
        </div>
      </section>

      <section className="metric-grid">
        <article className="metric-card">
          <div className="metric-icon metric-icon-wine">
            <CalendarDays size={21} />
          </div>

          <div className="metric-card-content">
            <span>Total de reservas</span>
            <strong>{reservations.length}</strong>
            <small>Reservas cadastradas</small>
          </div>
        </article>

        <article className="metric-card">
          <div className="metric-icon metric-icon-olive">
            <CircleCheck size={21} />
          </div>

          <div className="metric-card-content">
            <span>Confirmadas</span>
            <strong>{confirmedCount}</strong>
            <small>Reservas ativas</small>
          </div>
        </article>

        <article className="metric-card">
          <div className="metric-icon metric-icon-brown">
            <Clock size={21} />
          </div>

          <div className="metric-card-content">
            <span>Pendentes</span>
            <strong>{pendingCount}</strong>
            <small>Aguardando confirmação</small>
          </div>
        </article>

        <article className="metric-card">
          <div className="metric-icon metric-icon-wine">
            <Users size={21} />
          </div>

          <div className="metric-card-content">
            <span>Pessoas previstas</span>
            <strong>{totalPeople}</strong>
            <small>
              {completedCount} experiências concluídas
            </small>
          </div>
        </article>
      </section>

      <section className="module-toolbar">
        <div className="module-search">
          <Search size={18} />

          <input
            type="text"
            placeholder="Buscar cliente, experiência ou unidade..."
            value={searchTerm}
            onChange={(event) =>
              setSearchTerm(event.target.value)
            }
          />
        </div>

        <div className="inventory-filters">
          <select
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(event.target.value)
            }
          >
            <option>Todos</option>

            {reservationStatuses.map((status) => (
              <option key={status}>
                {status}
              </option>
            ))}
          </select>
        </div>
      </section>

      <section className="module-panel">
        <div className="module-panel-header">
          <div>
            <h2>Agenda de reservas</h2>

            <p>
              {filteredReservations.length} reservas encontradas
            </p>
          </div>
        </div>

        <div className="table-wrapper">
          <table className="management-table">
            <thead>
              <tr>
                <th>Reserva</th>
                <th>Cliente</th>
                <th>Experiência</th>
                <th>Data</th>
                <th>Horário</th>
                <th>Pessoas</th>
                <th>Unidade</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>

            <tbody>
              {filteredReservations.map((reservation) => (
                <tr key={reservation.id}>
                  <td>
                    <strong>
                      {reservation.id}
                    </strong>
                  </td>

                  <td>
                    <div className="customer-cell">
                      <strong>
                        {reservation.customer}
                      </strong>

                      <span>
                        {reservation.email}
                      </span>
                    </div>
                  </td>

                  <td>
                    {reservation.experience}
                  </td>

                  <td>
                    {reservation.date}
                  </td>

                  <td>
                    {reservation.time}
                  </td>

                  <td>
                    {reservation.people}
                  </td>

                  <td>
                    {reservation.location}
                  </td>

                  <td>
                    <span
                      className={`reservation-status reservation-status-${normalizeStatus(
                        reservation.status
                      )}`}
                    >
                      {reservation.status}
                    </span>
                  </td>

                  <td>
                    <button
                      className="table-action"
                      onClick={() =>
                        setSelectedReservationId(
                          reservation.id
                        )
                      }
                      title="Ver reserva"
                    >
                      <Eye size={17} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredReservations.length === 0 && (
          <div className="empty-state">
            Nenhuma reserva encontrada.
          </div>
        )}
      </section>

      {selectedReservation && (
        <div
          className="drawer-overlay"
          onClick={() =>
            setSelectedReservationId(null)
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
                  RESERVA
                </span>

                <h2>
                  {selectedReservation.id}
                </h2>
              </div>

              <button
                className="drawer-close"
                onClick={() =>
                  setSelectedReservationId(null)
                }
              >
                ×
              </button>
            </div>

            <div className="drawer-section">
              <span>Cliente</span>

              <strong>
                {selectedReservation.customer}
              </strong>

              <p>
                {selectedReservation.email}
              </p>
            </div>

            <div className="drawer-section">
              <span>Experiência</span>

              <strong>
                {selectedReservation.experience}
              </strong>

              <p>
                {selectedReservation.location}
              </p>
            </div>

            <div className="drawer-info-grid">
              <div>
                <span>Data</span>

                <strong>
                  {selectedReservation.date}
                </strong>
              </div>

              <div>
                <span>Horário</span>

                <strong>
                  {selectedReservation.time}
                </strong>
              </div>

              <div>
                <span>Pessoas</span>

                <strong>
                  {selectedReservation.people}
                </strong>
              </div>

              <div>
                <span>Status</span>

                <strong>
                  {selectedReservation.status}
                </strong>
              </div>
            </div>

            <div className="drawer-section">
              <span>Status da reserva</span>

              <select
                className="customer-profile-select"
                value={selectedReservation.status}
                onChange={(event) =>
                  updateReservationStatus(
                    selectedReservation.id,
                    event.target.value
                  )
                }
              >
                {reservationStatuses.map((status) => (
                  <option key={status}>
                    {status}
                  </option>
                ))}
              </select>

              <p>
                A alteração é salva automaticamente neste navegador.
              </p>
            </div>

            {selectedReservation.notes && (
              <div className="drawer-section">
                <span>Observações</span>

                <p className="reservation-notes">
                  {selectedReservation.notes}
                </p>
              </div>
            )}
          </aside>
        </div>
      )}
    </div>
  );
}

export default ReservationsPage;