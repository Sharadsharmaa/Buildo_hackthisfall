const swaggerUI = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");

const options = {
    definition: {
      openapi: "3.0.0",
      info: {
        title: "Library API",
        version: "1.0.0",
        description: "A simple Express Library API"
      },
      servers: [
        {
          url: "http://localhost:3001"
        }
      ]
    },
    apis: ["./models/*.js","./controllers/account/*.js"]
  };

const specs = swaggerJsDoc(options);

module.exports={
    swaggerUI,
    specs
}
