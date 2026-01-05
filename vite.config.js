import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const enableRtex = process.env.VITE_ENABLE_RTEX === 'true';
  const proxy = {
    '/api/latexonline': {
      target: 'https://latexonline.cc',
      changeOrigin: true,
      secure: true,
      rewrite: (path) => path.replace(/^\/api\/latexonline/, ''),
    },
  };
  if (enableRtex) {
    proxy['/api/rtex'] = {
      target: 'https://rtex.probably.rocks',
      changeOrigin: true,
      secure: true,
      rewrite: (path) => path.replace(/^\/api\/rtex/, ''),
    };
  }

  return {
    plugins: [react()],
    server: {
      proxy,
    },
  };
})
