import React, { useState } from 'react';

function FormularioAluno({ alunos, setAlunos }) {
  const [formData, setFormData] = useState({
    CEP_aluno: '',
    CPF_aluno: '',
    endereco_aluno: '',
    id_aluno: '',
    nome_aluno: '',
    telefone_aluno: ''
  });
  
  console.log("Dados de alunos chegando no formuário: ", alunos);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };


   const handleIncluir = () => {
    setAlunos([...alunos, formData]);
    setFormData({
      CEP_aluno: '',
      CPF_aluno: '',
      endereco_aluno: '',
      id_aluno: '',
      nome_aluno: '',
      telefone_aluno: ''
    });
  };

  const handleAtualizar = () => {
    setAlunos(alunos.map(aluno => (aluno.id_aluno === formData.id_aluno ? formData : aluno)));
    setFormData({
      CEP_aluno: '',
      CPF_aluno: '',
      endereco_aluno: '',
      id_aluno: '',
      nome_aluno: '',
      telefone_aluno: ''
    });
  };

  const handleExcluir = (id_aluno) => {
    setAlunos(alunos.filter(aluno => aluno.id_aluno !== id_aluno));
  };

  const handleCarregar = (aluno) => {
    setFormData(aluno);
  };

  return (
    <div>
      <h2>Gerenciamento de Alunos</h2>
      <form>
        <div>
          <label>Matrícula:</label>
          <input type="text" name="id_aluno" value={formData.id_aluno} onChange={handleChange} />
        </div>
        <div>
          <label>Nome:</label>
          <input type="text" name="nome_aluno" value={formData.nome_aluno} onChange={handleChange} />
        </div>
        <div>
          <label>CPF:</label>
          <input type="text" name="CPF_aluno" value={formData.CPF_aluno} onChange={handleChange} />
        </div>
        <div>
          <label>CEP:</label>
          <input type="text" name="CEP_aluno" value={formData.CEP_aluno} onChange={handleChange} />
        </div>
        <div>
          <label>Endereço:</label>
          <input type="text" name="endereco_aluno" value={formData.endereco_aluno} onChange={handleChange} />
        </div>
        <div>
          <label>Telefone:</label>
          <input type="text" name="telefone_aluno" value={formData.telefone_aluno} onChange={handleChange} />
        </div>
        <button type="button" name="action" value="incluir" onClick={handleIncluir}>Incluir</button>
        <button type="button" name="action" value="alterar" onClick={handleAtualizar}>Atualizar</button>

        {/* <button type="submit" name="action" value="alterar">Alterar</button>
        <button type="submit" name="action" value="incluir">Incluir</button> */}
      </form>

      <h3>Relação de Alunos</h3>
      <table border="1" cellPadding="5" cellSpacing="0">
        <thead>
          <tr>
            <th>Matrícula</th>
            <th>Nome</th>
            <th>CEP</th>
            <th>CPF</th>
            <th>Telefone</th>
            <th>Endereco</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {alunos.map((aluno, index) => (
            <tr key={index}>
              <td>{aluno.id_aluno}</td>
              <td>{aluno.nome_aluno}</td>
              <td>{aluno.CEP_aluno}</td>
              <td>{aluno.CPF_aluno}</td>
              <td>{aluno.endereco_aluno}</td>
              <td>{aluno.telefone_aluno}</td>
              <td>
                <button type="button" onClick={() => handleExcluir(aluno.matricula)}>
                  <img src="./public/img/dustbin-16.png" alt="Excluir - dust bin" />
                  Excluir
                </button>
                <button type="button" onClick={() => handleCarregar(aluno)}>
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

export default FormularioAluno;
