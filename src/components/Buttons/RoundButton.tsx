import React, { ReactNode } from 'react';
import cn from 'classnames';

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
  disabled?: boolean;
  size?: ROUND_BUTTON_SIZE;
  onClick?: () => void;
  children?: ReactNode;

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
    }
  );

  const indicatorClasses = cn('absolute top-0 right-0 h-3 w-3 bg-red rounded-full', {
    hidden: !props.indicator,
  });

  return (
    <button onClick={props.onClick} className={buttonClasses} disabled={props.disabled} ref={ref}>
      <div className={indicatorClasses} />
      {props.children}
    </button>
  );
});
