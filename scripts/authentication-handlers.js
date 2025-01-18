"use strict";
const mysql = require("mysql2"); // Use mysql2 para compatibilidade com MySQL 8.0+
const options = require("./connection-options.json");

module.exports.login = (request, response) => {
    let connection = mysql.createConnection(options);
    connection.connect((err) => {
        if (err) {
            response.status(500).send("Erro ao conectar ao banco de dados");
            return;
        }

        let query = `
            SELECT U.id, U.userName, U.name, U.email, 
            U.role AS roleCode, ROLE_CODE.description AS roleDescription 
            FROM user U
            INNER JOIN codes ROLE_CODE ON ROLE_CODE.code = U.role
            WHERE (U.userName = ? OR U.email = ?) AND U.password = ?
        `;

        connection.query(query, [request.body.login, request.body.login, request.body.password], function (err, results) {
            if (err) {
                response.status(500).send("Erro ao executar a query");
                connection.end();
                return;
            }

            if (results.length === 0) {
                response.status(401).send("Usuário ou senha incorretos");
                connection.end();
                return;
            }

            request.session.User = results[0];
            response.status(200).send(JSON.stringify(results[0]));
            connection.end();
        });
    });
};