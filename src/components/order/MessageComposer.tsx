'use client';

import { useState } from 'react';
import { TextArea } from '@/components/ui/Input';
import Button from '@/components/ui/Button';

interface MessageComposerProps {
  value: string;
  onChange: (value: string) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function MessageComposer({ value, onChange, onNext, onBack }: MessageComposerProps) {
  const [showAI, setShowAI] = useState(false);
  const [situation, setSituation] = useState('');
  const [aiMessages, setAiMessages] = useState<{ tone: string; content: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [aiError, setAiError] = useState('');
  const [hasGenerated, setHasGenerated] = useState(false);

  const generateMessages = async () => {
    if (!situation.trim()) return;
    setLoading(true);
    setAiError('');
    setAiMessages([]); // 이전 결과 초기화
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ situation }),
      });
      if (!res.ok) throw new Error('서버 오류');
      const data = await res.json();
      if (data.messages && data.messages.length > 0) {
        setAiMessages(data.messages);
        setHasGenerated(true);
      } else {
        throw new Error('메시지 생성 실패');
      }
    } catch {
      setAiError('메시지 생성에 실패했어요. 다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectMessage = (content: string) => {
    onChange(content);
    setShowAI(false);
  };

  return (
    <div className="flex flex-col gap-6">
      <section>
        <h3 className="text-base font-semibold text-text-primary mb-1">카드 메시지</h3>
        <p className="text-sm text-text-tertiary mb-4">
          꽃과 함께 전할 메시지를 적어주세요
        </p>

        <TextArea
          placeholder="받는 분에게 전하고 싶은 말을 적어주세요..."
          rows={4}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          hint={`${value.length}/200`}
          maxLength={200}
        />
        <p className="text-xs text-text-tertiary mt-1">메시지를 비워두면 카드 없이 보내드려요</p>
      </section>

      {/* AI Section */}
      <section>
        {!showAI ? (
          <button
            type="button"
            onClick={() => setShowAI(true)}
            className="w-full py-3 px-4 rounded-xl border-2 border-dashed border-primary/30 text-primary text-sm font-medium hover:bg-blue-50 transition-colors flex items-center justify-center gap-2"
          >
            <span>✨</span>
            뭐라고 쓸지 모르겠다면? AI가 써줄게요
          </button>
        ) : (
          <div className="bg-blue-50/50 rounded-xl p-4 border border-primary/10">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span>✨</span>
                <h4 className="text-sm font-semibold text-primary">AI 메시지 추천</h4>
              </div>
              <button
                type="button"
                onClick={() => setShowAI(false)}
                className="text-text-tertiary hover:text-text-secondary p-1"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <TextArea
              placeholder="어떤 상황인지 알려주세요 (예: 여자친구 생일인데 깜빡했어요)"
              rows={2}
              value={situation}
              onChange={(e) => setSituation(e.target.value)}
            />
            <Button
              onClick={generateMessages}
              loading={loading}
              variant="primary"
              size="sm"
              fullWidth
              className="mt-3"
              disabled={!situation.trim() || loading}
            >
              {loading ? '메시지 만드는 중...' : hasGenerated ? '다시 추천받기' : '메시지 3개 추천받기'}
            </Button>

            {/* Error state */}
            {aiError && (
              <div className="mt-3 p-3 rounded-lg bg-red-50 border border-error/20">
                <p className="text-sm text-error">{aiError}</p>
                <button
                  type="button"
                  onClick={generateMessages}
                  className="mt-2 text-sm font-medium text-error underline underline-offset-2"
                >
                  다시 시도하기
                </button>
              </div>
            )}

            {aiMessages.length > 0 && (
              <div className="mt-4 flex flex-col gap-2">
                <p className="text-xs text-text-tertiary">마음에 드는 메시지를 선택하세요</p>
                {aiMessages.map((msg, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handleSelectMessage(msg.content)}
                    className="text-left p-3 rounded-lg border border-border bg-white hover:border-primary hover:bg-blue-50/30 transition-colors"
                  >
                    <span className="text-xs font-medium text-primary mb-1 block">
                      {msg.tone}
                    </span>
                    <p className="text-sm text-text-primary">{msg.content}</p>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </section>

      {/* Navigation */}
      <div className="flex gap-3 pt-2">
        <Button onClick={onBack} variant="secondary" size="lg" className="flex-1">
          이전
        </Button>
        <Button onClick={onNext} size="lg" className="flex-[2]">
          결제하기
        </Button>
      </div>
    </div>
  );
}
