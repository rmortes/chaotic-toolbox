import { defineConfig } from 'vite'
import storylitePlugin from '@storylite/vite-plugin';
import { glob } from 'glob'
import dts from 'vite-plugin-dts'

export default defineConfig({
  plugins: [
    dts({ include: ['lib'] }),
    storylitePlugin({
      stories: 'stories/**/*.stories.tsx', // relative to process.cwd()
    }),
  ],
  build: {
    lib: {
      entry: glob.sync('lib/components/*/main.ts'),
      formats: ['es']
    },
    rollupOptions: {
      output: {
        entryFileNames(chunkInfo) {
          const path = chunkInfo.facadeModuleId;
          const name = path?.match(/(?<=components\/).*(?=\/main)/) || chunkInfo.name;
          return `${name}.js`
        },
      }
    }
  }
})