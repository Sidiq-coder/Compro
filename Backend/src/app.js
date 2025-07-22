import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import pinoHttp from 'pino-http';
import logger from './utils/logger.js';
import { errorHandler } from './middlewares/error.js';
import { notFound } from './middlewares/notfound.js';
import userRoutes from './routes/user.js';
import departmentRoute from "./routes/departement.js";
import divisionRoute from "./routes/division.js";
import authRoutes from './routes/auth.js';
import requestLogger from './middlewares/requestLogger.js';
import { apiLimiter } from './middlewares/rateLimitter.js';


const app = express();

app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(apiLimiter);
app.use(requestLogger);


// ... routes ...
app.use('/api/users', userRoutes);
app.use("/api/departments", departmentRoute);
app.use("/api/divisions", divisionRoute);
app.use('/api/auth', authRoutes);


app.use(notFound);
app.use(errorHandler);

export default app;
