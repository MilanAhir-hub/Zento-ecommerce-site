import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/authContext.tsx'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { GoogleOAuthProvider } from '@react-oauth/google'

const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(
   <BrowserRouter>
      <QueryClientProvider client={queryClient}>
         <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID || ""}>
            <AuthProvider>
               <App />
            </AuthProvider>
         </GoogleOAuthProvider>
      </QueryClientProvider>
   </BrowserRouter>
)
