"use strict";

//============================================================= Logout
module.exports.logout = (request, response) => {
    request.session.User = undefined;
    response.sendStatus(200);
}
