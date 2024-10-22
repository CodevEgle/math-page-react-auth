import React from 'react';
import { InlineMath, BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';

function parseContent(content) {
  // Reguliarus reiškinys matematinėms išraiškoms tarp $...$ arba $$...$$ atpažinti
  const regex = /\$\$(.+?)\$\$|\$(.+?)\$/g;
  const parts = [];
  let lastIndex = 0;

  let match;
  while ((match = regex.exec(content)) !== null) {
    // Pridėti tekstą prieš matematikos išraišką
    if (match.index > lastIndex) {
      parts.push({ type: 'text', content: content.slice(lastIndex, match.index) });
    }

    // Pridėti matematikos išraišką
    if (match[0].startsWith('$$')) {
      parts.push({ type: 'block-math', content: match[1] });
    } else {
      parts.push({ type: 'inline-math', content: match[2] });
    }

    lastIndex = regex.lastIndex;
  }

  // Pridėti likusį tekstą po paskutinės matematikos išraiškos
  if (lastIndex < content.length) {
    parts.push({ type: 'text', content: content.slice(lastIndex) });
  }

  return parts;
}

function MathContent({ content }) {
  const parsedContent = parseContent(content);

  return (
    <div>
      {parsedContent.map((part, index) => {
        if (part.type === 'text') {
          return <span key={index}>{part.content}</span>;
        } else if (part.type === 'inline-math') {
          return <InlineMath key={index}>{part.content}</InlineMath>;
        } else if (part.type === 'block-math') {
          return <BlockMath key={index}>{part.content}</BlockMath>;
        }
        return null;
      })}
    </div>
  );
}

export default MathContent;
