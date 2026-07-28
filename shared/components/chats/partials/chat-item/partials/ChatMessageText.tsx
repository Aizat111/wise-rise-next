import { CornerUpLeft } from 'lucide-react';
import React, { useMemo } from 'react';

const URL_REGEX = /https?:\/\/[^\s<>"{}|\\^`[\]]+/g;
// Format: [Re: @username: snippet] actual message
const REPLY_REGEX = /^\[Re: (@[^\]]+)\] ([\s\S]*)$/;

interface ChatMessageTextProps {
  text: string;
}

interface TextPart {
  type: 'text' | 'link';
  value: string;
}

function parseMessageParts(text: string): TextPart[] {
  const parts: TextPart[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  URL_REGEX.lastIndex = 0;

  while ((match = URL_REGEX.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push({ type: 'text', value: text.slice(lastIndex, match.index) });
    }
    parts.push({ type: 'link', value: match[0] });
    lastIndex = URL_REGEX.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push({ type: 'text', value: text.slice(lastIndex) });
  }

  return parts;
}

const ChatMessageText: React.FC<ChatMessageTextProps> = React.memo(({ text }) => {
  const replyMatch = REPLY_REGEX.exec(text);
  const replyRef = replyMatch ? replyMatch[1] : null; // e.g. "@username: snippet"
  const bodyText = replyMatch ? replyMatch[2] : text;

  const bodyParts = useMemo(() => parseMessageParts(bodyText), [bodyText]);

  const renderParts = (parts: TextPart[]) => {
    if (parts.length === 1 && parts[0].type === 'text') return <>{parts[0].value}</>;
    return (
      <>
        {parts.map((part, index) => {
          if (part.type === 'link') {
            return (
              <a
                key={`${part.value}-${index}`}
                href={part.value}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-500 underline hover:text-primary-400 transition-colors break-all [font-variant-ligatures:none]"
              >
                {part.value}
              </a>
            );
          }
          return <React.Fragment key={`text-${index}`}>{part.value}</React.Fragment>;
        })}
      </>
    );
  };

  if (replyRef) {
    return (
      <>
        <span className="flex items-center gap-1 mb-1 text-white30 text-xxs leading-tight">
          <CornerUpLeft className="w-2.5 h-2.5 shrink-0" />
          <span className="truncate">{replyRef}</span>
        </span>
        {bodyText && <span>{renderParts(bodyParts)}</span>}
      </>
    );
  }

  return renderParts(bodyParts);
});

ChatMessageText.displayName = 'ChatMessageText';

export default ChatMessageText;
