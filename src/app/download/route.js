import { NextResponse } from "next/server";
import { createReadStream } from "fs";
import { resolve } from "path";

export async function GET(req, res) {
  const filePath = resolve("/tmp/tokenbound_accounts.csv");

  createReadStream(filePath).pipe(res);
}
