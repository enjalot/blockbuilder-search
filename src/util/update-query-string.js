export default function updateQueryString(key, value) {
  const url = new URL(window.location)
  const params = new URLSearchParams(url.search)
  params.set(key, value)
  url.search = params.toString()
  history.pushState({}, '', url.toString())
}
