export default function removeLocationHash() {
  history.pushState(
    '',
    document.title,
    window.location.pathname + window.location.search
  )
}
