import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()]
 
});
//  server: {
//     port: 4001 // 👈 Change this to whatever port you want
//   }