import { CounterModel } from "../infrastructure/models/Counter";

class CounterService {
    static async getNextSequence(name: string): Promise<number> {
      const counter = await CounterModel.findOneAndUpdate(
        { _id: name },
        { $inc: { sequence_value: 1 } },
        { new: true, upsert: true } 
      );
      return counter.sequence_value;
    }
  }
  
  export default CounterService;