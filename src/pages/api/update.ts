import type { NextApiRequest, NextApiResponse } from 'next';
import { appRouter } from '../../server/trpc/router/_app';
import { createContext } from '../../server/trpc/context';
import { TRPCError } from '@trpc/server';
import { getHTTPStatusCodeFromError } from '@trpc/server/http';

const updateDb = async (req: NextApiRequest, res: NextApiResponse) => {
  // Create context and caller
  const ctx = await createContext({ req, res });
  ctx.session = {
    user: {
      id: '1324',
      role: 'ADMIN',
    },
    expires: '8000',
  };

  const apiHeaders = req.headers;

  const caller = appRouter.createCaller(ctx);
  if (req.method !== 'GET')
    return res.status(405).json({
      message: 'Method Not Allowed. Only GET is allowed for this resource.',
    });

  try {
    const createDebitsResp = await caller.contracts.createDebits();
    const debitsUpdateResp = await caller.debits.update();
    res.status(200).json({
      MESSAGE: 'Deu Bom',
      createDebitsResp,
      debitsUpdateResp,
      apiHeaders,
    });
  } catch (cause) {
    if (cause instanceof TRPCError) {
      // An error from tRPC occured
      const httpCode = getHTTPStatusCodeFromError(cause);
      return res.status(httpCode).json(cause);
    }
    // Another error occured
    console.error(cause);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export default updateDb;
