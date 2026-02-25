import { NextRequest, NextResponse } from 'next/server';

const DEMO_MODE = !process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL === 'https://demo.supabase.co';

/** 데모 모드: 상황에 따라 다른 메시지를 반환 */
function getDemoMessages(situation: string) {
  const s = situation.toLowerCase();

  if (s.includes('생일') || s.includes('birthday')) {
    return [
      { tone: '정중한', content: '생일을 진심으로 축하드립니다. 늘 건강하시고, 하시는 모든 일이 꽃처럼 활짝 피어나시길 바랍니다.' },
      { tone: '친근한', content: '생일 축하해! 오늘은 네가 주인공이야. 맛있는 거 먹고 행복한 하루 보내!' },
      { tone: '유머러스한', content: '축하해! 나이는 숫자일 뿐이래. 근데 그 숫자가 좀 커진 건 맞지? 생일 축하!' },
    ];
  }

  if (s.includes('감사') || s.includes('고마') || s.includes('thank')) {
    return [
      { tone: '정중한', content: '항상 감사한 마음을 이 꽃에 담아 전합니다. 덕분에 매일이 따뜻합니다.' },
      { tone: '친근한', content: '고마운 마음을 꽃으로 보내봐. 말로 하기 쑥스러워서! 항상 고마워.' },
      { tone: '유머러스한', content: '말로 하면 오글거리니까 꽃으로 대신할게. 근데 진짜 고마워!' },
    ];
  }

  if (s.includes('사랑') || s.includes('연인') || s.includes('여자친구') || s.includes('남자친구') || s.includes('아내') || s.includes('남편')) {
    return [
      { tone: '정중한', content: '당신과 함께하는 모든 순간이 제겐 꽃같은 시간입니다. 사랑합니다.' },
      { tone: '친근한', content: '네가 웃으면 세상이 환해져. 이 꽃처럼 예쁜 너한테, 사랑해!' },
      { tone: '유머러스한', content: '꽃보다 네가 예쁘지만, 일단 꽃부터 보내볼게. 사랑해 많이!' },
    ];
  }

  if (s.includes('미안') || s.includes('잘못') || s.includes('sorry') || s.includes('화해')) {
    return [
      { tone: '정중한', content: '진심으로 죄송한 마음을 이 꽃과 함께 전합니다. 용서해주시겠어요?' },
      { tone: '친근한', content: '내가 잘못했어. 말로 하기엔 부족해서 꽃이라도 보낸다. 미안해, 진짜로.' },
      { tone: '유머러스한', content: '꽃으로 사과하면 좀 봐주는 거 아니야? 미안해... 제발?' },
    ];
  }

  if (s.includes('축하') || s.includes('승진') || s.includes('합격') || s.includes('개업') || s.includes('결혼')) {
    return [
      { tone: '정중한', content: '진심으로 축하드립니다. 앞으로도 좋은 일만 가득하시길 기원합니다.' },
      { tone: '친근한', content: '대박! 진짜 축하해! 네가 해낼 줄 알았어. 앞으로도 쭉쭉 잘 될 거야!' },
      { tone: '유머러스한', content: '축하해! 나도 언제 이렇게 되나 부럽다. 근데 진짜 멋있어!' },
    ];
  }

  if (s.includes('부모') || s.includes('엄마') || s.includes('아빠') || s.includes('어머니') || s.includes('아버지')) {
    return [
      { tone: '정중한', content: '항상 사랑으로 보살펴주셔서 감사합니다. 건강하시고, 늘 행복하세요.' },
      { tone: '친근한', content: '엄마(아빠), 항상 고마워. 말로 잘 못하지만 마음은 알지? 사랑해요!' },
      { tone: '유머러스한', content: '용돈 대신 꽃으로 보내드려요. 마음만은 백만원짜리입니다!' },
    ];
  }

  // 기본 메시지
  return [
    { tone: '정중한', content: '마음을 담아 꽃을 보냅니다. 언제나 행복하시길 바랍니다.' },
    { tone: '친근한', content: '괜히 꽃이나 보내봤어. 이유? 없어! 그냥 네 생각이 나서.' },
    { tone: '유머러스한', content: '꽃을 왜 보냈냐고? 그냥. 이유 같은 거 필요 없잖아!' },
  ];
}

export async function POST(request: NextRequest) {
  try {
    const { situation } = await request.json();

    if (!situation || typeof situation !== 'string') {
      return NextResponse.json({ error: '상황을 입력해주세요' }, { status: 400 });
    }

    // 데모 모드이거나 API 키가 없으면 상황별 데모 메시지 반환
    if (DEMO_MODE || !process.env.ANTHROPIC_API_KEY) {
      const messages = getDemoMessages(situation);
      return NextResponse.json({ messages });
    }

    const { generateText } = await import('ai');
    const { anthropic } = await import('@ai-sdk/anthropic');

    const { text } = await generateText({
      model: anthropic('claude-sonnet-4-20250514'),
      system: `당신은 한국의 꽃 배달 서비스 "꽃부름"의 카드 메시지 작성 도우미입니다.
사용자가 설명하는 상황에 맞는 꽃 카드 메시지를 3가지 톤으로 작성합니다.
각 메시지는 200자 이내로, 진심이 담긴 한국어로 작성하세요.
반드시 아래 JSON 형식으로만 답하세요. 다른 텍스트는 포함하지 마세요.

[{"tone":"정중한","content":"메시지"},{"tone":"친근한","content":"메시지"},{"tone":"유머러스한","content":"메시지"}]`,
      prompt: situation,
      maxTokens: 1000,
    });

    const messages = JSON.parse(text);
    return NextResponse.json({ messages });
  } catch (error) {
    console.error('AI message error:', error);
    return NextResponse.json(
      { error: '메시지 생성에 실패했어요' },
      { status: 500 }
    );
  }
}
