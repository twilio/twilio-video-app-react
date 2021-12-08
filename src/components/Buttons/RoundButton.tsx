import React, { ReactNode } from 'react';
import cn from 'classnames';
import ReactTooltip from 'react-tooltip';

export enum ROUND_BUTTON_SIZE {
  DEFAULT = 'w-12 h-12',
  SMALL = 'w-6 h-6',
  SEMI_SMALL = 'w-9 h-9',
  LARGE = 'w-16 h-16',
}

export enum ROUND_BUTTON_STYLE {
  DEFUALT = 'bg-white text-gray-800',
  ACTIVE = 'bg-purple text-white',
  APPROVE = 'bg-green text-white',
  DECILE = 'bg-red text-white',
}

interface IRoundButtonProps {
  indicator?: boolean;
  numberIndicator?: number;
  disabled?: boolean;
  size?: ROUND_BUTTON_SIZE;
  onClick?: () => void;
  children?: ReactNode;
  title: string;
  invisible?: boolean;

  active?: boolean;
  style?: ROUND_BUTTON_STYLE;
}

export const RoundButton = React.forwardRef<HTMLButtonElement, IRoundButtonProps>((props: IRoundButtonProps, ref?) => {
  const buttonClasses = cn(
    'rounded-full shadow-xl flex items-center justify-center relative transition-opacity duration-300',
    {
      'bg-white text-gray-800': !props.active && !props.style,
      'opacity-60': props.disabled,
      ...(props.size === undefined ? { [ROUND_BUTTON_SIZE.DEFAULT]: true } : { [props.size]: true }),
      'bg-purple text-white': props.active,
      ...(!props.active && props.style ? { [props.style]: true } : {}),
      'cursor-default': props.invisible,
    }
  );

  const containerClasses = cn('transition-opactiy duration-500', {
    'opacity-0': props.invisible,
    'opacity-100': !props.invisible,
  });

  const indicatorClasses = cn(
    'absolute rounded-full text-white flex justify-center items-center h-3 w-3 top-0 right-0  bg-red',
    {
      hidden: !props.indicator,
    }
  );
  const numberIndicatorClasses = cn(
    'absolute rounded-full text-white flex justify-center items-center h-6 w-6 -top-2 -right-2 bg-purple top-0',
    {
      hidden: props.numberIndicator === undefined,
    }
  );

  const id = 'round-button-' + Math.random();

  return (
    <span className={containerClasses}>
      <ReactTooltip id={id} place="top" effect="solid">
        {props.title}
      </ReactTooltip>
      <button
        onClick={props.onClick}
        className={buttonClasses}
        disabled={props.disabled}
        ref={ref}
        data-tip
        data-for={id}
      >
        <div className={numberIndicatorClasses}>{props.numberIndicator}</div>

        <span className={indicatorClasses}>
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-red"></span>
        </span>
        {props.children}
      </button>
    </span>
  );
});
