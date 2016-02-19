/*
Icons taken from blockbuilder repo, starting to question my design choices :)
*/
import React from 'react';

// For Homepage link
//https://raw.githubusercontent.com/iconic/open-iconic/master/svg/home.svg
class IconHome extends React.Component {
  render() {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 8 8">
        <path d="M4 0l-4 3h1v4h2v-2h2v2h2v-4.03l1 .03-4-3z" />
      </svg>
    )
  }
}
export { IconHome }

// For the Search page
//https://raw.githubusercontent.com/iconic/open-iconic/master/svg/magnifying-glass.svg
class IconSearch extends React.Component {
  render() {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 8 8">
        <path d="M3.5 0c-1.93 0-3.5 1.57-3.5 3.5s1.57 3.5 3.5 3.5c.59 0 1.17-.14 1.66-.41a1 1 0 0 0 .13.13l1 1a1.02 1.02 0 1 0 1.44-1.44l-1-1a1 1 0 0 0-.16-.13c.27-.49.44-1.06.44-1.66 0-1.93-1.57-3.5-3.5-3.5zm0 1c1.39 0 2.5 1.11 2.5 2.5 0 .66-.24 1.27-.66 1.72-.01.01-.02.02-.03.03a1 1 0 0 0-.13.13c-.44.4-1.04.63-1.69.63-1.39 0-2.5-1.11-2.5-2.5s1.11-2.5 2.5-2.5z"
        />
      </svg>
    )
  }
}
export { IconSearch }

class IconQuestion extends React.Component {
  render() {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 8 8">
        <path d="M2.47 0c-.85 0-1.48.26-1.88.66-.4.4-.54.9-.59 1.28l1 .13c.04-.25.12-.5.31-.69.19-.19.49-.38 1.16-.38.66 0 1.02.16 1.22.34.2.18.28.4.28.66 0 .83-.34 1.06-.84 1.5-.5.44-1.16 1.08-1.16 2.25v.25h1v-.25c0-.83.31-1.06.81-1.5.5-.44 1.19-1.08 1.19-2.25 0-.48-.17-1.02-.59-1.41-.43-.39-1.07-.59-1.91-.59zm-.5 7v1h1v-1h-1z"
        transform="translate(1)" />
      </svg>
    )
  }
}
export { IconQuestion }
