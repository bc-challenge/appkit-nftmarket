import { useReadContract, useReadContracts, BaseError, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { erc20ContractConfig } from '../contract/ERC20/contracts'
import { useState } from 'react'
import { useAppKitAccount } from "@reown/appkit/react";
import React from "react";

export function MyERC20() {

  const { address } = useAppKitAccount();
  const { data: hash, writeContract , error: txError } = useWriteContract()
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({hash})

  const [approveTo, setApproveTo] = useState('');
  const [approveAmount, setApproveAmount] = useState('');

const { 
    data,
    error,
    isPending
  } = useReadContracts({ 
    contracts: [{ 
      abi: erc20ContractConfig.abi,
      address: erc20ContractConfig.address as `0x${string}`,
      functionName: 'balanceOf',
      args: [address],
    }, { 
      abi: erc20ContractConfig.abi,
      address: erc20ContractConfig.address as `0x${string}`,
      functionName: 'ownerOf',
      args: [69n],
    }, {
      abi: erc20ContractConfig.abi,
      address: erc20ContractConfig.address as `0x${string}`,
      functionName: 'totalSupply',
    }] 
  }) 
  const [balance, ownerOf, totalSupply] = data || [] 
  if (!address) return <div></div>
  if (isPending) return <div>Loading...</div>

  if (error)
    return (
      <div>
        Error: {(error as BaseError).shortMessage || error.message}
      </div>
    ) 

  function copyToClipboard(text: string) {
    navigator.clipboard.writeText(text).catch(() => {});
  }

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
        <div style={{marginBottom: '8px', fontWeight: 'bold', fontSize: '22px'}}>
          MyERC20 
          <span
            style={{ marginLeft: '12px', fontSize: '14px', color: '#1677ff', cursor: 'pointer' }}
            onClick={() => copyToClipboard(erc20ContractConfig.address)}
            title="Click to copy"
          >
            {erc20ContractConfig.address}
          </span>
        </div>
        <div style={{marginTop: '8px'}}>
          <button style={{ backgroundColor: 'lightgray'}} onClick={() => {
            writeContract({
              address: erc20ContractConfig.address as `0x${string}`,
              abi: erc20ContractConfig.abi,
              functionName: 'approve',
              args: [approveTo, BigInt(approveAmount || '0')],
            })
          }}>Approve</button>
          <input type="text" placeholder="to" style={{ marginLeft: '8px' }} value={approveTo} onChange={e => setApproveTo(e.target.value)}/>
          <input type="text" placeholder="amount" style={{ marginLeft: '8px' }} value={approveAmount} onChange={e => setApproveAmount(e.target.value)}/>
        </div>
    <div>Balance: {JSON.stringify(balance, (key, value) => {
        if (typeof value === 'bigint') {
          return value.toString();
        }
        return value;
      })}</div>
    
      <div>Total Supply: {JSON.stringify(totalSupply, (key, value) => {
        if (typeof value === 'bigint') {
          return value.toString();
        }
        return value;
      })}</div> 

      {hash && <div>Transaction Hash: {hash}</div>}
      {isConfirming && <div>Waiting for confirmation...</div>} 
      {isConfirmed && <div>Transaction confirmed.</div>} 
      {txError && (
        <div>Error: {(txError as BaseError).shortMessage || (txError as any).message}</div>
      )}

    </div>
  )






    // const {address, setAddress} = useState('0xC756573128C26B7CF025757320EF2B5C69760c7d' as `0x${string}` | undefined);

    // const { data: balance, 
    //     isPending,
    //     isError, isLoading } = useReadContract({
    //     abi: erc20ContractConfig.abi,
    //     address: erc20ContractConfig.address as `0x${string}`,
    //     functionName: 'balanceOf',
    //     args: [address],
    //     query:{
    //         enabled: !!address
    //     }
    // })


    // if (!isPending ) return <div>Loading......</div>
    // if (isError) {
    //     return <div>Error: {isError}</div>
    // }
}   