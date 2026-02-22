import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/authContext.tsx'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(
   <BrowserRouter>
      <QueryClientProvider client={queryClient}>
         <AuthProvider>
            <App />
         </AuthProvider>
      </QueryClientProvider>
   </BrowserRouter>
)
