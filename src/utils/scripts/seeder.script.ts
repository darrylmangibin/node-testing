import 'module-alias/register';

import SeederDatabase from '../database/seeder.database';

const seeder = new SeederDatabase();

if (process.argv[2] === 'i') {
  seeder.importData();
}

if (process.argv[2] === 'd') {
  seeder.destroyData();
}
