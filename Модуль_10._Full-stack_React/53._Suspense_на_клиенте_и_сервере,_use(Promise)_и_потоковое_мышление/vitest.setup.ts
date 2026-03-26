import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

import { resetSuspenseResourceStore } from './src/lib/suspense-resource-store';

afterEach(() => {
  cleanup();
  resetSuspenseResourceStore();
  performance.clearMarks?.();
  performance.clearMeasures?.();
});
