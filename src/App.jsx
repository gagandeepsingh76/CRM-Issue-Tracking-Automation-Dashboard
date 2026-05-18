import ToastProvider from './context/ToastProvider'
import ThemeProvider from './context/ThemeProvider'
import AppRouter from './routes/AppRouter'

function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AppRouter />
      </ToastProvider>
    </ThemeProvider>
  )
}

export default App
