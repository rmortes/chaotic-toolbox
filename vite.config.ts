import { defineConfig } from 'vite'
import { glob } from 'glob'
import dts from 'vite-plugin-dts'

export default defineConfig({
  plugins: [
    dts({ include: ['lib'] })
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