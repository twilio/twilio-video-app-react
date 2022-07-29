const urlParams = new URLSearchParams(window.location.search);
const ancOption = (urlParams.get('anc') || 'krisp').toLowerCase();

export function getANCKind() {
  if (ancOption === 'rnnoise') {
    return 'rnnoise';
  } else if (ancOption === 'none') {
    return 'none';
  } else {
    return 'krisp';
  }
}
