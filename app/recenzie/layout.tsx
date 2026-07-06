import '../(app)/globals.css'
import PasswordGate from './PasswordGate'

export default function RecenzieLayout({ children }: { children: React.ReactNode }) {
  return <PasswordGate>{children}</PasswordGate>
}
