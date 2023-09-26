import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { router } from './routers/router.jsx'
import { Provider } from 'react-redux'

import {
  RouterProvider,
} from "react-router-dom";
import { store } from './stores/store.js'

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
)
