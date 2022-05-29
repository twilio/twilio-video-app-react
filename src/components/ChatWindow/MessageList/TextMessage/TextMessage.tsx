import React from 'react';
import clsx from 'clsx';
import { Link } from '@material-ui/core';
import linkify from 'linkify-it';
import { makeStyles } from '@material-ui/core/styles';
import { isBannedText } from '../../../../utils/checkText';

const useStyles = makeStyles({
  messageContainer: {
    borderRadius: '16px',
    display: 'inline-flex',
    alignItems: 'center',
    padding: '0.5em 0.8em 0.6em',
    margin: '0.3em 0 0',
    wordBreak: 'break-word',
    backgroundColor: '#E1E3EA',
    hyphens: 'auto',
    whiteSpace: 'pre-wrap',
  },
  isLocalParticipant: {
    backgroundColor: '#CCE4FF',
  },
});

interface TextMessageProps {
  body: string;
  game?: boolean;
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

const loadJson = (body: string) => {
  let d = {
    message: '',
    game: false,
  };
  try {
    const data = JSON.parse(body);
    d = {
      message: data.message,
      game: true,
    };
  } catch (e) {
    d = {
      message: body,
      game: false,
    };
  }
  return d;
};
export default function TextMessage({ body, isLocalParticipant, game }: TextMessageProps) {
  const datas = loadJson(body);
  const classes = useStyles();
  return (
    <div>
      <div
        className={clsx(classes.messageContainer, {
          [classes.isLocalParticipant]: isLocalParticipant,
        })}
      >
        <div
          style={{
            color: isBannedText(datas.message) && datas.game ? 'red' : 'inherit',
          }}
        >
          {addLinks(datas.message)}
        </div>
      </div>
    </div>
  );
}
