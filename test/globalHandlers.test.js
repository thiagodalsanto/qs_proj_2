/* eslint-disable no-undef */
const { expect } = require("chai");
const sinon = require("sinon");
const globalHandlers = require("../scriptsV1/globalHandlers.js");

describe("Testes para a função logout", () => {
  let mockRequest, mockResponse;

  beforeEach(() => {
    mockRequest = {
      session: {
        User: { id: 1, name: "John Doe" },
      },
    };

    mockResponse = {
      sendStatus: sinon.spy(),
    };
  });

  it("deve remover o usuário da sessão e retornar status 200", () => {
    globalHandlers.logout(mockRequest, mockResponse);

    expect(mockRequest.session.User).to.be.undefined;
    expect(mockResponse.sendStatus.calledWith(200)).to.be.true;
  });
});
