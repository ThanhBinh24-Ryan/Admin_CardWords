// import React from 'react';
// import ReactDOM from 'react-dom/client'; // Correct import for createRoot
// import App from './App';
// import "./index.css"; // file Tailwind chính
// import "flowbite/dist/flowbite.min.css"; 
// import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
// ReactDOM.createRoot(document.getElementById('root')!).render(
//   <React.StrictMode>
    
//     <App />
//   </React.StrictMode>
// );
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import "./index.css";
import "flowbite/dist/flowbite.min.css"; 
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </React.StrictMode>
);