export default function redirectRootPath() {
  if (window.location.pathname.includes('appointment')){
    return window.location.href = window.location.href.replace('/room', '')
  } else if (window.location.pathname === '/room/test') {
    return window.location.href = '/'
  }
}
