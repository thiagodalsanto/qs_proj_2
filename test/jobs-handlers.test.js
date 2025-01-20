/* eslint-disable no-undef */
const { expect } = require("chai");
const sinon = require("sinon");
const mysql = require("mysql2");
const jobsHandlers = require("../scriptsV1/jobs-handlers.js");

describe("Testes para Jobs Handlers", () => {
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

  describe("getListJobs", () => {
    it('deve retornar uma lista de jobs para o tipo "ME"', () => {
      mockRequest.body = {
        type: "ME",
        identifier: 1,
      };

      const mockJobs = [
        {
          JOB_ID: 1,
          USER_NAME_CREATED: "User 1",
          EQUIPMENT_TYPE_DESCRIPTION: "Type 1",
          STATUS_PROGRESS_DESCRIPTION: "In Progress",
        },
      ];

      mockConnection.returns({
        connect: sinon.stub(),
        query: sinon.stub().callsFake((query, values, callback) => {
          callback(null, mockJobs);
        }),
      });

      jobsHandlers.getListJobs(mockRequest, mockResponse);

      expect(mockResponse.json.calledWith({ jobs: mockJobs })).to.be.true;
    });

    it("deve retornar uma lista vazia em caso de erro", () => {
      mockRequest.body = {
        type: "ME",
        identifier: 1,
      };

      mockConnection.returns({
        connect: sinon.stub(),
        query: sinon.stub().callsFake((query, values, callback) => {
          callback(new Error("Erro de consulta"), null);
        }),
      });

      jobsHandlers.getListJobs(mockRequest, mockResponse);

      expect(mockResponse.json.calledWith({ jobs: [] })).to.be.true;
      expect(mockConsole.error.calledOnce).to.be.true;
    });
  });

  describe("getUserInfoInitState", () => {
    it("deve retornar o estado inicial da página", () => {
      const mockResults = [
        [{ CODE: "1", DESCRIPTION: "Status 1" }],
        [{ CODE: "2", DESCRIPTION: "Type 2" }],
        [{ CODE: "3", DESCRIPTION: "Procedure 3" }],
        [{ CODE: "4", DESCRIPTION: "Brand 4" }],
        [{ ID: 1, NAME: "Client 1" }],
        [{ CODE: "5", DESCRIPTION: "Priority 5" }],
      ];

      mockConnection.returns({
        connect: sinon.stub(),
        query: sinon.stub().callsFake((query, callback) => {
          callback(null, mockResults);
        }),
      });

      jobsHandlers.getUserInfoInitState(mockRequest, mockResponse);

      expect(mockResponse.json.calledWith({ initPageState: mockResults })).to.be
        .true;
    });

    it("deve retornar uma lista vazia em caso de erro", () => {
      mockConnection.returns({
        connect: sinon.stub(),
        query: sinon.stub().callsFake((query, callback) => {
          callback(new Error("Erro de consulta"), null);
        }),
      });

      jobsHandlers.getUserInfoInitState(mockRequest, mockResponse);

      expect(mockResponse.json.calledWith({ initPageState: [] })).to.be.true;
      expect(mockConsole.error.calledOnce).to.be.true;
    });
  });

  describe("editJobInfo", () => {
    it("deve atualizar as informações do job com sucesso", () => {
      mockRequest.body = {
        id: 1,
        userId: 1,
        status: "1",
        equipmentType: "Type 1",
        equipmentTypeOther: "",
        equipmentProcedure: "Procedure 1",
        equipmentProcedureOther: "",
        equipmentBrand: "Brand 1",
        notes: "Notas",
        priority: "1",
      };

      mockConnection.returns({
        connect: sinon.stub(),
        query: sinon
          .stub()
          .onFirstCall()
          .callsFake((query, values, callback) => {
            callback(null, [{ PRIORITY_NUMBER: 1, TOTAL_JOBS: 1 }]);
          })
          .onSecondCall()
          .callsFake((query, values, callback) => {
            callback(null, { affectedRows: 1 });
          }),
      });

      jobsHandlers.editJobInfo(mockRequest, mockResponse);

      expect(mockResponse.sendStatus.calledWith(200)).to.be.true;
    });

    it("deve retornar erro ao atualizar as informações do job", () => {
      mockRequest.body = {
        id: 1,
        userId: 1,
        status: "1",
        equipmentType: "Type 1",
        equipmentTypeOther: "",
        equipmentProcedure: "Procedure 1",
        equipmentProcedureOther: "",
        equipmentBrand: "Brand 1",
        notes: "Notas",
        priority: "1",
      };

      mockConnection.returns({
        connect: sinon.stub(),
        query: sinon
          .stub()
          .onFirstCall()
          .callsFake((query, values, callback) => {
            callback(new Error("Erro de consulta"), null);
          }),
      });

      jobsHandlers.editJobInfo(mockRequest, mockResponse);

      expect(mockResponse.sendStatus.calledWith(500)).to.be.true;
      expect(mockConsole.error.calledOnce).to.be.true;
    });
  });

  describe("createJob", () => {
    it("deve criar um job com sucesso", () => {
      mockRequest.body = {
        userId: 1,
        userIdClient: 1,
        status: "1",
        equipmentType: "Type 1",
        equipmentTypeOther: "",
        equipmentProcedure: "Procedure 1",
        equipmentProcedureOther: "",
        equipmentBrand: "Brand 1",
        notes: "Notas",
        priority: "1",
      };

      mockConnection.returns({
        connect: sinon.stub(),
        query: sinon
          .stub()
          .onFirstCall()
          .callsFake((query, values, callback) => {
            callback(null, [{ PRIORITY_NUMBER: 1 }]);
          })
          .onSecondCall()
          .callsFake((query, values, callback) => {
            callback(null, { affectedRows: 1 });
          }),
      });

      jobsHandlers.createJob(mockRequest, mockResponse);

      expect(mockResponse.sendStatus.calledWith(200)).to.be.true;
    });

    it("deve retornar erro ao criar um job", () => {
      mockRequest.body = {
        userId: 1,
        userIdClient: 1,
        status: "1",
        equipmentType: "Type 1",
        equipmentTypeOther: "",
        equipmentProcedure: "Procedure 1",
        equipmentProcedureOther: "",
        equipmentBrand: "Brand 1",
        notes: "Notas",
        priority: "1",
      };

      mockConnection.returns({
        connect: sinon.stub(),
        query: sinon
          .stub()
          .onFirstCall()
          .callsFake((query, values, callback) => {
            callback(new Error("Erro de consulta"), null);
          }),
      });

      jobsHandlers.createJob(mockRequest, mockResponse);

      expect(mockResponse.sendStatus.calledWith(500)).to.be.true;
      expect(mockConsole.error.calledOnce).to.be.true;
    });
  });

  describe("reopenJob", () => {
    it("deve reabrir um job com sucesso", () => {
      mockRequest.body = {
        JobId: 1,
      };

      mockConnection.returns({
        connect: sinon.stub(),
        query: sinon.stub().callsFake((query, values, callback) => {
          callback(null, { affectedRows: 1 });
        }),
      });

      jobsHandlers.reopenJob(mockRequest, mockResponse);

      expect(mockResponse.sendStatus.calledWith(200)).to.be.true;
    });

    it("deve retornar erro ao reabrir um job", () => {
      mockRequest.body = {
        JobId: 1,
      };

      mockConnection.returns({
        connect: sinon.stub(),
        query: sinon.stub().callsFake((query, values, callback) => {
          callback(new Error("Erro de reabertura"), null);
        }),
      });

      jobsHandlers.reopenJob(mockRequest, mockResponse);

      expect(mockResponse.sendStatus.calledWith(500)).to.be.true;
      expect(mockConsole.error.calledOnce).to.be.true;
    });
  });

  describe("editOrderPriority", () => {
    it("deve atualizar a prioridade dos jobs com sucesso", () => {
      mockRequest.body = {
        startRowInfo: { id: 1, priorityWork: 2 },
        endRowInfo: { id: 2, priorityWork: 1 },
      };

      mockConnection.returns({
        connect: sinon.stub(),
        query: sinon.stub().callsFake((query, values, callback) => {
          callback(null, { affectedRows: 1 });
        }),
      });

      jobsHandlers.editOrderPriority(mockRequest, mockResponse);

      expect(mockResponse.sendStatus.calledWith(200)).to.be.true;
    });

    it("deve retornar erro ao atualizar a prioridade dos jobs", () => {
      mockRequest.body = {
        startRowInfo: { id: 1, priorityWork: 2 },
        endRowInfo: { id: 2, priorityWork: 1 },
      };

      mockConnection.returns({
        connect: sinon.stub(),
        query: sinon.stub().callsFake((query, values, callback) => {
          callback(new Error("Erro de atualização"), null);
        }),
      });

      jobsHandlers.editOrderPriority(mockRequest, mockResponse);

      expect(mockResponse.sendStatus.calledWith(500)).to.be.true;
      expect(mockConsole.error.calledOnce).to.be.true;
    });
  });
});
