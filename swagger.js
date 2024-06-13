const options = {
  openapi: '3.0.0',
  language: 'uk-UA',
};
const swaggerAutogen = require('swagger-autogen')(options);

const doc = {
  info: {
    title: 'My API',
    description: 'Description'
  },
  host: 'localhost:3000'
};

const outputFile = './swagger-output.json';
const routes = ["./server.js"];



swaggerAutogen(outputFile, routes, doc).then(() => {
  require("./server");
});
