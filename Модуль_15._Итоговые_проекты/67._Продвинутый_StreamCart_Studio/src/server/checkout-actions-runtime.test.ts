import { describe, expect, it } from 'vitest';

import {
  invokeCheckoutAction,
  validateCheckoutPayload,
} from './checkout-actions-runtime';

describe('checkout actions runtime', () => {
  it('validates checkout payload', () => {
    const errors = validateCheckoutPayload({
      email: 'broken-email',
      shippingAddress: 'short',
      couponCode: 'x',
      paymentMethod: '',
      intent: 'place-order',
    });

    expect(errors.email).toBeTruthy();
    expect(errors.shippingAddress).toBeTruthy();
    expect(errors.paymentMethod).toBeTruthy();
  });

  it('places order on valid payload', async () => {
    const result = await invokeCheckoutAction({
      email: 'hello@streamcart.dev',
      shippingAddress: 'Nevsky Avenue 18, Saint Petersburg',
      couponCode: 'SAVE20',
      paymentMethod: 'card',
      intent: 'place-order',
    });

    expect(result.ok).toBe(true);
    expect(result.status).toBe('placed');
    expect(result.orderNumber).toContain('SC-');
  });
});
