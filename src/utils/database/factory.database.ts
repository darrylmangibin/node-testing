import { Model } from 'mongoose';

abstract class FactoryDatabase<T = {}, U = {}> {
  abstract model: Model<T>;

  abstract data: (arg?: Partial<U>) => Promise<U> | U;

  public create = async (arg?: Partial<U>) => {
    try {
      const data = await this.data(arg);

      return await this.model.create(data);
    } catch (error) {
      throw error;
    }
  };

  public createMany = async (count: number = 1, arg?: Partial<U>) => {
    try {
      const dataArray: U[] = [];

      for await (let _k of Array.from({ length: count })) {
        const data = await this.data(arg);

        dataArray.push(data);
      }

      return await this.model.create(dataArray);
    } catch (error) {
      throw error;
    }
  };

  public insertName = async (args: Partial<U>[]) => {
    try {
      const dataArray: U[] = [];

      for await (let arg of args) {
        const data = await this.data(arg);

        dataArray.push(data);
      }

      return await this.model.create(dataArray);
    } catch (error) {
      throw error;
    }
  };

  public deleteMany = async () => {
    try {
      await this.model.deleteMany();
    } catch (error) {
      throw error;
    }
  };
}

export default FactoryDatabase;
