import { ToastProvider } from './components/ToastProvider'
import { ContactCard } from './pages/ContactCard'

export function App() {
  return (
    <ToastProvider>
      <ContactCard />
    </ToastProvider>
  )
}
