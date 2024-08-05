import { handleTask } from ".";
import task from "../debug/task.json";
import { Result, Task } from "./types";

(async () => {
  await handleTask(
    task as Task,
    async (result: Result) => {
      console.log(result);
    },
    async (error: Error | string) => {
      console.log(error);
    }
  );
})();
