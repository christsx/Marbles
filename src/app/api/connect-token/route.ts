import { createConnectTokenResponse } from "@/lib/pipedream/create-connect-token-response"

export async function POST() {
  return createConnectTokenResponse()
}
