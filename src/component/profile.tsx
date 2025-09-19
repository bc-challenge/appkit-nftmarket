import { stat } from 'fs'
import {useAccount, useEnsName, useDisconnect, useConnect, useBalance} from 'wagmi'
import { useAppKitAccount } from "@reown/appkit/react";




export function Profile() {

  const { address, isConnected, caipAddress, status, embeddedWalletInfo } =
  useAppKitAccount();
  console.log('code execute 1');

  const {data: balance} = useBalance({ address: address as `0x${string}` });



  if (!isConnected) return <div></div>
  return (
    <div className="profile-card" style={{
      border: '1px solid #e0e0e0',
      borderRadius: '8px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
      padding: '24px',

      margin: '10px 100px',
      textAlign: 'left',
      background: '#f5f5f5'
    }}>
      <div style={{marginBottom: '8px', fontWeight: 'bold', fontSize: '22px'}}>useAppKitAccount</div>
      <div style={{marginBottom: '8px'}}>Address: {address}</div>
      <div style={{marginBottom: '8px'}}>CAIP Address: {caipAddress}</div>
      <div style={{marginBottom: '8px'}}>Status: {status}</div>
      <div style={{marginBottom: '8px'}}>Embedded Wallet Info: {JSON.stringify(embeddedWalletInfo)}</div>
      <div style={{marginBottom: '8px'}}>Balance: {balance?.formatted} {balance?.symbol}</div>
    </div>
  )
   
}