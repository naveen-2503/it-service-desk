import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './hooks/useAuth'
import RequireAuth from './routes/RequireAuth'
import RequireAdmin from './routes/RequireAdmin'
import AppLayout from './components/common/AppLayout'
import { ToastProvider } from './hooks/useToast'
import { ThemeProvider } from './hooks/useTheme'

import LoginPage from './pages/Login/LoginPage'
import DashboardPage from './pages/Dashboard/DashboardPage'
import TicketListPage from './pages/Tickets/TicketListPage'
import CreateTicketPage from './pages/Tickets/CreateTicketPage'
import TicketDetailsPage from './pages/Tickets/TicketDetailsPage'
import EditTicketPage from './pages/Tickets/EditTicketPage'
import UserManagementPage from './pages/Users/UserManagementPage'
import CategoryManagementPage from './pages/Categories/CategoryManagementPage'
import ReportsPage from './pages/Reports/ReportsPage'
import ProfilePage from './pages/Profile/ProfilePage'

function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<LoginPage />} />

              <Route element={<RequireAuth />}>
                <Route element={<AppLayout />}>
                  <Route path="/dashboard" element={<DashboardPage />} />
                  <Route path="/profile" element={<ProfilePage />} />

                  <Route path="/tickets" element={<TicketListPage />} />
                  <Route path="/tickets/new" element={<CreateTicketPage />} />
                  <Route path="/tickets/:id" element={<TicketDetailsPage />} />
                  <Route path="/tickets/:id/edit" element={<EditTicketPage />} />

                  <Route element={<RequireAdmin />}>
                    <Route path="/users" element={<UserManagementPage />} />
                    <Route path="/categories" element={<CategoryManagementPage />} />
                    <Route path="/reports" element={<ReportsPage />} />
                  </Route>
                </Route>
              </Route>

              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  )
}

export default App