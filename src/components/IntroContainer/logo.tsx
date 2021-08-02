import React from 'react';
import logoImage from '../../../../../../assets/images/logos/mid_blue_logo.png'

export default function Logo(props) {
  return (
    <div className={props.className}>
      <img src={logoImage} alt="tranquilamente | psicólogos en línea" height={65} width={65} />
    </div>
  );
}
