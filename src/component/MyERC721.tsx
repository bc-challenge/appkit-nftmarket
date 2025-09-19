import { erc721ContractConfig } from '../contract/ERC721/contracts';
import { useAppKitAccount } from "@reown/appkit/react";
import { useWaitForTransactionReceipt, useWriteContract, BaseError, useReadContracts, useReadContract } from 'wagmi'
import { useEffect, useState } from 'react';
import { readContract } from 'viem/actions';
import {config, wagmiAdapter} from '../config/config'
import { createConfig, http } from 'wagmi';
import { Config, getClient } from '@wagmi/core';
import { mainnet, sepolia } from '@wagmi/core/chains'
import React from "react";


export function MyERC721() {
    // const { contract } = useContract(erc721ContractConfig);
    const { address } = useAppKitAccount();
    const [to, setTo] = useState('');
    const [tokenUri, setTokenUri] = useState('');

    const [approveTo, setApproveTo] = useState('');
    const [approveTokenId, setApproveTokenId] = useState('');

    const [ownerOfTokenId, setOwnerOfTokenId] = useState('');
    const [ownerResult, setOwnerResult] = useState('');
    
    const { data: hash, writeContract , error, isPending, } = useWriteContract()

    // const {data} = useReadContract({
    //         address: erc721ContractConfig.address as `0x${string}`,
    //         abi: erc721ContractConfig.abi,
    //         functionName: 'ownerOf',
    //         args:[BigInt(ownerOfTokenId)]
    //     })

    // setOwnerResult(JSON.stringify(data))



    function handleMint() {

        // 获取输入框的值
        console.log('to:', to);
        console.log('tokenUri:', tokenUri);
        writeContract({
            address: erc721ContractConfig.address as `0x${string}`,
            abi: erc721ContractConfig.abi,
            functionName: 'mint',
            args: [to, tokenUri],
        })      
    }

    function handleApprove() {

        console.log('approveTo:', approveTo);
        console.log('approveTokenId:', approveTokenId);
        writeContract({
            address: erc721ContractConfig.address as `0x${string}`,
            abi: erc721ContractConfig.abi,
            functionName: 'approve',
            // Replace with appropriate arguments for the approve function
            // For example: args: [spenderAddress, tokenId],
            args: [approveTo, BigInt(approveTokenId)], // Example arguments
        })
    }

    async function handleOwnerOf() {
        try {
            if (!ownerOfTokenId) return;
            const client = getClient(wagmiAdapter.wagmiConfig) as any;
            const result = await readContract(client, {
                address: erc721ContractConfig.address as `0x${string}`,
                abi: erc721ContractConfig.abi,
                functionName: 'ownerOf',
                args: [BigInt(ownerOfTokenId)]
            });
            setOwnerResult(result as string);
        } catch (err) {
            const error = err as BaseError;
            console.log(error.message)
            setOwnerResult(error.message)

            // console.log(JSON.stringify(err, (key, value) => {
            //     if (typeof value === 'bigint') {
            //     return value.toString();
            //     }
            //     return value;
            // }))
            // console.log(JSON.stringify(err))
        }
    }

    const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({hash})


    if (!address) return <div></div>;
    // You can add more logic here to interact with the ERC721 contract using the `contract` object.

    function copyToClipboard(text: string) {
        navigator.clipboard.writeText(text).catch(() => {});
    }

    return (
    <>
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
                    MyERC721
                    <span
                        style={{ marginLeft: '12px', fontSize: '14px', color: '#1677ff', cursor: 'pointer' }}
                        onClick={() => copyToClipboard(erc721ContractConfig.address)}
                        title="Click to copy"
                    >
                        {erc721ContractConfig.address}
                    </span>
                </div>  
                <div style={{marginTop: '8px'}}>
                    <button style={{ backgroundColor: 'lightgray'}} onClick={handleMint}>Mint</button> 
                    <input type="text" placeholder="to" style={{ marginLeft: '8px' }} value={to} onChange={e => setTo(e.target.value)}/>
                    <input type="text" placeholder="tokenUri" style={{ marginLeft: '8px' }} value={tokenUri} onChange={e => setTokenUri(e.target.value)}/>
                </div>

                <div style={{marginTop: '8px'}}>
                    <button style={{ backgroundColor: 'lightgray'}} onClick={handleApprove}>Approve</button>
                    <input type="text" placeholder="to" style={{ marginLeft: '8px' }} value={approveTo} onChange={e => setApproveTo(e.target.value)}/>
                    <input type="text" placeholder="tokenId" style={{ marginLeft: '8px' }} value={approveTokenId} onChange={e => setApproveTokenId(e.target.value)}/>
                </div>

                <div style={{marginTop: '8px'}}>
                    <button style={{ backgroundColor: 'lightgray'}} onClick={handleOwnerOf}>OwnerOf</button>
                    <input type="text" placeholder="tokenId" style={{ marginLeft: '8px' }} value={ownerOfTokenId} onChange={e => setOwnerOfTokenId(e.target.value)}/>
                     {ownerResult && <p>Owner: {ownerResult}</p>}
                </div>



                {hash && <div>Transaction Hash: {hash}</div>}
                {isConfirming && <div>Waiting for confirmation...</div>} 
                {isConfirmed && <div>Transaction confirmed.</div>} 
                {error && (
                    <div>Error: {(error as BaseError).shortMessage || error.message}</div>
                )}
               
        </div>


    </>
   )
}