import React from 'react';
function FormularioA() {
  return (
    <div>
      <h2>Formulário A</h2>
      <form>
        <label>Nome:</label>
        <input type="text" name="nome" />
        <br />
        <label>Idade:</label>
        <input type="number" name="idade" />
        <br />
        <button type="submit">Enviar</button>
      </form>
    </div>
  );
}

function FormularioB() {
  return (
    <div>
      <h2>Formulário B</h2>
      <form>
        <label>Email:</label>
        <input type="email" name="email" />
        <br />
        <label>Telefone:</label>
        <input type="tel" name="telefone" />
        <br />
        <button type="submit">Enviar</button>
      </form>
    </div>
  );
}
export { FormularioA, FormularioB };
