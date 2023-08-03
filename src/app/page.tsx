"use client";

import { useState } from "react";
import { Network, Alchemy } from "alchemy-sdk";
import Image from "next/image";
import Link from "next/link";
import { metadata } from "./layout";

const settings = {
  apiKey: "GJ5MKeabYfvo7W872rFBktlZ3cRhKhNP",
  network: Network.ETH_MAINNET,
};

const alchemy = new Alchemy(settings);

type dataType = {
  tokenId: number;
  account: string;
};

export default function Home() {
  const [contractAddress, setContractAddress] = useState("");
  const [data, setData] = useState<dataType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [meta, setMeta] = useState<any>();

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    setIsLoading(true);

    console.log("submit");

    const metadata = await alchemy.nft.getContractMetadata(contractAddress);

    console.log(metadata);
    setMeta(metadata);

    const response = await fetch(
      `/generate?id=${contractAddress}&totalSupply=${
        metadata.totalSupply || 10000
      }`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ contractAddress }),
      }
    );

    const data = await response.json();

    console.log(data);

    if (response.ok) {
      setData(data.data);
    } else {
      alert("Failed to fetch data");
    }

    setIsLoading(false);
  };

  const handleDownload = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      "TOKEN_ID,ACCOUNT\n" +
      data.map((e) => `${e.tokenId},${e.account}`).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", meta.openSea.collectionName || "accounts");
    document.body.appendChild(link);

    link.click();
    setData([]);
  };

  return (
    <div className='flex flex-col justify-between items-center w-screen h-screen bg-gray-900'>
      <div className='w-full p-5 flex justify-between items-center'>
        <Image src='/logo.png' width={100} height={100} alt='pvnks logo' />
        <Link
          href={"https://pvnks.com"}
          className='bg-yellow-300 py-3 px-5 text-black font-semibold hover:bg-yellow-400'
        >
          HOME
        </Link>
      </div>
      <div className='flex flex-col  w-full'>
        <h1 className=' text-5xl mx-auto mb-2 font-CircularMedium leading-relaxed'>
          Get all TokenBound (ERC6551) <br />
          accounts for an NFT collection
        </h1>
        <form
          className='my-5 flex flex-col w-full justify-center items-center'
          onSubmit={handleSubmit}
        >
          <input
            type='text'
            value={contractAddress}
            placeholder='Enter NFT Contract Address'
            onChange={(e) => setContractAddress(e.target.value)}
            className='bg-zinc-800 p-4 rounded-lg w-[550px] hover:scale-105 transition-all text-center'
          />
          <div className='flex gap-5 my-3'>
            <button
              className={`${
                !isLoading ? "bg-yellow-300" : "bg-gray-500"
              }  py-3 px-5 text-black rounded-lg transition-all hover:bg-yellow-400`}
              type='submit'
              disabled={isLoading}
            >
              {!isLoading ? "Fetch Accounts" : "Fetching..."}
            </button>
          </div>
        </form>
        {data.length > 0 && contractAddress && (
          <div className='flex flex-col w-full justify-center items-center'>
            <div className='flex gap-5 bg-zinc-800 p-5 rounded-lg'>
              <Image
                src={meta.openSea.imageUrl}
                width={110}
                height={110}
                alt='collection logo'
                className='rounded-lg'
              />
              <div>
                <p className='text-lg font-semibold'>
                  {meta.openSea.collectionName || "NFT Collection"}
                </p>
                <p>
                  Supply:{" "}
                  <span className='font-semibold'>{meta.totalSupply}</span>
                </p>
                <button
                  className='mt-2 py-3 px-5 bg-slate-500 rounded-lg'
                  onClick={() => handleDownload()}
                >
                  Download as CSV
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className='py-2 tracking-widest'>
        A TokenBound tool for pvnks by{" "}
        <Link
          href={"https://x.com/elonsdev"}
          target='_blank'
          className='text-yellow-300'
        >
          @elonsdev
        </Link>
        . All rights reserved.
      </div>
    </div>
  );
}
