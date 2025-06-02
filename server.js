import http from "http";
import fs from "node:fs";

const fakeModelOutput = `Welcome to the amazing world of SSE!
Lorem ipsum dolor sit amet, consetetur sadipscing elitr, 
sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, 
sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. 
Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.
 Lorem ipsum dolor sit amet, consetetur sadipscing elitr,
  sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, 
  sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. 
  Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.
`;

/**
 * @param {Response} res
 * @param {string} data
 */
function sendEvent(res, data) {
  res.write(`data: ${data}\n\n`);
}

const server = http.createServer(async (req, res) => {
  switch (req.url) {
    case "":
    case "/":
      res.writeHead(200);
      fs.createReadStream("client.html").pipe(res);
      break;
    case "/events":
      res.writeHead(200, {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      });

      for (let token of fakeModelOutput.split(" ")) {
        sendEvent(res, token);
        await new Promise((r) => setTimeout(r, 300)); // sleep
      }

      req.on("close", () => {
        res.end();
        console.log("Client disconnected");
      });
      break;
    default:
      res.writeHead(404);
      res.end();
  }
});

server.listen(3030, () => {
  console.log("SSE server on http://localhost:3030");
});
