const express = require('express');
const dotenv = require('dotenv');
const { connect } = require('./util/db');
const userRoutes = require('./Routes/users');
const ticketRoutes = require('./Routes/tickets');
const commentRoutes = require('./Routes/comments');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./util/swagger');
const authRoutes = require("./Routes/auth")

dotenv.config();
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/tickets', ticketRoutes);
app.use('/comments', commentRoutes);

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

const PORT = process.env.PORT || 3000;

async function start() {
  await connect();
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

start().catch((err) => {
  console.error(err);
  process.exit(1);
});
