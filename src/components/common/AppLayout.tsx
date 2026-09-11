import { Outlet } from 'react-router-dom'
import Sidebar from '../Sidebar/Sidebar'
import Navbar from '../Navbar/Navbar'
import Footer from './Footer'

export default function AppLayout() {
  return (
    <div className="flex min-h-screen bg-surface-sunken">
      <Sidebar />
      <div className="flex-1 min-w-0 flex flex-col">
        <Navbar />
        <main className="app-main flex-1 w-full min-w-0 p-6">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  )
}