//@ts-check
//프레임워크 없이 웹서버 만들기

/**
 *블로그 포스팅 서비스
 *로컬파일을 데이터베이스로 활용
 *인증 로직X
 *RESTful API사용
 *httpie로 편하게 사용가능

 */

const http = require("http");

const { routes } = require("./api.js");

const server = http.createServer((req, res) => {
  async function main() {
    const route = routes.find(
      (_route) =>
        req.url &&
        req.method &&
        _route.url.test(req.url) &&
        _route.method == req.method
    );

    if (!req.url || !route) {
      req.statusCode = 404;
      res.end("Not Found");
      return;
    }

    const regexResult = route.url.exec(req.url);
    if (!regexResult) {
      req.statusCode = 404;
      res.end("Not Found");
      return;
    }

    /**@type {Object.<string,*> | undefined} */
    const reqBody =
      (req.headers["content-type"] === "application/json" &&
        (await new Promise((resolve, reject) => {
          req.setEncoding("utf-8");
          req.on("data", (data) => {
            try {
              resolve(JSON.parse(data));
            } catch {
              reject(new Error("Ill-formed json"));
            }
          });
        }))) ||
      undefined;

    const result = await route.callback(regexResult, reqBody);
    res.statusCode = result.statusCode;

    if (typeof result.body === "string") {
      res.end(result.body);
    } else {
      res.setHeader("Content-Type", "application/json; charset=utf-8");
      res.end(JSON.stringify(result.body));
    }
  }

  main();
});

const PORT = 4000;

server.listen(PORT, () => {
  console.log("server is listening");
});
