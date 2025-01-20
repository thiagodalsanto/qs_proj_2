/* eslint-disable no-undef */
const { expect } = require("chai");
const sinon = require("sinon");
const mysql = require("mysql2");
const authenticationHandlers = require("../scriptsV1/authentication-handlers");

describe("Testes para a função de login", () => {
  let mockConnection, mockRequest, mockResponse;

  before(() => {
    sinon.stub(mysql, "createConnection").returns({
      connect: sinon.stub(),
      query: sinon.stub(),
    });
  });

  beforeEach(() => {
    mockConnection = mysql.createConnection();
    mockRequest = {
      body: {
        login: "usuario_teste",
        senha: "senha_teste",
      },
      session: {},
    };
    mockResponse = {
      sendStatus: sinon.spy(),
      send: sinon.spy(),
    };
  });

  afterEach(() => {
    sinon.resetHistory();
  });

  after(() => {
    sinon.restore();
  });

  it("deve retornar status 500 quando ocorre um erro na conexão com o banco de dados", () => {
    mockConnection.connect.callsArgWith(0, new Error("Falha na conexão"));

    authenticationHandlers.login(mockRequest, mockResponse);

    expect(mockResponse.sendStatus.calledWith(500)).to.be.true;
  });

  it("deve retornar status 401 quando as credenciais são inválidas", () => {
    mockConnection.connect.callsArgWith(0, null);
    mockConnection.query.callsArgWith(2, null, []);

    authenticationHandlers.login(mockRequest, mockResponse);

    expect(mockResponse.sendStatus.calledWith(401)).to.be.true;
  });

  it("deve autenticar o usuário corretamente e definir a sessão quando as credenciais são válidas", () => {
    const usuarioMock = {
      id: 1,
      userName: "usuario_teste",
      name: "Usuário Teste",
      email: "teste@exemplo.com",
      roleCode: "ADMIN",
      roleDescription: "Administrador",
    };

    mockConnection.connect.callsArgWith(0, null);
    mockConnection.query.callsArgWith(2, null, [usuarioMock]);

    authenticationHandlers.login(mockRequest, mockResponse);

    expect(mockRequest.session.User).to.deep.equal(usuarioMock);
    expect(mockResponse.send.calledWith(JSON.stringify(usuarioMock))).to.be
      .true;
  });
});
