export interface Frontmatter {
  data: Record<string, string | string[]>;
  content: string;
}

const parseYaml = (yamlBlock: string): Record<string, string | string[]> => {
  const data: Record<string, string | string[]> = {};
  const lines = yamlBlock.split(/[\r\n]+/);

  for (const line of lines) {
    const colonIndex = line.indexOf(':');
    if (colonIndex === -1) continue;

    const key = line.slice(0, colonIndex).trim();
    if (!key) continue;

    let value = line.slice(colonIndex + 1).trim();

    if (
      (value.startsWith('"') && value.endsWith('"') && value.length > 1) ||
      (value.startsWith("'") && value.endsWith("'") && value.length > 1)
    ) {
      value = value.slice(1, -1);
    }

    // Inline array, e.g. tags: ["TypeScript", "React"]
    if (value.startsWith('[') && value.endsWith(']')) {
      data[key] = value
        .slice(1, -1)
        .split(',')
        .map((entry) => entry.trim().replace(/^['"]|['"]$/g, ''))
        .filter((entry) => entry !== '');
    } else {
      data[key] = value;
    }
  }

  return data;
};

/**
 * Frontmatter parser, kept free of any Vite or filesystem dependency.
 *
 * It lived inside services/blog.ts, which opens with import.meta.glob. Jest
 * cannot transform that, so blog.ts was unimportable from tests and the test
 * suite mocked the module and then asserted the mock was a function. Splitting
 * the parsing out is what makes it testable at all.
 */
export const parseFrontmatter = (fileContent: string): Frontmatter => {
  const parts = fileContent.split('---');

  if (parts.length >= 3 && fileContent.trim().startsWith('---')) {
    return {
      data: parseYaml(parts[1]),
      content: parts.slice(2).join('---').trim(),
    };
  }

  return { data: {}, content: fileContent };
};
