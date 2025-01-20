"use strict";
import express from "express";
import { getClients, editClient, deleteClient, createClient } from "./scripts/clients-handlers.js";
import { getUsers, getPageSettings, createUser, editUser, deleteUser } from "./scripts/users-handlers.js";
import { login } from "./scripts/authentication-handlers.js";
import { logout } from "./scripts/globalHandlers.js";
import { getListJobs, createJob, getUserInfoInitState, reopenJob, editJobInfo, editOrderPriority } from "./scripts/jobs-handlers.js";
import { loadWebSocketSettings, loadWebSocketMessages, messagingInsertNew } from "./scripts/messaging-handlers.js";
import bodyParser from "body-parser"; // Default import
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
import session from "express-session";
import { join } from "path";
import { existsSync } from 'fs';

import { createServer } from "http"; 
import { server as WebSocketServer } from 'websocket';

// Destructure json and urlencoded from bodyParser
const { json, urlencoded } = bodyParser;

app.use(json());

app.use(session({
    secret: "ThisIsOurSecretKeyToGenerateSessionButWeShouldUseUUID",
    saveUninitialized:true,
    //cookie: { maxAge: oneDay },
    resave: false
}));

const homePage = "/home.html";

function isUserLoggedIn(request){
    const user = request.session.User;
    //console.log(user);
    return user === undefined ? false : true;
}

app.use((request, response, next) => {
    let url = request.url;

    if (url.match(/\//gi).length > 1) {
        next();
        return;
    }

    if (!isUserLoggedIn(request)) {
        if (url !== "/login.html") {
            response.redirect("/login.html");
            return;
        }
        next();
        return;
    }

    if (url === "/login.html" || url === "/") {
        response.redirect(homePage);
        return;
    }

    const currentPath = join(__dirname, "www", url);
    if (!existsSync(currentPath)) {
        response.redirect("/login.html");
        return;
    }

    next();
});


app.use(urlencoded({ extended: true }));
app.use(express.static("www"));

//============================================================= Ajax Messinging
app.post("/api/loadWebSocketSettings", loadWebSocketSettings);
app.post("/api/loadWebSocketMessages", loadWebSocketMessages);



//============================================================= Ajax Client Page
app.get("/api/getClients", getClients);
app.put("/api/editClient", editClient);
app.delete("/api/deleteClient/:id", deleteClient);
app.post("/api/createClient", createClient);

//============================================================= Ajax Users Page
app.get("/api/getUsers", getUsers);
app.get("/api/getPageSettings", getPageSettings);
app.post("/api/createUser", createUser);
app.put("/api/editUser", editUser);
app.delete("/api/deleteUser/:id", deleteUser);

//============================================================= Ajax Login Page
app.post("/api/login", login);


//============================================================= Ajax Home Page
app.post("/api/getListJobs", getListJobs);
app.post("/api/createJob", createJob);
app.get("/api/getUserInfoInitState", getUserInfoInitState);
app.put("/api/reopenJob", reopenJob);
app.put("/api/editJobInfo", editJobInfo);
app.put("/api/editOrderPriority", editOrderPriority);


//============================================================= Ajax Global
app.get("/api/logout", logout);


app.listen(8081, function () {
    // eslint-disable-next-line no-undef
    console.log("Server running at http://localhost:8081");
});

const server = createServer(function () { });
server.listen(7071);

const wsServer = new WebSocketServer({
    httpServer: server,
    autoAcceptConnections:false
});

var webSocketClients = [];

wsServer.on("request", (request) => {
    let client = request.accept(null, request.origin);

    client.on('message', function(messageType){
        //console.log(messageType);
        if(messageType.type !== "utf8"){
            return;
        }

        const message = JSON.parse(messageType.utf8Data);
  
        if (message.type === "connection") {
            connectClient(message, client);
        }
        else if (message.type === "send") {
            connectMessage(message);
        }
    });

    client.on('close', function() {
        disconnectClient(client);
    });
});

function connectMessage(message){
    const idToSendMessage = message.to;
    let client = findClientById(idToSendMessage);
    if (client === null) {
        messagingInsertNew(message, ()=> {});
        return;
    }
    messagingInsertNew(message, (row)=> {
        if (row === -1) {
            return;
        }
        client.client.send(JSON.stringify({ type: "received", id: message.from }));
    });
}

function connectClient(message, client){
    const foundClient = findClientById(message.id);

    if (foundClient !== null) {
        return;
    }

    if (message.id === undefined) {
        return;
    }

    webSocketClients.push({
        id: message.id,
        client: client
    });
}

function findClientById(id) {
    const index = webSocketClients.findIndex(c => c.id === id);

    if (index === -1) {
        return null;
    }

    return webSocketClients[index];
}

function disconnectClient(client){
    const index = webSocketClients.findIndex(c => c.client === client);

    if (index === -1) {
        return;
    }

    webSocketClients.splice(index, 1);
}




