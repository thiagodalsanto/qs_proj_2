"use strict";
import { createConnection } from "mysql2";
import { readFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const optionsPath = join(__dirname, 'connection-options.json');
const options = JSON.parse(readFileSync(optionsPath, 'utf-8'));

export function login(request, response) {
  let connection = createConnection(options);
  connection.connect((err) => {
    if (err) {
      console.error("Error connecting to the database:", err.stack);
      response.sendStatus(500);
      return;
    }
    console.log("Connected to the database as id " + connection.threadId);
  });
  let query = `
        SELECT U.id, U.userName, U.name, U.email, 
        U.ROLE AS roleCode, ROLE_CODE.DESCRIPTION AS roleDescription 
        FROM USER U
        INNER JOIN CODES ROLE_CODE ON ROLE_CODE.CODE = U.ROLE
        WHERE (U.USERNAME = ? OR U.email = ?) AND U.PASSWORD = ?
    `;

  connection.query(
    query,
    [request.body.login, request.body.login, request.body.password],
    function (err, row) {
      if (err) {
        response.sendStatus(500);
      } else if (row.length === 0) {
        response.sendStatus(401);
      } else {
        //Add user to the session
        request.session.User = row[0];
        response.send(JSON.stringify(row[0]));
      }
    }
  );
}
