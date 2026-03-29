const http = require("http");
const next = require("next");

const port = Number(process.env.PORT || 3000);
const listenHost = process.env.HOST || "0.0.0.0";
const nextHostname = process.env.NEXT_INTERNAL_HOST || "127.0.0.1";

async function main() {
  const app = next({
    dev: false,
    dir: __dirname,
    hostname: nextHostname,
    port,
  });
  const handle = app.getRequestHandler();

  await app.prepare();

  const server = http.createServer((req, res) => handle(req, res));

  server.listen(port, listenHost, () => {
    console.log(`ready started custom server on ${listenHost}:${port}`);
  });
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
