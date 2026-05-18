import './App.css'
import ToastProvider from './context/ToastProvider'
import AppRouter from './routes/AppRouter'

function App() {
  return (
    <ToastProvider>
      <AppRouter />
    </ToastProvider>
  )
}

export default App
