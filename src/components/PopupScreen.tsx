import React from 'react';
import { ReactNode } from 'react';

export const PopupScreen = (props: { children: ReactNode }) => (
  <div className="bg-grayish flex items-center justify-center h-screen w-screen">
    <div className="p-20 bg-white shadow-xl lex flex flex-col justify-center items-center text-lg space-y-10 rounded-lg">
      <img
        className="w-72"
        src="https://images.squarespace-cdn.com/content/5f22903d49055f4257ab4f36/1600414044617-D9WYCVH8LODE8VC6MPMD/Logo_Demokratie_Plattform.png?format=1500w&content-type=image%2Fpng"
      />
      <h1 className="font-semibold text-xl">DemokraTisch</h1>
      {props.children}
    </div>
  </div>
);
