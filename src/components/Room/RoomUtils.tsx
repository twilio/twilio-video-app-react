import useParticipants from '../../hooks/useParticipants/useParticipants';

export function checkPatient() {
  const sp = new URLSearchParams(window.location.search);
  return sp.get('persona') === 'patient';
}
