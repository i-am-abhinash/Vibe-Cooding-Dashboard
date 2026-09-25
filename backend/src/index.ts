import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import routes from './routes';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.use('/api', routes);

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Backend server running on http://localhost:${port}`);
});
