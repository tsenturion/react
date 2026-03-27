import {
  invokeCheckoutAction,
  type CheckoutField,
  type CheckoutIntent,
  type CheckoutPayload,
  type FieldErrors,
} from '../server/checkout-actions-runtime';

export type CheckoutFormState = {
  status: 'idle' | 'saved' | 'coupon-applied' | 'placed' | 'error';
  lastIntent: CheckoutIntent;
  headline: string;
  message: string;
  fieldErrors: FieldErrors;
  auditTrail: string[];
  orderNumber: string | null;
};

export const initialCheckoutFormState: CheckoutFormState = {
  status: 'idle',
  lastIntent: 'save-cart',
  headline: 'Оформление ждёт отправки',
  message:
    'Выберите действие: сохранить корзину, применить промокод или оформить заказ. После отправки здесь появится ответ сервера.',
  fieldErrors: {},
  auditTrail: [],
  orderNumber: null,
};

export function parseCheckoutFormData(formData: FormData): CheckoutPayload {
  const intent = (formData.get('intent')?.toString() ?? 'save-cart') as CheckoutIntent;

  return {
    email: formData.get('email')?.toString() ?? '',
    shippingAddress: formData.get('shippingAddress')?.toString() ?? '',
    couponCode: formData.get('couponCode')?.toString() ?? '',
    paymentMethod: formData.get('paymentMethod')?.toString() ?? '',
    intent: intent === 'apply-coupon' || intent === 'place-order' ? intent : 'save-cart',
  };
}

export async function submitCheckoutMutation(
  previousState: CheckoutFormState,
  formData: FormData,
): Promise<CheckoutFormState> {
  const payload = parseCheckoutFormData(formData);
  const result = await invokeCheckoutAction(payload);

  return {
    status: result.ok ? result.status : 'error',
    lastIntent: payload.intent,
    headline: result.headline,
    message: result.message,
    fieldErrors: result.fieldErrors,
    auditTrail: result.auditTrail,
    orderNumber: result.orderNumber ?? previousState.orderNumber,
  };
}

export const checkoutFieldLabels: Record<CheckoutField, string> = {
  email: 'Email',
  shippingAddress: 'Адрес доставки',
  couponCode: 'Промокод',
  paymentMethod: 'Способ оплаты',
};
