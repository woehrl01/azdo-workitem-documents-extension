import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import legacy from '@vitejs/plugin-legacy'

import { fileURLToPath } from 'url'
import path from 'path'
import fs from 'fs';


let enableHttps = false
if (fs.existsSync('/certs/localhost.key')) {
  enableHttps = true
}

// https://vitejs.dev/config/
export default defineConfig(({ _command, mode }) => {

  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [
      react(),
      legacy({
        targets: ['defaults', 'not IE 11']
      })
    ],
    base: '',
    define: {
      __DEV__: mode === 'development',
      __APP_INSIGHTS__: env.APP_INSIGHTS_KEY,
    },
    resolve: {
      alias: {
        'hooks': path.resolve(__dirname, 'src/hooks'),
        'services': path.resolve(__dirname, 'src/services'),
        'components': path.resolve(__dirname, 'src/components'),
      },
    },
    build: {
      rollupOptions: {
        input: {
          Settings: fileURLToPath(new URL('./Settings.html', import.meta.url)),
          FormPage: fileURLToPath(new URL('./FormPage.html', import.meta.url)),
          FormGroup: fileURLToPath(new URL('./FormGroup.html', import.meta.url)),
          AddDocumentDialog: fileURLToPath(new URL('./AddDocumentDialog.html', import.meta.url)),
        }
      }
    },
    server: {
      port: 8080,
      strictPort: true,
      https: enableHttps ? {
        key: fs.readFileSync('/certs/localhost.key'),
        cert: fs.readFileSync('/certs/localhost.pem'),
        requestCert: false,
      } : undefined,
    }
  }
})
