import { useState } from 'react'
import Main from'./component/main'
import './App.css'

function App() {

  return (
    <>
  {/*
    네비게이터 연결부분

    Main = 메인화면 11
    */}
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Main />} />
        </Routes>
      </BrowserRouter>
    </>

  )
}

export default App
