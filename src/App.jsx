import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { WagmiProvider } from 'wagmi'

import {QueryClient, QueryClientProvider } from '@tanstack/react-query'

import { projectId, metadata, networks, wagmiAdapter } from './config/config'
import { createAppKit } from '@reown/appkit'
import { OperateButtonList } from './component/operate'
import { Profile } from './component/profile'
import { MyERC20 } from './component/MyERC20'
import { MyERC721 } from './component/MyERC721'
import { NFTMarket } from './component/NFTMarket'

const queryClient = new QueryClient();

const generalConfig = {
  projectId,
  networks,
  metadata,
  themeMode: 'light',
}

createAppKit({
  adapters: [wagmiAdapter],
  ...generalConfig,
  features: {
    analytics: true
  },
})



function App() {
 
  // const [balance , setBalance] = useState('')


  // console.log('address', address)
  // console.log('isConnected', isConnected)
  // console.log('caipAddress', caipAddress)
  // console.log('status', status)
  // console.log('embeddedWalletInfo', embeddedWalletInfo)


  return (
    <div style={{background: 'white', minHeight: '100vh', width: '100vw'}}>
      <WagmiProvider config={wagmiAdapter.wagmiConfig}>
        <QueryClientProvider client={queryClient} >
          <div style={{marginLeft: '100px'}}>
            <appkit-button/>
            <OperateButtonList/>
          </div>
          <Profile/>
          <MyERC20/>
          <MyERC721/>
          <NFTMarket/>
 
        </QueryClientProvider>
      </WagmiProvider>
    </div>
  )
}


function Card() {
   const [count, setCount] = useState(0)
  return () => (
    <>
        <div>
          <a href="https://vite.dev" target="_blank">
            <img src={viteLogo} className="logo" alt="Vite logo" />
          </a>
          <a href="https://react.dev" target="_blank">
            <img src={reactLogo} className="logo react" alt="React logo" />
          </a>
        </div>
        <h1>Vite + React</h1>
        <div className="card">
          <button onClick={() => setCount((count) => count + 1)}>
            count is {count}
          </button>
          <p>
            Edit <code>src/App.jsx</code> and save to test HMR
          </p>
        </div>
        <p className="read-the-docs">
          Click on the Vite and React logos to learn more
        </p>
      </>
  )
}


export default App
