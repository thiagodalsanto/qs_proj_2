// import { expect } from "chai";
import sinon from "sinon";
import mysql from "mysql2";
import {
  getClients,
  editClient,
  deleteClient,
  createClient,
} from "../scripts/clients-handlers.js"; // Ajuste o caminho conforme necessário

describe("Funções de Clientes", () => {
  let connectionStub, request, response;

  beforeEach(() => {
    // Stub da função createConnection
    connectionStub = sinon.stub(mysql, "createConnection").returns({
      connect: sinon.stub(),
      query: sinon.stub(),
      end: sinon.stub(),
    });

    // Configuração do request e response
    request = {
      body: {},
      params: {},
    };
    response = {
      json: sinon.spy(),
      sendStatus: sinon.spy(),
    };
  });

  afterEach(() => {
    sinon.restore(); // Restaura os stubs após cada teste
  });

  describe("getClients", () => {
    it("deve retornar a lista de clientes", () => {
      const mockClients = [
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
        {
          id: 2,
          name: "Client 2",
          address: "Address 2",
          postCode: "67890",
          email: "client2@example.com",
          nif: "987654321",
          TOTAL_JOBS: 1,
          TOTAL_JOBS_FINALISED: 0,
        },
      ];

      // Configura o stub de query para retornar os clientes
      connectionStub.returns({
        connect: sinon.stub().callsArgWith(0, null),
        query: sinon.stub().callsArgWith(1, null, mockClients),
        end: sinon.stub(),
      });

      getClients(request, response);

      // Verifica se a resposta contém a lista de clientes
      expect(response.json.calledWith({ clients: mockClients })).to.be.true;
    });

    it("deve retornar uma lista vazia em caso de erro", () => {
      // Configura o stub de query para simular um erro
      connectionStub.returns({
        connect: sinon.stub().callsArgWith(0, null),
        query: sinon
          .stub()
          .callsArgWith(1, new Error("Erro de banco de dados"), null),
        end: sinon.stub(),
      });

      getClients(request, response);

      // Verifica se a resposta contém uma lista vazia
      expect(response.json.calledWith({ clients: [] })).to.be.true;
    });
  });

  describe("editClient", () => {
    it("deve atualizar um cliente com sucesso", () => {
      request.body = {
        id: 1,
        name: "Updated Client",
        address: "Updated Address",
        postCode: "54321",
        email: "updated@example.com",
        nif: "123456789",
      };

      // Configura o stub de query para simular uma atualização bem-sucedida
      connectionStub.returns({
        connect: sinon.stub().callsArgWith(0, null),
        query: sinon.stub().callsArgWith(2, null),
        end: sinon.stub(),
      });

      editClient(request, response);

      // Verifica se a resposta indica sucesso
      expect(response.json.calledWith({ success: true })).to.be.true;
    });

    it("deve retornar sucesso false em caso de erro", () => {
      request.body = {
        id: 1,
        name: "Updated Client",
        address: "Updated Address",
        postCode: "54321",
        email: "updated@example.com",
        nif: "123456789",
      };

      // Configura o stub de query para simular um erro
      connectionStub.returns({
        connect: sinon.stub().callsArgWith(0, null),
        query: sinon
          .stub()
          .callsArgWith(2, new Error("Erro de banco de dados")),
        end: sinon.stub(),
      });

      editClient(request, response);

      // Verifica se a resposta indica falha
      expect(response.json.calledWith({ success: false })).to.be.true;
    });
  });

  describe("deleteClient", () => {
    it("deve deletar um cliente com sucesso", () => {
      request.params = { id: 1 };

      // Configura o stub de query para simular uma exclusão bem-sucedida
      connectionStub.returns({
        connect: sinon.stub().callsArgWith(0, null),
        query: sinon.stub().callsArgWith(1, null),
        end: sinon.stub(),
      });

      deleteClient(request, response);

      // Verifica se o status 200 foi enviado
      expect(response.sendStatus.calledWith(200)).to.be.true;
    });

    it("deve retornar status 500 em caso de erro", () => {
      request.params = { id: 1 };

      // Configura o stub de query para simular um erro
      connectionStub.returns({
        connect: sinon.stub().callsArgWith(0, null),
        query: sinon
          .stub()
          .callsArgWith(1, new Error("Erro de banco de dados")),
        end: sinon.stub(),
      });

      deleteClient(request, response);

      // Verifica se o status 500 foi enviado
      expect(response.sendStatus.calledWith(500)).to.be.true;
    });
  });

  describe("createClient", () => {
    it("deve criar um cliente com sucesso", () => {
      request.body = {
        name: "New Client",
        address: "New Address",
        postCode: "12345",
        email: "new@example.com",
        nif: "123456789",
      };

      // Configura o stub de query para simular uma criação bem-sucedida
      connectionStub.returns({
        connect: sinon.stub().callsArgWith(0, null),
        query: sinon.stub().callsArgWith(1, null),
        end: sinon.stub(),
      });

      createClient(request, response);

      // Verifica se o status 200 foi enviado
      expect(response.sendStatus.calledWith(200)).to.be.true;
    });

    it("deve retornar status 500 em caso de erro", () => {
      request.body = {
        name: "New Client",
        address: "New Address",
        postCode: "12345",
        email: "new@example.com",
        nif: "123456789",
      };

      // Configura o stub de query para simular um erro
      connectionStub.returns({
        connect: sinon.stub().callsArgWith(0, null),
        query: sinon
          .stub()
          .callsArgWith(1, new Error("Erro de banco de dados")),
        end: sinon.stub(),
      });

      createClient(request, response);

      // Verifica se o status 500 foi enviado
      expect(response.sendStatus.calledWith(500)).to.be.true;
    });
  });
});
