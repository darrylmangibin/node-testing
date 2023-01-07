import 'module-alias/register';

import app from '@/src/index';

app.listEndpoints(process.argv[2]);
