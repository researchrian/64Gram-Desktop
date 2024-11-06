import { useState, useEffect } from 'react';
import { FormularioA, FormularioB } from './Formularios';
import Axios from "axios";
import Navbar from './Navbar';
import './App.css'

import TabelaAlunos from './TabelaAlunos';
import FormularioAluno from './FormularioAluno';
import FormularioDisciplina from './FormularioDisciplina';

function App() {
  const [alunos, setAlunos] = useState([]);
  const [disciplinas, setDisciplinas] = useState([]);
  const [formSelecionado, setFormSelecionado] = useState(null);

  const handleFormChange = (form) => {
    setFormSelecionado(form);
  };


  const renderFormulario = () => {
    if (formSelecionado === 'formA') {
      return <FormularioA />;
    } else if (formSelecionado === 'formB') {
      return <FormularioB />;
    } else {
      return <p>Por favor, selecione um formulário na barra de navegação.</p>;
    }
  };
  


  useEffect(() => {
    // Função para buscar dados da API
    const fetchAlunos = async () => {
      try {
        const response = await Axios.get('http://localhost:4000/alunos');
        console.log("Dados no App: ",response.data.alunos);
        setAlunos(response.data.alunos); // Usar response.data.alunos se o backend enviar como { alunos: [...] }
        //setAlunos(response.data);
      } catch (error) {
        console.error('Erro ao buscar alunos:', error);
      }
    };

    fetchAlunos();
  }, []);
  console.log(alunos);
//18/09/2024
/*   useEffect(() => {
    const fetchDisciplinas = async () => {
      try {
        const response = await Axios.get('http://localhost:4000/disciplinas');
        console.log("Dados no App: ", response.data.disciplinas);
        setDisciplinas(response.data.disciplinas); // Acessa os dados no formato correto
      } catch (error) {
        console.error('Erro ao buscar disciplinas:', error);
      }
    };
  
    fetchDisciplinas();
  }, []);
    */

  useEffect(() => {
    const fetchDisciplinas = async () => {
      try {
        const response = await Axios.get('http://localhost:4000/disciplinas');
        console.log("Dados no App: ", response.data.disciplinas);
        setDisciplinas(response.data.disciplinas); // Acessa os dados no formato correto
      } catch (error) {
        console.error('Erro ao buscar disciplinas:', error);
      }
    };
  
    fetchDisciplinas();
  }, []);
  

  console.log(disciplinas);

  return (
    <>
      <div>
       <h1>Lista de Usuários</h1>
       <TabelaAlunos alunos={alunos}/>
      </div>
      <div>
        <h1>Gerenciamento de Alunos</h1>
          <FormularioAluno alunos={alunos} setAlunos={setAlunos} />
      </div>
      <div>
          <FormularioDisciplina disciplinas={disciplinas} setDisciplinas={setDisciplinas} />
      </div>
      <div>
        <h1>Renderização Condicional de Formulários</h1>
        <Navbar onFormChange={handleFormChange} />
        <div>{renderFormulario()}</div>
      </div>
  );

    </>
  )
}

export default App
