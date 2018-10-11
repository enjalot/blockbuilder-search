export default function removeLocationHash() {
  // eslint-disable-next-line no-restricted-globals
  history.pushState(
    '',
    document.title,
    window.location.pathname + window.location.search
  )
}
