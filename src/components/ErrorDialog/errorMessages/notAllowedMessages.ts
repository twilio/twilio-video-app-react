import React from 'react';
import { Typography, List, ListItem, ListItemText } from '@material-ui/core';
import { isMobile, mobileOperatingSystem } from '../../../utils/'

export default function notAllowedMessages() {
  let questions;
  let message = [<Typography component={'span'} key='error-description'>Debes permitirnos el acceso a tu cámara y micrófono desde el navegador.</Typography>]
  if (isMobile) {
    if (mobileOperatingSystem() === 'iOS') {
      questions = ['1. Refrescar la pagina', '2. Permitir cámara y micrófono'];
    } else if( mobileOperatingSystem() === 'Android') {
      questions = ['1. Click en el candado en la barra de direcciones', '2. Click en configuración de sitios', '3. Permitir cámara y micrófono', '4. Refrescar la pagina'];
    }
  } else {
    questions = ['1. Click en el candado en la barra de direcciones', '2. Permitir cámara y micrófono', '3. Refrescar la pagina'];
  }
  let list = questions.map((questionList, index) => <ListItemText key={"list-" + index }>{questionList}</ListItemText>)
  message.push(<List key='list'>{list}</List>)
  return message
}
