import { useState } from 'react'
import reactLogo from './assets/react.svg'
import './App.css'
import CrudDashboard from './templates/crud-dashboard/CrudDashboard'
import Blog from './templates/blog/Blog'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Blog></Blog>
    </>
  )
}

export default App
