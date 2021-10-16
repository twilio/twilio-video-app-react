import React from 'react';

export const LoadingSpinner = () => {
  return (
    <div className="w-full h-screen flex justify-center items-center">
      <div
        style={{ borderTopColor: 'transparent' }}
        className="w-16 h-16 border-4 border-primary border-solid rounded-full animate-spin"
      />
    </div>
  );
};
