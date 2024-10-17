import { useState } from 'react'
import reactLogo from './assets/react.svg'
import gce from './assets/gce.svg'
import ngrok from './assets/ngrok-white.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <a href="https://cloud.google.com/products/compute?hl=en" target="_blank">
          <img src={gce} className="logo" alt="gce logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" style={{ width: '80px' }} alt="React logo" />
        </a>
        <a href="https://cloud.google.com/products/compute?hl=en" target="_blank">
          <img src={ngrok} className="logo" alt="gce logo" />
        </a>
      </div>
      <h1>GCE + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
      </div>
      <p className="read-the-docs">
        Created In Order To Learn GCP Deployments.
      </p>
      <p className="read-the-docs">
        made with ❤ <a target='_blank' href="https://github.com/moshdev2213">@moshdev2213</a>
      </p>
    </>
  )
}

export default App
