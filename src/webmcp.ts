type WebMcpTool = {
  name: string;
  description: string;
  inputSchema: Record<string, unknown>;
  execute: (input?: Record<string, unknown>) => unknown;
};

const profileSummary = {
  name: 'Samet CELIKBICAK',
  title: 'Team Lead | Principal Software Specialist',
  location: 'Izmir, Turkey',
  summary:
    'Software developer working in the software industry since 2007, focused on frontend development, Angular, TypeScript, JavaScript, HTML, CSS, React, and software leadership.',
  resources: {
    markdown: 'https://sametcelikbicak.com/index.md',
    llms: 'https://sametcelikbicak.com/llms.txt',
    apiCatalog: 'https://sametcelikbicak.com/.well-known/api-catalog',
  },
};

const projects = [
  {
    name: 'Enum2Array',
    description: 'A function to help convert enums to arrays.',
    url: 'https://www.npmjs.com/package/enum2array',
  },
  {
    name: 'TSCI CLI',
    description:
      'TypeScript CLI for creating HTML, CSS, and TypeScript projects with different bundlers.',
    url: 'https://www.npmjs.com/package/tsci',
  },
  {
    name: 'Storage Function',
    description:
      'A function to manipulate browser session storage and local storage.',
    url: 'https://www.npmjs.com/package/storage-function',
  },
  {
    name: 'Pomodoro',
    description:
      'A Pomodoro timer application for managing time with the Pomodoro Technique.',
    url: 'https://sametcelikbicak.github.io/pomodoro/',
  },
];

const tools: WebMcpTool[] = [
  {
    name: 'get_profile_summary',
    description:
      'Return a concise public profile summary for Samet CELIKBICAK.',
    inputSchema: {
      type: 'object',
      properties: {},
      additionalProperties: false,
    },
    execute: () => profileSummary,
  },
  {
    name: 'list_projects',
    description:
      'Return public portfolio project names, descriptions, and URLs.',
    inputSchema: {
      type: 'object',
      properties: {},
      additionalProperties: false,
    },
    execute: () => projects,
  },
  {
    name: 'navigate_section',
    description:
      'Navigate the current page to a public portfolio section by id.',
    inputSchema: {
      type: 'object',
      properties: {
        section: {
          type: 'string',
          enum: ['about', 'experience', 'education', 'projects'],
        },
      },
      required: ['section'],
      additionalProperties: false,
    },
    execute: (input = {}) => {
      const section = String(input.section || '');
      const target = document.getElementById(section);
      if (!target) {
        return { ok: false, error: `Unknown section: ${section}` };
      }
      target.scrollIntoView({ behavior: 'smooth' });
      return { ok: true, section };
    },
  },
];

export const registerWebMcpTools = () => {
  const modelContext = (
    navigator as Navigator & {
      modelContext?: {
        registerTool?: (
          tool: WebMcpTool,
          options?: { signal?: AbortSignal }
        ) => void;
        provideContext?: (
          context: { tools: WebMcpTool[] },
          options?: { signal?: AbortSignal }
        ) => void;
      };
    }
  ).modelContext;

  if (!modelContext) return;

  const controller = new AbortController();

  if (typeof modelContext.registerTool === 'function') {
    tools.forEach((tool) => {
      modelContext.registerTool?.(tool, { signal: controller.signal });
    });
  }

  if (typeof modelContext.provideContext === 'function') {
    modelContext.provideContext({ tools }, { signal: controller.signal });
  }

  window.addEventListener('beforeunload', () => controller.abort(), {
    once: true,
  });
};
