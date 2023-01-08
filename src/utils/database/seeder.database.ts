import UserFactory from '@/resources/user/user.factory';
import 'colors';
import 'dotenv/config';
import connectDatabase from './connect.database';

class SeederDatabase {
  constructor() {
    connectDatabase();
  }

  public importData = async () => {
    try {
      console.log('Generating admin...'.green);
      const admin = new UserFactory().create({
        email: 'admin@test.com',
        role: 'admin',
      });

      console.log('Generating users...'.green);
      const users = await new UserFactory().createMany(20);

      console.log('Data imported...'.green.bold);

      process.exit();
    } catch (error) {
      console.log(error);

      process.exit(1);
    }
  };

  public destroyData = async () => {
    try {
      console.log('Deleting users...'.red);
      await new UserFactory().deleteMany();

      console.log('Data destroyed...'.red.bold);

      process.exit();
    } catch (error) {
      console.log(error);

      process.exit(1);
    }
  };
}

export default SeederDatabase;
