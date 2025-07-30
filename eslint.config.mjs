// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs';

export default withNuxt([
  ...[
    require.resolve('eslint-plugin-vue/lib/configs/base'),
    require.resolve('eslint-plugin-prettier/recommended'),
    require.resolve(
      'eslint-plugin-vue/lib/configs/vue3-strongly-recommended'
    ),
    require.resolve('@nuxtjs/eslint-config-typescript')
  ].map(require),
  {
    parser: 'vue-eslint-parser',
    parserOptions: {
      parser: '@typescript-eslint/parser',
      ecmaVersion: 2020,
      sourceType: 'module'
    },
    rules: {
      quotes: [
        2,
        'single',
        { avoidEscape: false, allowTemplateLiterals: true }
      ],
      'prettier/prettier': 'off',
      '@typescript-eslint/camelcase': 'off',
      'arrow-parens': 'off',
      camelcase: 'off',
      'import/no-named-as-default': 'off',
      'no-console': ['error', { allow: ['error'] }],
      'space-before-function-paren': 'off',
      'vue/html-self-closing': 'off',
      'vue/multi-word-component-names': 'off',
      'vue/no-multiple-template-root': 'off',
      'vue/no-unused-vars': 'off',
      'vue/no-v-html': 'off',
      'vue/singleline-html-element-content-newline': 'off',
      'vue/max-attributes-per-line': 'off',
      'vue/html-closing-bracket-newline': 'off',
      '@typescript-eslint/naming-convention': [
        'error',
        {
          selector: 'default',
          format: ['camelCase', 'PascalCase', 'snake_case'],
          leadingUnderscore: 'allow',
          filter: {
            regex: '^_[a-z][a-zA-Z0-9]*$',
            match: true
          }
        },
        {
          selector: 'variable',
          format: ['camelCase', 'UPPER_CASE', 'PascalCase'],
          leadingUnderscore: 'allow'
        },
        {
          selector: 'typeLike',
          format: ['PascalCase', 'UPPER_CASE']
        },
        {
          selector: 'property',
          format: null
        },
        {
          selector: 'enumMember',
          format: ['PascalCase', 'UPPER_CASE']
        }
      ],
      'vue/html-indent': 'off',
      'vue/require-default-prop': 'off',
      'vue/first-attribute-linebreak': 'off',
      'vue/v-on-style': 'off',
      'vue/v-bind-style': 'off',
      'func-call-spacing': 'off',
      indent: 'off',
      'no-unexpected-multiline': 'off',
      'no-unneeded-ternary': 'off'
    }
  }
]);
