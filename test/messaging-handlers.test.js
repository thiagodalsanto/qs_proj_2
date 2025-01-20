/* eslint-disable no-undef */
const { expect } = require("chai");
const sinon = require("sinon");
const mysql = require("mysql2");
const messagingHandlers = require("../scriptsV1/messaging-handlers.js");

describe("Testes para Messaging Handlers", () => {
  let mockConnection, mockRequest, mockResponse, mockConsole;

  beforeEach(() => {
    mockConnection = sinon.stub(mysql, "createConnection").returns({
      connect: sinon.stub(),
      query: sinon.stub(),
    });

    mockRequest = {
      body: {},
    };

    mockResponse = {
      json: sinon.spy(),
      sendStatus: sinon.spy(),
    };

    mockConsole = {
      error: sinon.stub(console, "error"),
      log: sinon.stub(console, "log"),
    };
  });

  afterEach(() => {
    sinon.restore();
  });

  describe("loadWebSocketSettings", () => {
    it("deve carregar as configurações do WebSocket com sucesso", () => {
      mockRequest.body = {
        id: 1,
      };

      const mockResults = [
        [
          {
            ID: 2,
            USERNAME: "user2",
            NAME: "User 2",
            EMAIL: "user2@example.com",
            ROLE: "USER",
          },
        ],
        [
          {
            MESSAGE_SENT_BY: 1,
            MESSAGE_TO_ID: 2,
            USERNAME_TO: "user2",
            MESSAGE_FROM_ID: 1,
            USERNAME_FROM: "user1",
            MESSAGE: "Hello",
            DATE_CREATED: "01-JAN-2023 12:00:00",
            SEEN: 0,
            MESSAGE_ID: 1,
          },
        ],
        [{ DATE_NOW: "01-JAN-2023" }],
      ];

      mockConnection.returns({
        connect: sinon.stub(),
        query: sinon.stub().callsFake((query, values, callback) => {
          callback(null, mockResults);
        }),
      });

      messagingHandlers.loadWebSocketSettings(mockRequest, mockResponse);

      expect(mockResponse.json.calledWith(mockResults)).to.be.true;
    });

    it("deve retornar uma lista vazia em caso de erro", () => {
      mockRequest.body = {
        id: 1,
      };

      mockConnection.returns({
        connect: sinon.stub(),
        query: sinon.stub().callsFake((query, values, callback) => {
          callback(new Error("Erro de consulta"), null);
        }),
      });

      messagingHandlers.loadWebSocketSettings(mockRequest, mockResponse);

      expect(mockResponse.json.calledWith([])).to.be.true;
      expect(mockConsole.error.calledOnce).to.be.true;
    });
  });

  describe("messagingInsertNew", () => {
    it("deve inserir uma nova mensagem com sucesso", () => {
      const message = {
        from: 1,
        to: 2,
        message: "Hello",
        seen: 0,
      };

      const mockInsertId = 1;

      mockConnection.returns({
        connect: sinon.stub(),
        query: sinon.stub().callsFake((query, values, callback) => {
          callback(null, { insertId: mockInsertId });
        }),
      });

      const callback = sinon.spy();

      messagingHandlers.messagingInsertNew(message, callback);

      expect(callback.calledWith(mockInsertId)).to.be.true;
    });

    it("deve retornar -1 em caso de erro ao inserir uma nova mensagem", () => {
      const message = {
        from: 1,
        to: 2,
        message: "Hello",
        seen: 0,
      };

      mockConnection.returns({
        connect: sinon.stub(),
        query: sinon.stub().callsFake((query, values, callback) => {
          callback(new Error("Erro de inserção"), null);
        }),
      });

      const callback = sinon.spy();

      messagingHandlers.messagingInsertNew(message, callback);

      expect(callback.calledWith(-1)).to.be.true;
      expect(mockConsole.error.calledOnce).to.be.true;
    });
  });

  describe("loadWebSocketMessages", () => {
    it("deve carregar as mensagens do WebSocket com sucesso", () => {
      mockRequest.body = {
        id: 1,
      };

      const mockMessages = [
        {
          MESSAGE_SENT_BY: 1,
          MESSAGE_TO_ID: 2,
          USERNAME_TO: "user2",
          MESSAGE_FROM_ID: 1,
          USERNAME_FROM: "user1",
          MESSAGE: "Hello",
          DATE_CREATED: "01-JAN-2023 12:00:00",
          SEEN: 0,
          MESSAGE_ID: 1,
        },
      ];

      mockConnection.returns({
        connect: sinon.stub(),
        query: sinon.stub().callsFake((query, values, callback) => {
          callback(null, mockMessages);
        }),
      });

      messagingHandlers.loadWebSocketMessages(mockRequest, mockResponse);

      expect(mockResponse.json.calledWith(mockMessages)).to.be.true;
    });

    it("deve retornar uma lista vazia em caso de erro", () => {
      mockRequest.body = {
        id: 1,
      };

      mockConnection.returns({
        connect: sinon.stub(),
        query: sinon.stub().callsFake((query, values, callback) => {
          callback(new Error("Erro de consulta"), null);
        }),
      });

      messagingHandlers.loadWebSocketMessages(mockRequest, mockResponse);

      expect(mockResponse.json.calledWith([])).to.be.true;
      expect(mockConsole.error.calledOnce).to.be.true;
    });
  });
});
