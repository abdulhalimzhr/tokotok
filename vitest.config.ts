import { defineVitestConfig } from '@nuxt/test-utils/config'

export default defineVitestConfig({
  test: {
    environment: 'nuxt',
    globals: true,
    include: ['**/tests/**/*.test.{js,ts}'],
    watch: false,
    exclude: [
      'node_modules',
      'dist',
      '.nuxt',
      '.output',
      'coverage',
      'tests/fixtures/**'
    ],
    environmentOptions: {
      nuxt: {
        rootDir: '.',
        domEnvironment: 'happy-dom'
      }
    }
  }
})
