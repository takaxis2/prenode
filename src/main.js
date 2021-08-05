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

/**
 * @typedef Post
 * @property {string} id
 * @property {string} title
 * @property {string} content
 */

/**@type {Post[]} */
const posts = [
  {
    id: "1",
    title: "11",
    content: "111",
  },
  {
    id: "2",
    title: "22",
    content: "222",
  },
];

/**@type {Post} */
const sample = {
  id: "1",
  title: "11",
  content: "111",
};
console.log(sample);

const server = http.createServer((req, res) => {
  const POSTS_ID_REGEX = /^\/posts\/([a-zA-Z0-9-_]+)$/;
  const postIdRegexResult =
    (req.url && POSTS_ID_REGEX.exec(req.url)) || undefined;

  if (req.url === "/posts" && req.method === "GET") {
    res.statusCode = 200;
    res.end("List of post");
  } else if (postIdRegexResult) {
    const postId = postIdRegexResult[1];

    res.statusCode = 200;
    res.end("Some content of posts");
  } else if (req.url === "/posts" && req.method === "POST") {
    res.statusCode = 200;
    res.end("Creating post");
  } else {
    req.statusCode = 404;
    res.end("page not found");
  }
});

const PORT = 4000;

server.listen(PORT, () => {
  console.log("server is listening");
});
