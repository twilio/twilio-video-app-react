import React, { SVGProps } from 'react';

export default function SwooshBackground(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="296" height="378" viewBox="0 0 296 378" {...props}>
      <defs>
        <linearGradient id="utbttnlrpc" x1="78.976%" x2="63.882%" y1="60.873%" y2="45.554%">
          <stop offset="0%" stopOpacity="0" />
          <stop offset="100%" />
        </linearGradient>
        <linearGradient id="aim8r3oczd" x1="78.976%" x2="63.882%" y1="56.106%" y2="47.503%">
          <stop offset="0%" stopOpacity="0" />
          <stop offset="100%" />
        </linearGradient>
        <path id="5tk4i6f80a" d="M0 0H296V378H0z" />
      </defs>
      <g fill="none" fillRule="evenodd">
        <mask id="m1ihwluuxb" fill="#fff">
          <use xlinkHref="#5tk4i6f80a" />
        </mask>
        <use fill="#DE5858" xlinkHref="#5tk4i6f80a" />
        <g mask="url(#m1ihwluuxb)">
          <g>
            <path
              fill="url(#utbttnlrpc)"
              d="M0 286.83c87.695-83.937 175.802-132.682 264.323-146.233 132.78-20.328 183.24 4.255 225.143-23.414 73.409-48.471 93.039-15.154 148.326-20.892 44.84-4.654 98.48-77.401 135.81-91.717C795.596-3.86 821.469.801 851.22 18.56L891 476.5H0V286.83z"
              opacity=".06"
              transform="translate(-457 -22.5)"
            />
            <path
              fill="url(#aim8r3oczd)"
              d="M137 604.5c63.759-109.686 155.8-165.124 276.126-166.315 180.488-1.786 157.888-146.686 387.11-146.33 229.223.356 170.665-151.786 341.36-166.888 113.797-10.068 180.265 10.685 199.404 62.26V604.5H137z"
              opacity=".08"
              transform="translate(-457 -22.5)"
            />
          </g>
        </g>
      </g>
    </svg>
  );
}
