import { useEffect, useState } from "react";
import { Task } from "../../types";
import { request } from "../../utils";
import "./styles.css";

const API = process.env.REACT_APP_API_URL;

export function Home() {
  const [url, setUrl] = useState("");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [steps, setSteps] = useState("[]");

  useEffect(() => {
    handleTasks();
  }, []);

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
      handleTasks();
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
              {tasks.map(({ id, url, complete, error, info = {}, files }) => (
                <li className="task" key={id}>
                  <h3>{id}</h3>
                  <p className="title">Url:</p>
                  <a href={url}>{url}</a>
                  <p className="title">Status:</p>
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
                  {!error ? <></> : <p className="error">{error}</p>}
                  {!complete ? (
                    <></>
                  ) : (
                    <>
                      {Object.keys(info).length ? (
                        <p className="title">Resultados</p>
                      ) : (
                        <></>
                      )}
                      {Object.entries(info).map(([key, value]) => (
                        <div className="attr-box">
                          <div className="attr-key">{key}</div>
                          <div className="attr-val">
                            {typeof value === "object"
                              ? JSON.stringify(value)
                              : `${value}`}
                          </div>
                        </div>
                      ))}
                      {files?.length ? (
                        <p className="title">Arquivos</p>
                      ) : (
                        <></>
                      )}
                      {files?.map((file) => (
                        <a className="link" href={`${API}task/${file}`}>
                          {file.split("/")[1]}
                        </a>
                      ))}
                    </>
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
