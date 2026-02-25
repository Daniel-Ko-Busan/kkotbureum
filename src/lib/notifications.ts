interface SendSMSParams {
  to: string;
  content: string;
}

export async function sendSMS({ to, content }: SendSMSParams): Promise<{
  success: boolean;
  error?: string;
}> {
  // Demo mode: console log and return success
  const isDemoMode = !process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL === 'https://demo.supabase.co';
  if (isDemoMode) {
    console.log(`[DEMO SMS] To: ${to}\n${content}`);
    return { success: true };
  }

  // Aligo SMS API
  const apiKey = process.env.ALIGO_API_KEY;
  const userId = process.env.ALIGO_USER_ID;
  const sender = process.env.ALIGO_SENDER_PHONE;

  if (!apiKey || !userId || !sender) {
    console.warn('SMS credentials not configured, skipping SMS');
    return { success: false, error: 'SMS not configured' };
  }

  try {
    const formData = new URLSearchParams();
    formData.append('key', apiKey);
    formData.append('user_id', userId);
    formData.append('sender', sender);
    formData.append('receiver', to.replace(/-/g, ''));
    formData.append('msg', content);

    // 90바이트 초과 시 LMS로 전송
    const byteLength = new TextEncoder().encode(content).length;
    if (byteLength > 90) {
      formData.append('msg_type', 'LMS');
      formData.append('title', '꽃부름');
    }

    const response = await fetch('https://apis.aligo.in/send/', {
      method: 'POST',
      body: formData,
    });

    const result = await response.json();

    if (result.result_code === '1') {
      return { success: true };
    }

    return { success: false, error: result.message };
  } catch (error) {
    console.error('SMS send failed:', error);
    return { success: false, error: 'SMS send failed' };
  }
}

// ── SMS 메시지 템플릿 ──

interface OrderInfo {
  orderNumber: string;
  recipientName: string;
  productName: string;
}

export function getOrderConfirmationMessage({ orderNumber, recipientName, productName }: OrderInfo): string {
  return `[꽃부름] 주문이 접수됐어요.

주문번호: ${orderNumber}
상품: ${productName}
받는 분: ${recipientName}

플로리스트가 곧 준비 시작해요.`;
}

export function getPreparingMessage({ orderNumber, recipientName }: Pick<OrderInfo, 'orderNumber' | 'recipientName'>): string {
  return `[꽃부름] 꽃 준비가 시작됐어요.

주문번호: ${orderNumber}
받는 분: ${recipientName}

조금만 기다려주세요.`;
}

export function getDeliveryStartMessage({ orderNumber, recipientName }: Pick<OrderInfo, 'orderNumber' | 'recipientName'>): string {
  return `[꽃부름] 꽃이 출발했어요.

주문번호: ${orderNumber}
받는 분: ${recipientName}

곧 도착합니다.`;
}

export function getDeliveryCompleteMessage({ orderNumber, recipientName }: Pick<OrderInfo, 'orderNumber' | 'recipientName'>): string {
  return `[꽃부름] 꽃이 전달됐어요.

주문번호: ${orderNumber}
받는 분: ${recipientName}

좋아할 거예요.`;
}

export function getCancelledMessage({ orderNumber }: Pick<OrderInfo, 'orderNumber'>): string {
  return `[꽃부름] 주문이 취소되었어요.

주문번호: ${orderNumber}

결제하신 금액은 영업일 기준 2~3일 내 환불됩니다.
문의: 꽃부름`;
}

// 상태에 따른 SMS 템플릿 선택
export function getMessageForStatus(
  status: string,
  orderInfo: OrderInfo
): { content: string; template: string } | null {
  switch (status) {
    case 'confirmed':
      return {
        content: getOrderConfirmationMessage(orderInfo),
        template: 'order_confirmed',
      };
    case 'preparing':
      return {
        content: getPreparingMessage(orderInfo),
        template: 'preparing',
      };
    case 'delivering':
      return {
        content: getDeliveryStartMessage(orderInfo),
        template: 'delivery_start',
      };
    case 'delivered':
      return {
        content: getDeliveryCompleteMessage(orderInfo),
        template: 'delivery_complete',
      };
    case 'cancelled':
      return {
        content: getCancelledMessage(orderInfo),
        template: 'order_cancelled',
      };
    default:
      return null;
  }
}
