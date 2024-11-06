import React, { useState, useEffect } from 'react';

function TabelaAlunos({alunos}) {
    console.log("Dados no componente: ",alunos);

    if (!Array.isArray(alunos)) {
        return <div>Erro: dados de alunos inválidos.</div>;
    }
    console.log(alunos);
    let alunos1 = [
        {id_aluno: "1", nome_aluno: "Ana Silva", CPF_aluno: "qwerty1234", endereco_aluno: "ana.silva@example.com"},
        {id_aluno: "2", nome_aluno: "Carlos Oliveira", CPF_aluno: "abc12345", endereco_aluno: "carlos.oliveira@example.com"},

      ];

    return (
        <div>
            <h3>Lista de Alunos</h3>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>CPF</th>
                        <th>Nome</th>
                        <th>Endereço</th>
                        <th>Telefone</th>
                        <th>CEP</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {alunos.map((aluno, index) => (
                        <tr key={index}>
                            <td>{aluno.id_aluno}</td>
                            <td>{aluno.CPF_aluno}</td>
                            <td>{aluno.nome_aluno}</td>
                            <td>{aluno.endereco_aluno}</td>
                            <td>{aluno.telefone_aluno}</td>
                            <td>{aluno.CEP_aluno}</td>
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

export default TabelaAlunos;