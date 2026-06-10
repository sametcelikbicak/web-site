import '@testing-library/jest-dom';
import { registerWebMcpTools } from '@/webmcp';

describe('registerWebMcpTools', () => {
  beforeEach(() => {
    delete (navigator as Navigator & { modelContext?: unknown }).modelContext;
    document.body.innerHTML = '';
  });

  it('does nothing when window is undefined', () => {
    const origWindow = global.window;
    // @ts-expect-error - deleting window to simulate non-browser env
    delete global.window;
    expect(() => registerWebMcpTools()).not.toThrow();
    global.window = origWindow as Window & typeof globalThis;
  });

  it('does nothing when modelContext is not available', () => {
    registerWebMcpTools();
  });

  it('registers tools when modelContext.registerTool exists', () => {
    const registerTool = jest.fn();
    (navigator as Navigator & { modelContext?: unknown }).modelContext = {
      registerTool,
    };
    registerWebMcpTools();
    expect(registerTool).toHaveBeenCalled();
    expect(registerTool.mock.calls.length).toBeGreaterThanOrEqual(3);
  });

  it('provides context when modelContext.provideContext exists', () => {
    const provideContext = jest.fn();
    (navigator as Navigator & { modelContext?: unknown }).modelContext = {
      provideContext,
    };
    registerWebMcpTools();
    expect(provideContext).toHaveBeenCalledWith(
      expect.objectContaining({ tools: expect.any(Array) }),
      expect.any(Object)
    );
  });

  it('adds beforeunload listener when modelContext exists', () => {
    const addEventListenerSpy = jest.spyOn(window, 'addEventListener');
    const registerTool = jest.fn();
    (navigator as Navigator & { modelContext?: unknown }).modelContext = {
      registerTool,
    };
    registerWebMcpTools();
    expect(addEventListenerSpy).toHaveBeenCalledWith(
      'beforeunload',
      expect.any(Function),
      { once: true }
    );
    addEventListenerSpy.mockRestore();
  });

  it('aborts controller on beforeunload', () => {
    const abortSpy = jest.spyOn(AbortController.prototype, 'abort');
    const registerTool = jest.fn();
    (navigator as Navigator & { modelContext?: unknown }).modelContext = {
      registerTool,
    };
    registerWebMcpTools();
    window.dispatchEvent(new Event('beforeunload'));
    expect(abortSpy).toHaveBeenCalled();
    abortSpy.mockRestore();
  });

  it('registers all three tools', () => {
    const registerTool = jest.fn();
    (navigator as Navigator & { modelContext?: unknown }).modelContext = {
      registerTool,
    };
    registerWebMcpTools();
    const toolNames = registerTool.mock.calls.map(
      (call: unknown[]) => (call[0] as { name: string }).name
    );
    expect(toolNames).toContain('get_profile_summary');
    expect(toolNames).toContain('list_projects');
    expect(toolNames).toContain('navigate_section');
  });

  describe('tool execute functions', () => {
    let capturedTools: {
      name: string;
      execute: (...args: unknown[]) => unknown;
    }[] = [];

    const findTool = (name: string) => {
      const tool = capturedTools.find((t) => t.name === name);
      if (!tool) throw new Error(`Tool ${name} not found`);
      return tool;
    };

    beforeEach(() => {
      capturedTools = [];
      const registerTool = jest.fn(
        (tool: { name: string; execute: (...args: unknown[]) => unknown }) => {
          capturedTools.push(tool);
        }
      );
      (navigator as Navigator & { modelContext?: unknown }).modelContext = {
        registerTool,
      };
      registerWebMcpTools();
    });

    it('get_profile_summary returns profile data', () => {
      const result = findTool('get_profile_summary').execute();
      expect(result).toMatchObject({
        name: 'Samet CELIKBICAK',
        title: expect.stringContaining('Principal'),
      });
    });

    it('list_projects returns project list', () => {
      const result = findTool('list_projects').execute() as Array<{
        name: string;
      }>;
      expect(result).toHaveLength(4);
      expect(result[0].name).toBe('Enum2Array');
    });

    it('navigate_section returns ok for valid section', () => {
      document.body.innerHTML = '<div id="about"></div>';
      const scrollIntoViewMock = jest.fn();
      Element.prototype.scrollIntoView = scrollIntoViewMock;

      const result = findTool('navigate_section').execute({
        section: 'about',
      }) as {
        ok: boolean;
        section: string;
      };
      expect(result.ok).toBe(true);
      expect(result.section).toBe('about');
      expect(scrollIntoViewMock).toHaveBeenCalledWith({
        behavior: 'smooth',
      });
    });

    it('navigate_section returns error for unknown section', () => {
      document.body.innerHTML = '<div id="about"></div>';
      const result = findTool('navigate_section').execute({
        section: 'invalid',
      }) as {
        ok: boolean;
        error: string;
      };
      expect(result.ok).toBe(false);
      expect(result.error).toContain('Unknown section');
    });

    it('navigate_section handles missing input', () => {
      const result = findTool('navigate_section').execute() as {
        ok: boolean;
        error: string;
      };
      expect(result.ok).toBe(false);
      expect(result.error).toContain('Unknown section');
    });
  });
});
