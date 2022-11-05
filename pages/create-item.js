import { useState } from "react";
import {ethers} from "ethers";
import {create as ipfsHttpClient} from "ipfs-http-client";
import {useRouter} from 'next/router';
import Web3Modal from 'web3modal'

const client = ipfsHttpClient('https://ipfs.infura.io:5001/api/v0')

import {nftaddress,nftmarketaddress} from '../config'

import NFT from '../artifacts/contracts/NFT.sol/NFT.json';
import Market from '../artifacts/contracts/NFTmarket.sol/NFTmarket.json';

export default function CreateItem(){
  const [fileUrl, setFileUrl] = useState(null)
  const [formInput, updateFormInput] = useState({ price: '', name: '', description: '' })
  const router = useRouter()

  async function onChange(e){
    const file =e.target.files[0];
    try {
        const added =await client.add(
            file,
            {
                progress: (prog)=> console.log(`recieved ${prog}`)
            }
        )
        const url = `https://ipfs.infura.io/ipfs/${added.path}`
        setFileUrl(url)
    } catch (e) {
        console.log(e)
    }
  }

  async function createItem() {
    const { name, description, price } = formInput
    if (!name || !description || !price || !fileUrl) return
    /* first, upload to IPFS */
    const data = JSON.stringify({
      name, description, image: fileUrl
    })
    try {
      const added = await client.add(data)
      const url = `https://ipfs.infura.io/ipfs/${added.path}`
      createSale(url)
    } catch (error) {
      console.log('Error uploading file: ', error)
    }  
  }

  async function createSale(url){

    const web3Modal = new Web3Modal()
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()

    let contract = new ethers.Contract(nftaddress,NFT.abi,signer)
    let transaction = await contract.createToken(url);
    let tx=await transaction.wait();

    let event=tx.events[0]
    let value=event.args[2]
    let tokenId=value.toNumber()

    const price=ethers.utils.parseUnits(formInput.price,'ether');

    contract=new ethers.Contract(nftmarketaddress,Market.abi,signer);
    let listingPrice = await contract.getListingPrice();
    listingPrice=listingPrice.toString();

    transaction=await contract.createMarketItem(
       nftaddress,tokenId,price,{value:listingPrice}
    )
    await transaction.wait();
    router.push('/')
  }


  return (
    <>
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          width: "60vw",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          marginTop: "3rem",
        }}
      >
        <input
          type="text"
          placeholder="Name of your store"
          onChange={(e)=>updateFormInput({...formInput,name:e.target.value})}
          required
          style={{
            padding: "0.7rem",
            margin: "0.5rem 0rem",
          }}
        />
        <textarea
          placeholder="Asset Description"
          rows="4"
          cols="50"
          onChange={(e)=>updateFormInput({...formInput,description:e.target.value})}
          style={{
            padding: "0.7rem",
            margin: "0.5rem 0rem",
            marginBottom: "1rem",
          }}
        />
        <input
          type="text"
          placeholder="Asset Price in Matic"
          onChange={(e)=>updateFormInput({...formInput,price:e.target.value})}
          required
          style={{
            padding: "0.7rem",
            margin: "0.5rem 0rem",
            marginBottom: "1rem",
          }}
        />
        <input type="file" onChange={onChange} />
        {
            fileUrl && (<img width="350" src={fileUrl}/>)
        }
        <button
          onClick={()=>createItem}
          style={{
            marginTop: "3rem",
            height: "2.5rem",
            color: "white",
            backgroundColor: "black",
            borderRadius: "2px",
            fontSize: "15px",
            cursor: "pointer",
          }}
        >
          Create Digital Asset
        </button>
      </div>
    </div></>
  )
  

}

