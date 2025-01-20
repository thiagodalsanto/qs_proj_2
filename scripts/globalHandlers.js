"use strict";

//============================================================= Logout
export const logout = (request, response) => {
    request.session.User = undefined;
    response.sendStatus(200);
}
