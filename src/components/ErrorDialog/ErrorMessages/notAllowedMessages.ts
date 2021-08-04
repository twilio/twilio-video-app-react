import React from 'react';
import { Typography, List, ListItem, ListItemText } from '@material-ui/core';
import { isMobile, mobileOperatingSystem } from '../../../utils/'

export default function notAllowedMessages() {
  let steps;
  let message = []
  if (isMobile) {
    if (mobileOperatingSystem() === 'iOS') {
      steps = ['1. Refrescar la pagina', '2. Permitir cámara y micrófono'];
    } else if( mobileOperatingSystem() === 'Android') {
      steps = ['1. Click en el candado en la barra de direcciones', '2. Click en configuración de sitios', '3. Permitir cámara y micrófono', '4. Refrescar la pagina'];
    }
  } else {
    steps = ['1. Click en el candado en la barra de direcciones', '2. Permitir cámara y micrófono', '3. Refrescar la pagina'];
  }
  let list = steps.map((step, index) => <ListItemText key={"list-" + index }>{step}</ListItemText>)
  message.push(<List key='list'>{list}</List>)
  return message
}
