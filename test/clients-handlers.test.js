/* eslint-disable no-undef */
const { expect } = require("chai");
const sinon = require("sinon");
const mysql = require("mysql2");
const clientsHandlers = require("../scriptsV1/clients-handlers.js");

describe("Testes para Clients Handlers", () => {
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

  describe("getClients", () => {
    it("deve retornar uma lista de clientes", () => {
      const clientsMock = [
        {
          id: 1,
          name: "Client 1",
          address: "Address 1",
          postCode: "12345",
          email: "client1@example.com",
          nif: "123456789",
          TOTAL_JOBS: 2,
          TOTAL_JOBS_FINALISED: 1,
        },
      ];

      mockConnection.returns({
        connect: sinon.stub(),
        query: sinon.stub().callsFake((query, callback) => {
          callback(null, clientsMock);
        }),
      });

      clientsHandlers.getClients(mockRequest, mockResponse);

      expect(mockResponse.json.calledWith({ clients: clientsMock })).to.be.true;
    });

    it("deve retornar uma lista vazia em caso de erro", () => {
      mockConnection.returns({
        connect: sinon.stub(),
        query: sinon.stub().callsFake((query, callback) => {
          callback(new Error("Erro de consulta"), null);
        }),
      });

      clientsHandlers.getClients(mockRequest, mockResponse);

      expect(mockResponse.json.calledWith({ clients: [] })).to.be.true;
      expect(mockConsole.error.calledOnce).to.be.true;
    });
  });

  describe("editClient", () => {
    it("deve atualizar um cliente com sucesso", () => {
      mockRequest.body = {
        id: 1,
        name: "Updated Client",
        address: "Updated Address",
        postCode: "54321",
        email: "updated@example.com",
        nif: "987654321",
      };

      mockConnection.returns({
        connect: sinon.stub(),
        query: sinon.stub().callsFake((query, values, callback) => {
          callback(null, { affectedRows: 1 });
        }),
      });

      clientsHandlers.editClient(mockRequest, mockResponse);

      expect(mockResponse.json.calledWith({ success: true })).to.be.true;
    });

    it("deve retornar erro ao atualizar um cliente", () => {
      mockRequest.body = {
        id: 1,
        name: "Updated Client",
        address: "Updated Address",
        postCode: "54321",
        email: "updated@example.com",
        nif: "987654321",
      };

      mockConnection.returns({
        connect: sinon.stub(),
        query: sinon.stub().callsFake((query, values, callback) => {
          callback(new Error("Erro de atualização"), null);
        }),
      });

      clientsHandlers.editClient(mockRequest, mockResponse);

      expect(mockResponse.json.calledWith({ success: false })).to.be.true;
      expect(mockConsole.error.calledOnce).to.be.true;
    });
  });

  describe("deleteClient", () => {
    it("deve deletar um cliente com sucesso", () => {
      mockRequest.params = { id: 1 };

      mockConnection.returns({
        connect: sinon.stub(),
        query: sinon.stub().callsFake((query, values, callback) => {
          callback(null, { affectedRows: 1 });
        }),
      });

      clientsHandlers.deleteClient(mockRequest, mockResponse);

      expect(mockResponse.sendStatus.calledWith(200)).to.be.true;
    });

    it("deve retornar erro ao deletar um cliente", () => {
      mockRequest.params = { id: 1 };

      mockConnection.returns({
        connect: sinon.stub(),
        query: sinon.stub().callsFake((query, values, callback) => {
          callback(new Error("Erro de exclusão"), null);
        }),
      });

      clientsHandlers.deleteClient(mockRequest, mockResponse);

      expect(mockResponse.sendStatus.calledWith(500)).to.be.true;
      expect(mockConsole.error.calledOnce).to.be.true;
    });
  });

  describe("createClient", () => {
    it("deve criar um cliente com sucesso", () => {
      mockRequest.body = {
        name: "New Client",
        address: "New Address",
        postCode: "12345",
        email: "new@example.com",
        nif: "123456789",
      };

      mockConnection.returns({
        connect: sinon.stub(),
        query: sinon.stub().callsFake((query, values, callback) => {
          callback(null, { affectedRows: 1 });
        }),
      });

      clientsHandlers.createClient(mockRequest, mockResponse);

      expect(mockResponse.sendStatus.calledWith(200)).to.be.true;
    });

    it("deve retornar erro ao criar um cliente", () => {
      mockRequest.body = {
        name: "New Client",
        address: "New Address",
        postCode: "12345",
        email: "new@example.com",
        nif: "123456789",
      };

      mockConnection.returns({
        connect: sinon.stub(),
        query: sinon.stub().callsFake((query, values, callback) => {
          callback(new Error("Erro de criação"), null);
        }),
      });

      clientsHandlers.createClient(mockRequest, mockResponse);

      expect(mockResponse.sendStatus.calledWith(500)).to.be.true;
      expect(mockConsole.error.calledOnce).to.be.true;
    });
  });
});
