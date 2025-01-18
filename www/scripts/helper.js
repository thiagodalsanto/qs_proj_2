const chai = require('chai');
const { describe, it, beforeEach, afterEach } = require('mocha');
const sinon = require('sinon');
const { expect } = chai;

// Configura o ambiente do navegador com jsdom-global
require('jsdom-global')('<!doctype html><html><body><table id="clientsTable"></table></body></html>', {
    url: 'http://localhost', // Define uma URL para evitar erros de segurança
});

// Inicializa o jQuery com o ambiente do jsdom
const $ = require('jquery');
global.$ = $;
global.jQuery = $;

// Carrega o helper.js após configurar o ambiente
require('../../www/scripts/helper.js');

// Importa a função a ser testada
const { loadAllClients } = require('../../www/scripts/clients.js');

describe('loadAllClients', () => {
    let xhr, requests;

    beforeEach(() => {
        // Configura o Sinon para simular requisições XMLHttpRequest
        xhr = sinon.useFakeXMLHttpRequest();
        requests = [];
        xhr.onCreate = (req) => requests.push(req);
    });

    afterEach(() => {
        // Restaura o XMLHttpRequest original após cada teste
        xhr.restore();
    });

    it('should load clients and initialize DataTable', (done) => {
        const clients = [
            { id: 1, name: 'Client 1', email: 'client1@example.com', nif: '123456789', TOTAL_JOBS: 2, TOTAL_JOBS_FINALISED: 1 },
            { id: 2, name: 'Client 2', email: 'client2@example.com', nif: '987654321', TOTAL_JOBS: 3, TOTAL_JOBS_FINALISED: 2 }
        ];

        loadAllClients();

        // Simula a resposta da requisição
        requests[0].respond(200, { 'Content-Type': 'application/json' }, JSON.stringify({ clients }));

        setTimeout(() => {
            const table = $('#clientsTable').DataTable();
            expect(table.data().count()).to.equal(clients.length);
            expect(table.row(0).data().name).to.equal('Client 1');
            expect(table.row(1).data().name).to.equal('Client 2');
            done();
        }, 100);
    });

    it('should handle error and load clients from local storage', (done) => {
        const clients = [
            { id: 1, name: 'Client 1', email: 'client1@example.com', nif: '123456789', TOTAL_JOBS: 2, TOTAL_JOBS_FINALISED: 1 }
        ];

        // Simula o localStorage com Sinon
        sinon.stub(window.localStorage, 'getItem').returns(JSON.stringify(clients));

        loadAllClients();

        // Simula um erro na requisição
        requests[0].respond(500, { 'Content-Type': 'application/json' }, JSON.stringify({}));

        setTimeout(() => {
            const table = $('#clientsTable').DataTable();
            expect(table.data().count()).to.equal(clients.length);
            expect(table.row(0).data().name).to.equal('Client 1');
            window.localStorage.getItem.restore(); // Restaura o localStorage original
            done();
        }, 100);
    });
});