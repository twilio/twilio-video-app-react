import React from 'react';
import { ReactNode } from 'react';

export const PopupScreen = (props: { children: ReactNode }) => (
  <div className="bg-grayish flex items-center justify-center h-screen w-screen">
    <div className="p-20 bg-white shadow-xl lex flex flex-col justify-center items-center text-lg space-y-10 rounded-lg">
      <img className="w-72 h-auto" alt="DemokraTisch Logo" src="/assets/demokratisch.png" />
      {props.children}
    </div>
  </div>
);
