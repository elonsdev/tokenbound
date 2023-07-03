import { NextResponse } from "next/server";
import { TokenboundClient } from "@tokenbound/sdk";

export async function POST(request) {
  const { searchParams } = new URL(request.url);
  const contractAddress = searchParams.get("id");
  const totalSupply = searchParams.get("totalSupply");
  console.log(contractAddress);

  const tokenboundClient = new TokenboundClient({ chainId: 1 });

  let data = [];

  for (let tokenId = 1; tokenId <= totalSupply; tokenId++) {
    const tokenBoundAccount = await tokenboundClient.getAccount({
      tokenContract: contractAddress,
      tokenId: tokenId.toString(),
    });

    data.push({
      tokenId: tokenId,
      account: tokenBoundAccount,
    });
  }

  return NextResponse.json({ data });
}
