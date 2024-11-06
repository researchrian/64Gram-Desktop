import React, { useState, useEffect } from 'react';
import Axios from 'axios';

function FormularioDisciplina({ disciplinas, setDisciplinas }) {
  const [formData, setFormData] = useState({
    id_disciplina: '',
    nome_disciplina: '',
    carga_horaria: '',
    descricao_disciplina: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleIncluir = () => {
    Axios.post("http://localhost:4000/editar_disciplina", {
      nome_disciplina: formData.nome_disciplina,
      carga_horaria: formData.carga_horaria,
      descricao_disciplina: formData.descricao_disciplina,
      action: "incluir",
    })
    .then((response) => {
      setDisciplinas([...disciplinas, response.data]);
      setFormData({
        id_disciplina: '',
        nome_disciplina: '',
        carga_horaria: '',
        descricao_disciplina: ''
      });
    })
    .catch((error) => {
      console.error("Erro ao incluir disciplina:", error);
    });
  };

  const handleAtualizar = () => {
    Axios.post("http://localhost:4000/editar_disciplina", {
      id_disciplina: formData.id_disciplina,
      nome_disciplina: formData.nome_disciplina,
      carga_horaria: formData.carga_horaria,
      descricao_disciplina: formData.descricao_disciplina,
      action: "alterar",
    })
    .then((response) => {
      setDisciplinas(disciplinas.map((disciplina) =>
        disciplina.id_disciplina === response.data.id_disciplina ? response.data : disciplina
      ));
      setFormData({
        id_disciplina: '',
        nome_disciplina: '',
        carga_horaria: '',
        descricao_disciplina: ''
      });
    })
    .catch((error) => {
      console.error("Erro ao atualizar disciplina:", error);
    });
  };

  const handleCarregar = (disciplina) => {
    setFormData({
      id_disciplina: disciplina.id_disciplina,
      nome_disciplina: disciplina.nome_disciplina,
      carga_horaria: disciplina.carga_horaria,
      descricao_disciplina: disciplina.descricao_disciplina
    });
  };
  
  const handleExcluir = (id_disciplina) => {
  Axios.post(`http://localhost:4000/excluir_disciplina/${id_disciplina}`)
    .then(() => {
      // Remove a disciplina excluída da lista de disciplinas no estado
      setDisciplinas(disciplinas.filter(disciplina => disciplina.id_disciplina !== id_disciplina));
    })
    .catch((error) => {
      console.error("Erro ao excluir disciplina:", error);
    });
};

  return (
    <div>
      <h2>Cadastro de Disciplinas</h2>
      <form>
        <div>
          <label>Matrícula:</label>
          <input
            type="text"
            name="id_disciplina"
            value={formData.id_disciplina || ''} // Garantir que não seja undefined
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Nome:</label>
          <input
            type="text"
            name="nome_disciplina"
            value={formData.nome_disciplina || ''} // Garantir que não seja undefined
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Carga Horária:</label>
          <input
            type="text"
            name="carga_horaria"
            value={formData.carga_horaria || ''} // Garantir que não seja undefined
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Descrição:</label>
          <input
            type="text"
            name="descricao_disciplina"
            value={formData.descricao_disciplina || ''} // Garantir que não seja undefined
            onChange={handleChange}
          />
        </div>
        <button type="button" onClick={handleIncluir}>Incluir</button>
        <button type="button" onClick={handleAtualizar}>Atualizar</button>
      </form>
      <h3>Relação de Disciplinas</h3>
      <table border="1" cellPadding="5" cellSpacing="0">
        <thead>
          <tr>
            <th>Matrícula</th>
            <th>Nome</th>
            <th>Carga Horária</th>
            <th>Descrição</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {disciplinas.map((disciplina, index) => (
            <tr key={index}>
              <td>{disciplina.id_disciplina}</td>
              <td>{disciplina.nome_disciplina}</td>
              <td>{disciplina.carga_horaria}</td>
              <td>{disciplina.descricao_disciplina}</td>
              <td>
                <button type="button" onClick={() => handleExcluir(disciplina.id_disciplina)}>
                  <img src="./public/img/dustbin-16.png" alt="Excluir - dust bin" />
                  Excluir
                </button>
                <button type="button" onClick={() => handleCarregar(disciplina)}>
                  <img src="./public/img/pencil-16.png" alt="Editar - pencil" />
                  Editar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>


    </div>
  );
}

export default FormularioDisciplina;



