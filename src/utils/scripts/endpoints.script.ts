import 'module-alias/register';

import server from '@/src/server';

server.listEndpoints(process.argv[2]);
