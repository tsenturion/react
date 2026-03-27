export type CheckoutIntent = 'save-cart' | 'apply-coupon' | 'place-order';
export type CheckoutField = 'email' | 'shippingAddress' | 'couponCode' | 'paymentMethod';
export type FieldErrors = Partial<Record<CheckoutField, string>>;

export type CheckoutPayload = {
  email: string;
  shippingAddress: string;
  couponCode: string;
  paymentMethod: string;
  intent: CheckoutIntent;
};

export type CheckoutResult = {
  ok: boolean;
  status: 'idle' | 'saved' | 'coupon-applied' | 'placed' | 'error';
  headline: string;
  message: string;
  fieldErrors: FieldErrors;
  auditTrail: string[];
  orderNumber: string | null;
};

function wait(delayMs: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, delayMs);
  });
}

export function validateCheckoutPayload(payload: CheckoutPayload): FieldErrors {
  const errors: FieldErrors = {};

  if (!payload.email.includes('@')) {
    errors.email = 'Укажите корректный email для подтверждения и получения чека.';
  }

  if (payload.shippingAddress.trim().length < 10) {
    errors.shippingAddress = 'Адрес доставки должен быть достаточно полным.';
  }

  if (payload.intent === 'apply-coupon' && payload.couponCode.trim().length < 4) {
    errors.couponCode = 'Купон должен содержать минимум 4 символа.';
  }

  if (payload.intent === 'place-order' && payload.paymentMethod.trim().length < 3) {
    errors.paymentMethod = 'Для размещения заказа нужно указать способ оплаты.';
  }

  return errors;
}

export async function saveCartOnServer(
  payload: CheckoutPayload,
): Promise<CheckoutResult> {
  'use server';

  await wait(120);
  const fieldErrors = validateCheckoutPayload(payload);

  if (Object.keys(fieldErrors).length > 0) {
    return {
      ok: false,
      status: 'error',
      headline: 'Корзина не сохранена',
      message:
        'Серверное действие остановилось на валидации и не сохранило черновик оформления.',
      fieldErrors,
      auditTrail: [
        'Форма отправлена',
        'Проверены поля',
        'Сохранение корзины остановлено',
      ],
      orderNumber: null,
    };
  }

  return {
    ok: true,
    status: 'saved',
    headline: 'Черновик оформления сохранён',
    message:
      'Серверная функция сохранила черновик без отдельного обработчика маршрута и лишней сериализации.',
    fieldErrors: {},
    auditTrail: ['Форма отправлена', 'Проверены поля', 'Черновик оформления сохранён'],
    orderNumber: null,
  };
}

export async function applyCouponOnServer(
  payload: CheckoutPayload,
): Promise<CheckoutResult> {
  'use server';

  await wait(180);
  const fieldErrors = validateCheckoutPayload(payload);

  if (Object.keys(fieldErrors).length > 0) {
    return {
      ok: false,
      status: 'error',
      headline: 'Купон не применён',
      message: 'Сервер не принял купон, потому что форма не прошла проверку.',
      fieldErrors,
      auditTrail: ['Форма отправлена', 'Проверен купон', 'Изменение заказа отклонено'],
      orderNumber: null,
    };
  }

  return {
    ok: true,
    status: 'coupon-applied',
    headline: 'Промокод применён',
    message:
      'Скидка рассчитана на сервере, чтобы правила и антифрод-проверки не дублировались в браузере.',
    fieldErrors: {},
    auditTrail: ['Форма отправлена', 'Проверен купон', 'Сумма заказа пересчитана'],
    orderNumber: null,
  };
}

export async function placeOrderOnServer(
  payload: CheckoutPayload,
): Promise<CheckoutResult> {
  'use server';

  await wait(220);
  const fieldErrors = validateCheckoutPayload(payload);

  if (Object.keys(fieldErrors).length > 0) {
    return {
      ok: false,
      status: 'error',
      headline: 'Заказ не размещён',
      message:
        'Сервер не оформил заказ, потому что данные оформления заполнены не полностью.',
      fieldErrors,
      auditTrail: [
        'Форма отправлена',
        'Проверены данные заказа',
        'Оформление остановлено',
      ],
      orderNumber: null,
    };
  }

  return {
    ok: true,
    status: 'placed',
    headline: 'Заказ оформлен',
    message:
      'Отправка формы, проверка правил и фиксация заказа прошли в одном серверном действии.',
    fieldErrors: {},
    auditTrail: [
      'Форма отправлена',
      'Проверены данные заказа',
      'Товары зарезервированы',
      'Заказ и платёжное намерение сохранены',
    ],
    orderNumber: `SC-${payload.email.length}${payload.shippingAddress.length}${payload.paymentMethod.length}`,
  };
}

export async function invokeCheckoutAction(
  payload: CheckoutPayload,
): Promise<CheckoutResult> {
  if (payload.intent === 'apply-coupon') {
    return applyCouponOnServer(payload);
  }

  if (payload.intent === 'place-order') {
    return placeOrderOnServer(payload);
  }

  return saveCartOnServer(payload);
}
