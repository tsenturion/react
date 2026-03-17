import {
  analyzeProjectFile,
  analyzeQualitySafety,
  analyzeRunMode,
  buildIndexHtmlPreview,
  buildPackagePreview,
  collectWorkspaceDiagnostics,
  runWorkspaceCommand,
  type WorkspaceConfig,
} from './learning-model';

const baseWorkspaceConfig: WorkspaceConfig = {
  nodeVersion: 24,
  hasLockfile: true,
  hasDevScript: true,
  hasBuildScript: true,
  hasPreviewScript: true,
  hasTestScript: true,
  hasLintScript: true,
  hasFormatScript: true,
  hasModuleType: true,
  hasReactDeps: true,
  hasViteDep: true,
  hasTypeScript: true,
  hasEntryHtml: true,
  rootIdMatches: true,
  hasEslintConfig: true,
  hasPrettierConfig: true,
};

describe('workspace diagnostics', () => {
  it('flags root mismatch as an error', () => {
    const diagnostics = collectWorkspaceDiagnostics({
      ...baseWorkspaceConfig,
      rootIdMatches: false,
    });

    expect(diagnostics.some((item) => item.title.includes('HTML-цепочка'))).toBe(true);
  });

  it('returns missing dev script error for dev command', () => {
    const result = runWorkspaceCommand(
      {
        ...baseWorkspaceConfig,
        hasDevScript: false,
      },
      'dev',
    );

    expect(result.status).toBe('error');
    expect(result.title).toContain('dev server');
  });

  it('keeps es-module entry visible in generated previews', () => {
    const packagePreview = buildPackagePreview(baseWorkspaceConfig);
    const htmlPreview = buildIndexHtmlPreview(baseWorkspaceConfig);

    expect(packagePreview).toContain('"type": "module"');
    expect(htmlPreview).toContain('type="module"');
  });
});

describe('project structure analysis', () => {
  it('maps main.tsx to HTML and App chain', () => {
    const analysis = analyzeProjectFile('main-tsx');

    expect(analysis.selected.path).toBe('src/main.tsx');
    expect(analysis.selected.chain).toContain('index.html');
    expect(analysis.related.some((item) => item.id === 'app-tsx')).toBe(true);
  });
});

describe('run mode analysis', () => {
  it('marks HMR expectation as unsupported for preview mode', () => {
    const analysis = analyzeRunMode('vite-preview', ['hmr']);

    expect(analysis.overall).toBe('error');
    expect(analysis.unsupported).toContain('hmr');
  });
});

describe('quality gates analysis', () => {
  it('lets TypeScript catch type mismatch before runtime', () => {
    const analysis = analyzeQualitySafety(['typescript'], 'type-mismatch');

    expect(analysis.overall).toBe('success');
    expect(analysis.caughtBy).toContain('TypeScript');
  });

  it('keeps logic regression unsafe without tests', () => {
    const analysis = analyzeQualitySafety([], 'logic-regression');

    expect(analysis.overall).toBe('error');
  });
});
