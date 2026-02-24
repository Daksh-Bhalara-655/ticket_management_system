const jsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Ticket Management API',
      version: '1.0.0',
    },
  },
  apis: ['./Routes/*.js'],
};

module.exports = jsdoc(options);
