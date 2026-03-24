import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

import { resetRenderCountStore } from './src/hooks/useRenderCount';

afterEach(() => {
  cleanup();
  resetRenderCountStore();
});
