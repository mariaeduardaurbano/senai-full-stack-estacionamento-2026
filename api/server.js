  require('dotenv').config();
  const express = require('express');
  const cors = require("cors");

  const app = express();
  app.use(express.json());
  app.use(cors());

  const automovelRoutes = require('./src/routes/automovel.controller');
  const estadiaRoutes = require('./src/routes/estadia.controller');

  app.use('/automovel', automovelRoutes);
  app.use('/estadia', estadiaRoutes);

  const PORT = process.env.PORT || 3000;

  app.listen(PORT, () => {
    console.log(`Servidor rodando na http://localhost:${PORT}`);
  });
