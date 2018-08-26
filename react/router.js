import React from "react"

import { Route, DefaultRoute, NotFoundRoute } from "react-router"
import { create, HistoryLocation } from "react-router"

import App from "./components/app.js"
var routes = <Route handler={App} />

export default create({
  routes: routes,
  location: HistoryLocation
})
