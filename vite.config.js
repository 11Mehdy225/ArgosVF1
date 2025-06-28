import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import dotenv from 'dotenv';
dotenv.config();

// https://vite.dev/config/
export default defineConfig({

server:{
  proxy:{
    '/api' : {
      target : 'http://localhost:3000',
      changeOrigin : true,
    }
  }
},

  plugins: [react({ jsxRuntime: 'automatic' })],
  esbuild: {
    jsx: 'automatic',
  },
  define: {
    'process.env': process.env
  },
  resolve : {
    alias: [
      {
        find : '@',
        replacement : path.resolve(__dirname,'src')
      },
      {
        find : '@backend',
        replacement : path.resolve(__dirname,'/backend')
      },
      {
        find : '@ui',
        replacement : path.resolve(__dirname,'/src/ui')
      },
      {
        find : '@components',
        replacement : path.resolve(__dirname,'/src/components')
      },
      {
        find : '@pages',
        replacement : path.resolve(__dirname,'/src/pages')
      },
      {
        find : '@src',
        replacement : path.resolve(__dirname,'/src')
      }

    ]
  }
})
