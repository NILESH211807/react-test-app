import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ThemeProvider } from 'next-themes'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { store } from './redux/store.ts'
import { Toaster } from "@/components/ui/sonner";

createRoot(document.getElementById('root')!).render(
    <ThemeProvider attribute='class' defaultTheme='dark'>
        <Provider store={store}>
            <BrowserRouter>
                <App />
                <Toaster />
            </BrowserRouter>
        </Provider>
    </ThemeProvider>
)
