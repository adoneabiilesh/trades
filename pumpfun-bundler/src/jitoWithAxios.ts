import axios from 'axios';

export interface JitoBundleRequest {
  jsonrpc: string;
  id: number;
  method: string;
  params: {
    bundles: string[];
    tip_account: string;
    tip_amount: number;
  };
}

export interface JitoBundleResponse {
  jsonrpc: string;
  id: number;
  result: {
    bundle_id: string;
    transactions: string[];
  };
}

export async function jitoWithAxios(
  bundles: string[],
  tipAccount: string,
  tipAmount: number
): Promise<JitoBundleResponse> {
  const request: JitoBundleRequest = {
    jsonrpc: '2.0',
    id: 1,
    method: 'sendBundle',
    params: {
      bundles,
      tip_account: tipAccount,
      tip_amount: tipAmount,
    },
  };

  try {
    const response = await axios.post(
      'https://mainnet.block-engine.jito.wtf/api/v1/bundles',
      request,
      {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 30000,
      }
    );

    return response.data;
  } catch (error) {
    console.error('Jito bundle error:', error);
    throw error;
  }
}
