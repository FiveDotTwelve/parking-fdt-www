/* eslint-disable @typescript-eslint/no-explicit-any */
import fs from 'fs';
import path from 'path';

const TOKEN_PATH = path.join(__dirname, '../config/google/tokens.json');


export const saveToken = (userId: string, tokens: any) => {
  let data: { [key: string]: any } = {};
  
  if (fs.existsSync(TOKEN_PATH)) {
    data = JSON.parse(fs.readFileSync(TOKEN_PATH, 'utf8'));
  }
  
  data[userId] = tokens;
  
  fs.writeFileSync(TOKEN_PATH, JSON.stringify(data, null, 2));
};

// Pobierz token
export const getToken = (userId: string) => {
  if (!fs.existsSync(TOKEN_PATH)) return null;
  
  const data: { [key: string]: any } = JSON.parse(fs.readFileSync(TOKEN_PATH, 'utf8'));
  return data[userId] || null;
};