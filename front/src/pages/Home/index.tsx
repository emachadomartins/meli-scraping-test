import "./styles.css";

export function Home() {
  return (
    <div className="background">
      <main className="main">
        <h1 className="title">Data Collector</h1>
        <p>Envie uma url para realizar a coleta.</p>
        <div className="input-box">
          <input type="text" name="" />
          <label>Url</label>
        </div>
        <button className="btn">Submit</button>
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
      </main>
    </div>
  );
}
