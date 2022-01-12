import React from 'react';
import { Link } from '@material-ui/core';
import linkify from 'linkify-it';
import { makeStyles } from '@material-ui/core/styles';
import cn from 'classnames';

interface TextMessageProps {
  body: string;
  isLocalParticipant: boolean;
}

function addLinks(text: string) {
  const matches = linkify().match(text);
  if (!matches) return text;

  const results = [];
  let lastIndex = 0;

  matches.forEach((match, i) => {
    results.push(text.slice(lastIndex, match.index));
    results.push(
      <Link target="_blank" rel="noreferrer" href={match.url} key={i}>
        {match.text}
      </Link>
    );
    lastIndex = match.lastIndex;
  });

  results.push(text.slice(lastIndex, text.length));

  return results;
}

export default function TextMessage({ body, isLocalParticipant }: TextMessageProps) {
  return (
    <div className="pl-1">
      <div>{addLinks(body)}</div>
    </div>
  );
}
