import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

const createAlias = (aliases: Record<string, string>) => {
    return Object.fromEntries(
        Object.entries(aliases).map(([key, value]) => [
            key,
            path.resolve(__dirname, value)
        ])
    )
}

export default defineConfig({
    plugins: [
      tailwindcss(),
      react()
    ],
    resolve: {
        alias: createAlias({
            '@': path.resolve(__dirname, 'src'),
            '@app': path.resolve(__dirname, 'src/app'),
            '@widgets': path.resolve(__dirname, 'src/widgets'),
            '@crm': path.resolve(__dirname, 'src/crm'),
            '@shared': path.resolve(__dirname, 'src/shared'),
            '@pages': path.resolve(__dirname, 'src/pages'),
            '@features': path.resolve(__dirname, 'src/features'),
            '@entities': path.resolve(__dirname, 'src/entities'),
        })
    },
    css: {
        modules: {
            scopeBehaviour: 'local',
            localsConvention: 'camelCaseOnly',
            hashPrefix: 'my-project',
            globalModulePaths: [],
        },
          preprocessorOptions: {
              scss: {
                  // Опции для sass-компилятора
                  quietDeps: true, // игнорировать предупреждения из зависимостей
              },
          }
    },
    server: {
        port: 3000,
        host: '0.0.0.0',
        open: true,
        proxy: {
            '/api': {
                target: 'http://localhost:5432',
                changeOrigin: true,
            },
        },
    },
});
