import React, { useState } from "react";
import { useWaitForTransactionReceipt, useWriteContract, BaseError, useReadContracts, useReadContract, useWatchContractEvent } from 'wagmi'
import {nftMarketContractConfig } from '../contract/NFTMarket/contracts'
import { readContract } from 'viem/actions';
import {config, wagmiAdapter} from '../config/config'
import { createConfig, http } from 'wagmi';
import { Config, getClient } from '@wagmi/core';
import { useAppKitAccount } from "@reown/appkit/react";

export function NFTMarket(){

    const [listingId, setListingId ] = useState('');
    const [listingIdResult, setListingIdResult] = useState('')
    const [nftContract, setNftContract] = useState('');
    const [tokenId, setTokenId] = useState('');
    const [price, setPrice] = useState('');
    const [nftListId, setNftListId] = useState('');        
    const { data: hash, writeContract , error, isPending, } = useWriteContract()
    const [listedLogs, setListedLogs] = useState<any[]>([])

    const { address } = useAppKitAccount();


    useWatchContractEvent({
        address: nftMarketContractConfig.address as  `0x${string}` ,
        abi: nftMarketContractConfig.abi,
        eventName: 'NFTListed',
        onLogs(logs) {
            console.log(logs)
            setListedLogs(prev => [...prev, ...logs])
        },
      })



    async function handleListing() {
        console.log('查询： '  + listingId);

        try {
            if (!listingId) return;
            const client = getClient(wagmiAdapter.wagmiConfig) as any;
            const result = await readContract(client, {
                address: nftMarketContractConfig.address as `0x${string}`,
                abi: nftMarketContractConfig.abi,
                functionName: 'listings',
                args: [BigInt(listingId)]
            }) 
            console.log(result)
            const [seller, nftContract, tokenId, price, isActive] = result as readonly [`0x${string}`, `0x${string}`, bigint, bigint, boolean];
            setListingIdResult(`seller: ${seller} \nnftContract: ${nftContract}\ntokenId: ${tokenId}\nprice: ${price}\nisActive: ${isActive}`)
        } catch (err) {
            const error = err as BaseError;
            console.log(error.message)
            setListingIdResult(error.message)

            // console.log(JSON.stringify(err, (key, value) => {
            //     if (typeof value === 'bigint') {
            //     return value.toString();
            //     }
            //     return value;
            // }))
            // console.log(JSON.stringify(err))
        }


        // writeContract({
        //     address: nftMarketContractConfig.address as `0x${string}`,
        //     abi: nftMarketContractConfig.abi,
        //     functionName: 'listings',
        //     args: [BigInt(listingId)], // Example arguments
        // })
    }

    function handleCancelList() {
        console.log('cancelList clicked');
    }

    function handleBuyNFT() {
        console.log('buyNFT clicked');
        console.log('nftListId:', nftListId);

        writeContract({
            address: nftMarketContractConfig.address as `0x${string}`,
            abi: nftMarketContractConfig.abi,
            functionName: 'buyNft',
            args: [nftListId], // Example arguments
        })

    }

    function handleList(){
        console.log('上架');
        console.log('_nftContract:', nftContract);
        console.log('_tokenId:', tokenId);
        console.log('_price:', price);

        writeContract({
            address: nftMarketContractConfig.address as `0x${string}`,
            abi: nftMarketContractConfig.abi,
            functionName: 'list',
            args: [nftContract, BigInt(tokenId), BigInt(price)], // Example arguments
        })

    }


    function stingFy( obj : any){
      return JSON.stringify(obj, (key, value) => {
            if (typeof value === 'bigint') {
              return value.toString();
            }
            return value;
          })
    }

   

    const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({hash})
    function copyToClipboard(text: string) {
        navigator.clipboard.writeText(text).catch(() => {});
    }

   
    if (!address) return <div></div>;

    
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
                    NFTMarket
                    <span
                        style={{ marginLeft: '12px', fontSize: '14px', color: '#1677ff', cursor: 'pointer' }}
                        onClick={() => copyToClipboard(nftMarketContractConfig.address)}
                        title="Click to copy"
                    >
                        {nftMarketContractConfig.address}
                    </span>
                </div>

                <div style={{marginTop: '8px'}}>
                    <button style={{ backgroundColor: 'lightgray'}} onClick={handleList}>list</button>
                    <input type="text" placeholder="_nftContract" style={{ marginLeft: '8px' }} value={nftContract} onChange={e => setNftContract(e.target.value)}/>
                    <input type="text" placeholder="_tokenId" style={{ marginLeft: '8px' }} value={tokenId} onChange={e => setTokenId(e.target.value)}/>
                    <input type="text" placeholder="_price" style={{ marginLeft: '8px' }} value={price} onChange={e => setPrice(e.target.value)}/>
                </div>
                {/* <div style={{marginTop: '8px'}}>
                    <button style={{ backgroundColor: 'lightgray'}} onClick={handleCancelList}>cancelList</button>
                </div> */}

                <div style={{marginTop: '8px'}}>
                    <button style={{ backgroundColor: 'lightgray'}} onClick={handleBuyNFT}>buyNFT</button>
                    <input type="text" placeholder="nftListId" style={{ marginLeft: '8px' }} value={nftListId} onChange={e => setNftListId(e.target.value)}/>
                </div>
                <div style={{marginTop: '8px'}}>
                    <button style={{ backgroundColor: 'lightgray'}} onClick={handleListing}>listing</button>
                    <input type="text" placeholder="_listingId" style={{ marginLeft: '8px' }} value={listingId} onChange={e => setListingId(e.target.value)}/>
                    {listingIdResult != undefined && (<div>{listingIdResult}</div>)}
                </div>

                {hash && <div>Transaction Hash: {hash}</div>}
                {isConfirming && <div>Waiting for confirmation...</div>} 
                {isConfirmed && <div>Transaction confirmed.</div>} 
                {error && (
                    <div>Error: {(error as BaseError).shortMessage || error.message}</div>
                )}
                {listedLogs.length > 0 && (
                    <div style={{marginTop: '8px'}}>
                        Last NFTListed: {JSON.stringify(listedLogs[listedLogs.length - 1]?.args, (k, v) => typeof v === 'bigint' ? v.toString() : v)}
                    </div>
                )}

               
            </div>
        </>
        )
}