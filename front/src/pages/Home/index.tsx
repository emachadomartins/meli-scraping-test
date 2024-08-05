import { useEffect, useState } from "react";
import { Task } from "../../types";
import { request } from "../../utils";
import "./styles.css";

export function Home() {
  const [url, setUrl] = useState("");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [steps, setSteps] = useState("[]");

  useEffect(() => {
    handleTasks();
  }, []);

  useEffect(() => {
    setTimeout(() => handleTasks(), 10000);
  }, [tasks]);

  const handleTasks = () => {
    request<{ tasks: Task[] }>("/task")
      .then(({ tasks }) => setTasks(tasks))
      .catch(() => setTasks([]));
  };

  const handleSubmit = async () => {
    request("/task", "post", {
      message: {
        url,
        steps: JSON.parse(steps),
      },
    }).then(() => {
      let i = 0;
      while (i < 10) {
        handleTasks();
      }
    });
  };

  return (
    <div className="background">
      <main className="main">
        <h1 className="title">Data Collector</h1>
        <p>
          Instruções de uso:
          <a
            className="link"
            href="https://github.com/hakuunabatata/meli-scraping-test"
            target="_blank"
            rel="noopener noreferrer"
          >
            <code>Github</code>
          </a>
        </p>
        <p>Envie uma url para realizar a coleta.</p>
        <div className="input-box">
          <input
            className="input"
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          <label>Url</label>
        </div>
        <div className="input-box">
          <textarea
            className="input"
            value={steps}
            onChange={(e) => setSteps(e.target.value)}
          />
          <label>Steps</label>
        </div>
        <button className="button" onClick={handleSubmit}>
          Enviar
        </button>
        {!tasks.length ? (
          <></>
        ) : (
          <>
            <h3>Ultimas tasks</h3>

            <ul className="tasks">
              {tasks.map(({ id, url, complete, error }) => (
                <li className="task" key={id}>
                  <h3>{id}</h3>
                  <p>
                    Url: <a href={url}>{url}</a>
                  </p>
                  <p>
                    Status:
                    <p
                      className={
                        complete ? "complete" : error ? "error" : "status"
                      }
                    >
                      {complete
                        ? "Completo"
                        : error
                        ? "Error"
                        : "Em processamento..."}
                    </p>
                  </p>
                  {!error ? <></> : <p className="error">{error}</p>}
                  {!complete ? (
                    <></>
                  ) : (
                    <button className="button" onClick={handleSubmit}>
                      Ver Resultado
                    </button>
                  )}
                </li>
              ))}
            </ul>
          </>
        )}
      </main>
    </div>
  );
}
