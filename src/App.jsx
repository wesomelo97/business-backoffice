import { Navigate, Route, Routes } from "react-router-dom";

import AppLayout from "./components/layout/AppLayout";

import DashboardPage from "./modules/dashboard/DashboardPage";
import OrdersPage from "./modules/orders/OrdersPage";
import InventoryPage from "./modules/inventory/InventoryPage";
import CustomersPage from "./modules/customers/CustomersPage";
import ReservationsPage from "./modules/reservations/ReservationsPage";

function App() {
  return (
    <AppLayout>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/pedidos" element={<OrdersPage />} />
        <Route path="/estoque" element={<InventoryPage />} />
        <Route path="/clientes" element={<CustomersPage />} />
        <Route path="/reservas" element={<ReservationsPage />} />

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </AppLayout>
  );
}

export default App;