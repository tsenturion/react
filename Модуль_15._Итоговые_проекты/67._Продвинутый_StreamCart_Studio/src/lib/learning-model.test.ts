import { describe, expect, it } from 'vitest';

import { describeLabFromPath } from './learning-model';
import { selectWinningArchitecture } from './trajectory-model';

describe('learning model', () => {
  it('maps pathname to current lab', () => {
    expect(describeLabFromPath('/')).toBe('home');
    expect(describeLabFromPath('/catalog')).toBe('catalog');
    expect(describeLabFromPath('/product/aurora-shell-jacket')).toBe('catalog');
    expect(describeLabFromPath('/platform')).toBe('platform');
    expect(describeLabFromPath('/unknown')).toBe('home');
  });

  it('selects mixed full-stack architecture as winner', () => {
    expect(selectWinningArchitecture().id).toBe('mixed-fullstack');
  });
});
