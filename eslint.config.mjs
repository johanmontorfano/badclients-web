import { FlatCompat } from '@eslint/eslintrc'
 
const compat = new FlatCompat({
    baseDirectory: import.meta.dirname,
});
 
const eslintConfig = [
    ...compat.config({
        extends: ['next/core-web-vitals', 'next/typescript'],
        rules: {
            "@typescript-eslint/no-explicit-any": "off",
            "react/no-unescaped-entities": "off"
        }
    })
]
 
export default eslintConfig;
