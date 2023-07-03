"use client";

import { useState } from "react";
import { Network, Alchemy } from "alchemy-sdk";

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

  const handleSubmit = async (event: any) => {
    event.preventDefault();

    console.log("submit");

    const tokenSupply = await alchemy.nft.getContractMetadata(
      "0xBBa205283253E7aDB8Be4A0b03600c9AB4924974"
    );

    console.log(tokenSupply.totalSupply);

    const response = await fetch(
      `/generate?id=${contractAddress}&totalSupply=${tokenSupply.totalSupply}`,
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
  };

  const handleDownload = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      "TOKEN_ID,ACCOUNT\n" +
      data.map((e) => `${e.tokenId},${e.account}`).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "tokenbound_accounts.csv");
    document.body.appendChild(link);

    link.click();
  };

  return (
    <div className='flex flex-col justify-center mt-20 items-center'>
      <h1 className='mb-10 text-lg'>
        Get all TokenBound accounts for an NFT collection
      </h1>
      <form className='my-5' onSubmit={handleSubmit}>
        <label>
          Contract Address:
          <input
            type='text'
            value={contractAddress}
            onChange={(e) => setContractAddress(e.target.value)}
            className='bg-black w-[500px] border-gray-400 border border-1'
          />
        </label>
        <button type='submit'>Fetch Data</button>
      </form>

      {data.length > 0 && (
        <div>
          <button
            className='my-5 bg-slate-500 p-2'
            onClick={() => handleDownload()}
          >
            Download as CSV
          </button>
          <table>
            <thead>
              <tr>
                <th>TOKEN_ID</th>
                <th>ACCOUNT</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (
                <tr key={index}>
                  <td>{item.tokenId}</td>
                  <td>{item.account}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
