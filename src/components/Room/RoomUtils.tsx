import useParticipants from '../../hooks/useParticipants/useParticipants';

export function checkPatient() {
  const sp = new URLSearchParams(window.location.search);
  return sp.get('persona') === 'patient';
}

export function getThirdPartyURL(name: string) {
  const sp = new URLSearchParams(window.location.search);
  const personaReplace = `=${sp.get('persona')}`;
  const patientReplace = `=${sp.get('name')}`;
  const urlString = window.location.href;
  const passcode = window.sessionStorage.getItem('passcode');

  return urlString
    .replace(personaReplace, '=thirdparty')
    .replace(patientReplace, `=${name}`)
    .concat(`&passcode=${passcode}`);
}
