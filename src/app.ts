import { receiver } from './config/slack';
import { CommandManager } from './slack';
import authRouter from './routes';
import express from 'express';
import path from 'path';

receiver.app.use('/api', authRouter);

CommandManager();

receiver.app.use(express.static(path.join(__dirname, 'public')));

receiver.app.set('views', path.join(__dirname, 'views'));
receiver.app.set('view engine', 'ejs');

export default receiver.app;

