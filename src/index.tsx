import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App'
import reportWebVitals from './reportWebVitals'

/*
 ** **
 ** ** ** Create Root element
 ** **
 */
const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)

/*
 ** **
 ** ** ** Render App In Root Element
 ** **
 */
root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
)

/*
 ** **
 ** ** ** Run web Vitals
 ** **
 */
reportWebVitals()
