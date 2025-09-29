import type { PrismTheme } from 'prism-react-renderer';
import { themes as prismThemes } from 'prism-react-renderer';

const baseTheme = prismThemes.dracula;

const protoPrismTheme: PrismTheme = {
  plain: {
    ...baseTheme.plain,
    backgroundColor: 'var(--asynkron-code-surface)',
    color: 'var(--asynkron-code-foreground)',
  },
  styles: [
    ...baseTheme.styles.map((styleRule) => ({
      ...styleRule,
      types: [...styleRule.types],
      ...(styleRule.languages ? { languages: [...styleRule.languages] } : {}),
      style: {
        ...styleRule.style,
        ...(styleRule.types.includes('keyword')
          ? { color: 'var(--asynkron-code-keyword)', fontStyle: undefined }
          : {}),
        ...(styleRule.types.includes('string')
          ? { color: 'var(--asynkron-code-string)' }
          : {}),
        ...(styleRule.types.includes('comment')
          ? { color: 'var(--asynkron-code-comment)' }
          : {}),
      },
    })),
    {
      types: ['function'],
      style: { color: 'var(--asynkron-code-function)' },
    },
    {
      types: ['generic-method'],
      style: { color: 'var(--asynkron-code-function)' },
    },
  ],
};

export default protoPrismTheme;
