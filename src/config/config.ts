import { AppKit } from '@reown/appkit'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { AppKitNetwork } from '@reown/appkit/networks'
import { url } from 'inspector'
import { describe } from 'node:test'
import  {createConfig, http } from 'wagmi'
import { arbitrum, mainnet, sepolia} from 'wagmi/chains'
             

export const projectId = 'ef615def723d48762510789ecfe0a94a'
if (!projectId) {
    throw new Error('You need to provide a projectId')
}


export const metadata = {
    name: 'wagmi-ether',
    description: 'A simple example of Appkit',
    url: 'https://wagmi-ether.vercel.app/',
    icons: ['https://avatars.githubusercontent.com/u/17922993'],
}

export const networks = [sepolia] as [AppKitNetwork, ...AppKitNetwork[]]

export const wagmiAdapter = new WagmiAdapter({projectId, networks})

export const config = wagmiAdapter.wagmiConfig