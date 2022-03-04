const server = require("./app");

server.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
