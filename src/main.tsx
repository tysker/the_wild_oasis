import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import App from './App.tsx';
import { DarkModeProvider } from './context/DarkModeContext.tsx';
import ToasterAlert from './ui/ToasterAlert.tsx';
import GlobalStyles from './styles/GlobalStyles.ts';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // staleTime: 60 * 1000,
      staleTime: 0,
    },
  },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} />
      <GlobalStyles />
      <DarkModeProvider>
        <App />
      </DarkModeProvider>
      <ToasterAlert />
    </QueryClientProvider>
  </StrictMode>,
);
