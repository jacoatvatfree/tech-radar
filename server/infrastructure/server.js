import express from 'express';
import cors from 'cors';
import { graphqlController } from '../controllers/graphqlController.js';
import { PORT } from '../config/serverConfig.js';

const app = express();

app.use(cors());
app.use(express.json());

app.post('/graphql', graphqlController);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
