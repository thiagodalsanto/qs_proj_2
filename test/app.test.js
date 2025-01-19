/* eslint-disable no-undef */
import { expect } from "chai";

import { isUserLoggedIn } from "../app.js"; // Ajuste o caminho se necessário

describe("Função isUserLoggedIn", () => {
  it("Dever retornar false para requisicao undefined", () => {
    const request = {
      session: {},
    };
    const result = isUserLoggedIn(request);
    expect(result).to.be.false;
  });

  it("Deve retornar true caso o requenst nao for undefined", () => {
    const request = {
      session: {
        User: { id: 1, name: "John Doe" },
      },
    };
    const result = isUserLoggedIn(request);
    expect(result).to.be.true;
  });
});

