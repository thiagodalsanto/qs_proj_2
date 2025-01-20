/* eslint-disable no-undef */
const { expect } = require("chai");
const sinon = require("sinon");
const mysql = require("mysql2");
const usersHandlers = require("../scriptsV1/users-handlers.js");

describe("Testes para Users Handlers", () => {
  let mockConnection, mockRequest, mockResponse, mockConsole;

  beforeEach(() => {
    mockConnection = sinon.stub(mysql, "createConnection").returns({
      connect: sinon.stub(),
      query: sinon.stub(),
    });

    mockRequest = {
      body: {},
      params: {},
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

  describe("getUsers", () => {
    it("deve retornar uma lista de usuários", () => {
      const mockUsers = [
        {
          id: 1,
          userName: "user1",
          name: "User 1",
          email: "user1@example.com",
          roleCode: "ADMIN",
          roleDescription: "Administrator",
          TOTAL_JOBS: 2,
        },
      ];

      mockConnection.returns({
        connect: sinon.stub(),
        query: sinon.stub().callsFake((query, callback) => {
          callback(null, mockUsers);
        }),
      });

      usersHandlers.getUsers(mockRequest, mockResponse);

      expect(mockResponse.json.calledWith({ users: mockUsers })).to.be.true;
    });

    it("deve retornar uma lista vazia em caso de erro", () => {
      mockConnection.returns({
        connect: sinon.stub(),
        query: sinon.stub().callsFake((query, callback) => {
          callback(new Error("Erro de consulta"), null);
        }),
      });

      usersHandlers.getUsers(mockRequest, mockResponse);

      expect(mockResponse.json.calledWith({ users: [] })).to.be.true;
      expect(mockConsole.error.calledOnce).to.be.true;
    });
  });

  describe("createUser", () => {
    it("deve criar um usuário com sucesso", () => {
      mockRequest.body = {
        name: "User 1",
        userName: "user1",
        email: "user1@example.com",
        password: "password123",
        role: "ADMIN",
      };

      mockConnection.returns({
        connect: sinon.stub(),
        query: sinon.stub().callsFake((query, values, callback) => {
          callback(null, { affectedRows: 1 });
        }),
      });

      usersHandlers.createUser(mockRequest, mockResponse);

      expect(mockResponse.sendStatus.calledWith(200)).to.be.true;
    });

    it("deve retornar erro ao criar um usuário", () => {
      mockRequest.body = {
        name: "User 1",
        userName: "user1",
        email: "user1@example.com",
        password: "password123",
        role: "ADMIN",
      };

      mockConnection.returns({
        connect: sinon.stub(),
        query: sinon.stub().callsFake((query, values, callback) => {
          callback(new Error("Erro de criação"), null);
        }),
      });

      usersHandlers.createUser(mockRequest, mockResponse);

      expect(mockResponse.sendStatus.calledWith(500)).to.be.true;
      expect(mockConsole.error.calledOnce).to.be.true;
    });
  });

  describe("editUser", () => {
    it("deve editar um usuário com sucesso", () => {
      mockRequest.body = {
        id: 1,
        name: "Updated User",
        email: "updated@example.com",
        role: "USER",
      };

      mockConnection.returns({
        connect: sinon.stub(),
        query: sinon.stub().callsFake((query, values, callback) => {
          callback(null, { affectedRows: 1 });
        }),
      });

      usersHandlers.editUser(mockRequest, mockResponse);

      expect(mockResponse.json.calledWith({ success: true })).to.be.true;
    });

    it("deve retornar erro ao editar um usuário", () => {
      mockRequest.body = {
        id: 1,
        name: "Updated User",
        email: "updated@example.com",
        role: "USER",
      };

      mockConnection.returns({
        connect: sinon.stub(),
        query: sinon.stub().callsFake((query, values, callback) => {
          callback(new Error("Erro de edição"), null);
        }),
      });

      usersHandlers.editUser(mockRequest, mockResponse);

      expect(mockResponse.json.calledWith({ success: false })).to.be.true;
      expect(mockConsole.error.calledOnce).to.be.true;
    });
  });

  describe("deleteUser", () => {
    it("deve deletar um usuário com sucesso", () => {
      mockRequest.params = {
        id: 1,
      };

      mockConnection.returns({
        connect: sinon.stub(),
        query: sinon.stub().callsFake((query, values, callback) => {
          callback(null, { affectedRows: 1 });
        }),
      });

      usersHandlers.deleteUser(mockRequest, mockResponse);

      expect(mockResponse.sendStatus.calledWith(200)).to.be.true;
    });

    it("deve retornar erro ao deletar um usuário", () => {
      mockRequest.params = {
        id: 1,
      };

      mockConnection.returns({
        connect: sinon.stub(),
        query: sinon.stub().callsFake((query, values, callback) => {
          callback(new Error("Erro de exclusão"), null);
        }),
      });

      usersHandlers.deleteUser(mockRequest, mockResponse);

      expect(mockResponse.sendStatus.calledWith(500)).to.be.true;
      expect(mockConsole.error.calledOnce).to.be.true;
    });
  });

  describe("getPageSettings", () => {
    it("deve carregar as configurações da página com sucesso", () => {
      const mockSettings = [
        { CODE: "ADMIN", DESCRIPTION: "Administrator" },
        { CODE: "USER", DESCRIPTION: "User" },
      ];

      mockConnection.returns({
        connect: sinon.stub(),
        query: sinon.stub().callsFake((query, callback) => {
          callback(null, mockSettings);
        }),
      });

      usersHandlers.getPageSettings(mockRequest, mockResponse);

      expect(mockResponse.json.calledWith({ pageSettings: [mockSettings] })).to
        .be.true;
    });

    it("deve retornar uma lista vazia em caso de erro", () => {
      mockConnection.returns({
        connect: sinon.stub(),
        query: sinon.stub().callsFake((query, callback) => {
          callback(new Error("Erro de consulta"), null);
        }),
      });

      usersHandlers.getPageSettings(mockRequest, mockResponse);

      expect(mockResponse.json.calledWith({ pageSettings: [] })).to.be.true;
      expect(mockConsole.error.calledOnce).to.be.true;
    });
  });
});
