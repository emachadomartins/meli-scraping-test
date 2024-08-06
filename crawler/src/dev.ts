import { handleTask } from ".";
import task from "../debug/task.json";
import { Result, Task } from "./types";

// Função que envia para execução informações passadas a partir da task em memoria no arquivo 'debug/task.json'
(async () => {
  await handleTask(
    task as unknown as Task,
    async (result: Result) => {
      console.log(result);
    },
    async (error: Error | string) => {
      console.log(error);
    }
  );
})();
