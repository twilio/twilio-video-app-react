import useParticipants from '../../hooks/useParticipants/useParticipants';

export function checkPatient() {
  const sp = new URLSearchParams(window.location.search);
  return sp.get('persona') === 'patient';
}

export function getPatientName() {
  const sp = new URLSearchParams(window.location.search);
  return sp.get('name');
}

export function getThirdPartyURL(name: string) {
  const sp = new URLSearchParams(window.location.search);
  const room = `${sp.get('room')}`;
  const persona = 'thirdparty';
  const urlString = window.location.href;
  let urlPrefix = urlString.substr(0, urlString.indexOf('?'));
  const passcode = window.sessionStorage.getItem('passcode');

  const thirdPartyUrl = `${urlPrefix}?room=${encodeURIComponent(room)}&persona=${persona}&name=${encodeURIComponent(
    name
  )}&passcode=${passcode}`;
  console.log('URL', thirdPartyUrl);
  return thirdPartyUrl;
}
