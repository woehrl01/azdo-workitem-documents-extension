import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import legacy from '@vitejs/plugin-legacy'
import { visualizer } from 'rollup-plugin-visualizer';

import { fileURLToPath } from 'url'
import * as path from 'path'
import * as fs from 'fs';


let enableHttps = false
if (fs.existsSync('/certs/localhost.key')) {
  enableHttps = true
}

export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    plugins: [
      react(),
      visualizer(),
      legacy({
        targets: ['defaults', 'not IE 11']
      })
    ],
    base: command === 'serve' ? '/dist/' : '',
    define: {
      __DEV__: mode === 'development',
      __APP_INSIGHTS__: JSON.stringify(env.APP_INSIGHTS_KEY),
    },
    esbuild: {
      drop: ['console', 'debugger'],
    },
    resolve: {
      alias: {
        'hooks': path.resolve(__dirname, 'src/hooks'),
        'services': path.resolve(__dirname, 'src/services'),
        'components': path.resolve(__dirname, 'src/components'),
        'test': path.resolve(__dirname, 'src/test'),
      },
    },
    css: {
      modules: {
        localsConvention: 'camelCaseOnly',
      }
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
    },
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: './src/test/setup.ts',
      deps: {
        inline: [
          'azure-devops-ui',
        ]
      },
    },
  }
})