const express = require("express");
const bodyParser = require('body-parser');
const app = express();
const path = require('path');
const Sequelize = require('sequelize');
const cors = require("cors");

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true}));
app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

port = 4000;

const connection = require("./database/database");
const Curso = require("./database/Curso");
const Disciplina = require("./database/Disciplina");
const Aluno = require("./database/Aluno");
const Professor = require("./database/Professor");
const Turma = require("./database/Turma");
const Usuario = require("./database/Usuario");
const Pagamentos = require("./database/Pagamentos");
const Matricula = require("./database/Matricula");  
const vw_MatriculaDisciplina = require("./database/vw_MatriculaDisciplina");
const Coordenador = require("./database/Coordenador");

const start = async () => {
  try {
    await connection.authenticate();
    console.log('Conexão estabelecida com sucesso.');

    await connection.sync({force: false});
    console.log('Tabelas sincronizadas.');
  } catch (error) {
    console.error('Não foi possivel conectar ao banco de dados: ', error);
  }
};

start();

app.get('/', (req, res) => {
  res.render('login', { message: null });
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const usuario = await Usuario.findOne({
      where: {
        email_usuario: username,
        senha_usuario: password
      }
    });

    if (usuario) {
      res.redirect('/paginainicial');
    } else {
      res.render('login', { message: 'Usuário ou senha incorretos.' });
    }
  } catch (error) {
    console.error('Erro ao executar a consulta:', error);
    res.render('login', { message: 'Erro ao processar sua solicitação.' });
  }
});

app.get('/paginainicial', (req, res) => {
  res.render('paginainicial');
});

app.get('/alunos', async (req, res) => {
  try {
    const searchQuery = req.query.search || '';
    const alunos = await Aluno.findAll({
      where: {
        nome_aluno: {
          [Sequelize.Op.like]: `%${searchQuery}%`
        }
      }
    });
    res.json({ alunos });
  } catch (error) {
    console.error('Erro ao buscar alunos:', error);
    res.status(500).send('Erro ao buscar alunos');
  }
});

app.get('/add_alunos', (req, res) => {
  res.render('add_alunos');
});

app.post('/add_alunos', async (req, res) => {
  try {
    const { CPF_aluno, nome_aluno, endereco_aluno, telefone_aluno, CEP_aluno } = req.body;
    await Aluno.create({
      nome_aluno: nome_aluno,
      CPF_aluno: CPF_aluno,
      endereco_aluno: endereco_aluno,
      telefone_aluno: telefone_aluno,
      CEP_aluno: CEP_aluno
    });
    res.redirect('/alunos'); 
  } catch (error) {
    console.error('Erro ao adicionar aluno:', error);
    res.status(500).send('Erro ao adicionar aluno');
  }
});

app.post('/delete_aluno/:id', async (req, res) => {
  const id = req.params.id;
  console.log('ID do aluno a ser excluída:', id); // Verifica o ID recebido

  try {
    const alunoEncontrado = await Aluno.findByPk(id);
    console.log('aluno encontrado:', alunoEncontrado); // Verifica se o aluno foi encontrado

    if (!alunoEncontrado) {
      return res.status(404).send('aluno não encontrada.');
    }

    await alunoEncontrado.destroy();

    res.redirect('/alunos');
  } catch (error) {
    console.error('Erro ao excluir aluno:', error);
    res.status(500).send('Erro ao excluir aluno.');
  }
});

app.post('/edit_aluno/:id', async (req, res) => {
  const id = req.params.id;
  const { nome_aluno, CPF_aluno, endereco_aluno, telefone_aluno, CEP_aluno } = req.body;

  try {
    const alunoEncontrado = await Aluno.findByPk(id);

    if (!alunoEncontrado) {
      return res.status(404).send('aluno não encontrada.');
    }

    await alunoEncontrado.update({
      nome_aluno: nome_aluno,
      CPF_aluno: CPF_aluno,
      endereco_aluno: endereco_aluno,
      telefone_aluno: telefone_aluno,
      CEP_aluno: CEP_aluno
    });

    res.sendStatus(200);
  } catch (error) {
    console.error('Erro ao atualizar aluno:', error);
    res.status(500).send('Erro ao atualizar aluno.');
  }
});

app.get('/disciplinas', async (req, res) => {
  try {
    const searchQuery = req.query.search || '';
    const disciplinas = await Disciplina.findAll({
      where: {
        nome_disciplina: {
          [Sequelize.Op.like]: `%${searchQuery}%`
        }
      }
    });
    res.render('disciplina', { disciplinas }); // A correção está aqui
  } catch (error) {
    console.error('Erro ao buscar disciplinas:', error);
    res.status(500).send('Erro ao buscar disciplinas');
  }
});


app.get('/add_disciplina', (req, res) => {
  res.render('add_disciplina');
});


app.post('/add_disciplina', async (req, res) => {
  try {
    const { nome_disciplina, carga_horaria, descricao_disciplina } = req.body;
    await Disciplina.create({
      nome_disciplina: nome_disciplina,
      carga_horaria: carga_horaria,
      descricao_disciplina: descricao_disciplina
    });
    res.redirect('/disciplinas'); // Alterado para '/disciplinas'
  } catch (error) {
    console.error('Erro ao adicionar disciplina:', error);
    res.status(500).send('Erro ao adicionar disciplina');
  }
});


app.post('/edit_disciplina/:id', async (req, res) => {
  const id = req.params.id;
  const { nome_disciplina, carga_horaria, descricao_disciplina } = req.body;

  try {
    const disciplinaEncontrada = await Disciplina.findByPk(id);

    if (!disciplinaEncontrada) {
      return res.status(404).send('Disciplina não encontrada.');
    }

      await disciplinaEncontrada.update({
      nome_disciplina: nome_disciplina,
      carga_horaria: carga_horaria,
      descricao_disciplina: descricao_disciplina
    });

    res.sendStatus(200);
  } catch (error) {
    console.error('Erro ao atualizar disciplina:', error);
    res.status(500).send('Erro ao atualizar disciplina.');
  }
});

app.post('/delete_disciplina/:id', async (req, res) => {
  const id = req.params.id;
  console.log('ID da disciplina a ser excluída:', id); // Verifica o ID recebido

  try {
    const disciplinaEncontrada = await Disciplina.findByPk(id);

    console.log('Disciplina encontrada:', disciplinaEncontrada); // Verifica se a disciplina foi encontrada

    if (!disciplinaEncontrada) {
      return res.status(404).send('Disciplina não encontrada.');
    }

    await disciplinaEncontrada.destroy();

    res.redirect('/disciplinas');
  } catch (error) {
    console.error('Erro ao excluir disciplina:', error);
    res.status(500).send('Erro ao excluir disciplina.');
  }
});

app.get('/cursos', async (req, res) => {
  try {
      const searchQuery = req.query.search || '';
      const cursos = await Curso.findAll({
          where: {
              nome_curso: {
                  [Sequelize.Op.like]: `%${searchQuery}%`
              }
          }
      });
      res.render('cursos', { cursos });
  } catch (error) {
      console.error('Erro ao buscar cursos:', error);
      res.status(500).send('Erro ao buscar cursos');
  }
});

app.get('/add_curso', (req, res) => {
  res.render('add_curso');
});

app.post('/add_curso', async (req, res) => {
  const { nome_curso } = req.body;
  await Curso.create({ nome_curso });
  res.redirect('/cursos');
});

app.post('/edit_curso/:id', async (req, res) => {
  const { id } = req.params;
  const { nome_curso } = req.body;
  await Curso.update({ nome_curso }, { where: { id_curso: id } });
  res.sendStatus(200);
});

app.post('/delete_curso/:id', async (req, res) => {
  const { id } = req.params;
  await Curso.destroy({ where: { id_curso: id } });
  res.redirect('/cursos');
});

app.get('/professores', async (req, res) => {
  try {
      const searchQuery = req.query.search || '';
      const professores = await Professor.findAll({
          where: {
              nome_professor: {
                  [Sequelize.Op.like]: `%${searchQuery}%`
              }
          }
      });
      res.render('professores', { professores });
  } catch (error) {
      console.error('Erro ao buscar professores:', error);
      res.status(500).send('Erro ao buscar professores');
  }
});

app.get('/add_professor', (req, res) => {
  res.render('add_professor');
});

app.post('/add_professor', async (req, res) => {
  const { CPF_professor, nome_professor, telefone_professor, endereço_professor, CEP_professor } = req.body;
  await Professor.create({ CPF_professor, nome_professor, telefone_professor, endereço_professor, CEP_professor });
  res.redirect('/professores');
});

app.post('/edit_professor/:id', async (req, res) => {
  const { id } = req.params;
  const { CPF_professor, nome_professor, telefone_professor, endereço_professor, CEP_professor } = req.body;
  await Professor.update({ CPF_professor, nome_professor, telefone_professor, endereço_professor, CEP_professor }, { where: { id_professor: id } });
  res.sendStatus(200);
});

// Rota para deletar um professor
app.post('/delete_professor/:id', async (req, res) => {
  const { id } = req.params;
  await Professor.destroy({ where: { id_professor: id } });
  res.redirect('/professores');
});

app.get('/turmas', async (req, res) => {
  try {
      const searchQuery = req.query.search || '';
      const turmas = await Turma.findAll({
          where: {
              sala: {
                  [Sequelize.Op.like]: `%${searchQuery}%`
              }
          }
      });
      res.render('turmas', { turmas });
  } catch (error) {
      console.error('Erro ao buscar turmas:', error);
      res.status(500).send('Erro ao buscar turmas');
  }
});

app.get('/add_turma', (req, res) => {
  res.render('add_turma');
});

app.post('/add_turma', async (req, res) => {
  const { sala, horario, periodo } = req.body;
  await Turma.create({ sala, horario, periodo });
  res.redirect('/turmas');
});

app.post('/edit_turma/:id', async (req, res) => {
  const { id } = req.params;
  const { sala, horario, periodo } = req.body;
  await Turma.update({ sala, horario, periodo }, { where: { id_turma: id } });
  res.sendStatus(200);
});

app.post('/delete_turma/:id', async (req, res) => {
  const { id } = req.params;
  await Turma.destroy({ where: { id_turma: id } });
  res.redirect('/turmas');
});

app.get('/matriculas', async (req, res) => {
  try {
      const matriculas = await Matricula.findAll({
          include: [
              { model: Aluno, as: 'Aluno' },
              { model: Curso, as: 'Curso' }
          ]
      });
      res.render('matriculas', { matriculas });
  } catch (error) {
      console.error('Erro ao buscar matrículas:', error);
      res.status(500).send('Erro ao buscar matrículas');
  }
});

app.get('/add_matricula', async (req, res) => {
  try {
      const alunos = await Aluno.findAll(); // Buscando todos os alunos
      const cursos = await Curso.findAll(); // Buscando todos os cursos
      res.render('add_matricula', { alunos, cursos });
  } catch (error) {
      console.error('Erro ao buscar alunos e cursos:', error);
      res.status(500).send('Erro ao buscar alunos e cursos');
  }
});

app.post('/add_matricula', async (req, res) => {
  const { id_aluno, id_curso } = req.body;
  await Matricula.create({ id_aluno, id_curso });
  res.redirect('/matriculas');
});

app.post('/delete_matricula/:id', async (req, res) => {
  try {
      const id = req.params.id;
      await Matricula.destroy({ where: { id_matricula: id } });
      res.redirect('/matriculas');
  } catch (error) {
      console.error('Erro ao excluir matrícula:', error);
      res.status(500).send('Erro ao excluir matrícula');
  }
});

app.get('/coordenadores', async (req, res) => {
  try {
      const search = req.query.search || '';
      const coordenadores = await Coordenador.findAll({
          where: {
              nome_coordenador: {
                  [Sequelize.Op.like]: `%${search}%`
              }
          }
      });
      res.render('coordenadores', { coordenadores });
  } catch (error) {
      console.error('Erro ao buscar coordenadores:', error);
      res.status(500).send('Erro ao buscar coordenadores');
  }
});

app.get('/add_coordenador', (req, res) => {
  res.render('add_coordenador');
});

app.post('/add_coordenador', async (req, res) => {
  try {
      const { CPF_coordenador, nome_coordenador, telefone_coordenador, endereco_coordenador, CEP_coordenador } = req.body;
      await Coordenador.create({
          CPF_coordenador,
          nome_coordenador,
          telefone_coordenador,
          endereco_coordenador,
          CEP_coordenador,
      });
      res.redirect('/coordenadores');
  } catch (error) {
      console.error('Erro ao adicionar coordenador:', error);
      res.status(500).send('Erro ao adicionar coordenador');
  }
});

app.post('/edit_coordenador/:id', async (req, res) => {
  try {
      const { id } = req.params;
      const { CPF_coordenador, nome_coordenador, telefone_coordenador, endereco_coordenador, CEP_coordenador } = req.body;
      await Coordenador.update(
          { CPF_coordenador, nome_coordenador, telefone_coordenador, endereco_coordenador, CEP_coordenador },
          { where: { id_coordenador: id } }
      );
      res.sendStatus(200);
  } catch (error) {
      console.error('Erro ao editar coordenador:', error);
      res.status(500).send('Erro ao editar coordenador');
  }
});

app.post('/delete_coordenador/:id', async (req, res) => {
  try {
      const { id } = req.params;
      await Coordenador.destroy({ where: { id_coordenador: id } });
      res.redirect('/coordenadores');
  } catch (error) {
      console.error('Erro ao excluir coordenador:', error);
      res.status(500).send('Erro ao excluir coordenador');
  }
});

Pagamentos.belongsTo(Aluno, { foreignKey: 'id_aluno' });
Aluno.hasMany(Pagamentos, { foreignKey: 'id_aluno' });

app.get('/pagamentos', async (req, res) => {
  try {
      const pagamentos = await Pagamentos.findAll({
          include: [
              { model: Aluno, as: 'Aluno' }
          ]
      });
      res.render('pagamentos', { pagamentos });
  } catch (error) {
      console.error('Erro ao buscar pagamentos:', error);
      res.status(500).send('Erro ao buscar pagamentos');
  }
});

app.get('/add_pagamento', async (req, res) => {
  try {
      const alunos = await Aluno.findAll();
      res.render('add_pagamento', { alunos });
  } catch (error) {
      console.error('Erro ao buscar alunos:', error);
      res.status(500).send('Erro ao buscar alunos');
  }
});

app.post('/add_pagamento', async (req, res) => {
  try {
      const { valor, descricao, data_pagamento, id_aluno } = req.body;
      await Pagamentos.create({ valor, descricao, data_pagamento, id_aluno });
      res.redirect('/pagamentos');
  } catch (error) {
      console.error('Erro ao adicionar pagamento:', error);
      res.status(500).send('Erro ao adicionar pagamento');
  }
});

app.post('/delete_pagamento/:id', async (req, res) => {
  try {
      const id = req.params.id;
      await Pagamentos.destroy({ where: { id_pagamento: id } });
      res.redirect('/pagamentos');
  } catch (error) {
      console.error('Erro ao excluir pagamento:', error);
      res.status(500).send('Erro ao excluir pagamento');
  }
});

app.get('/matriculas_disciplina', async (req, res) => {
  try {
    const matriculas = await vw_MatriculaDisciplina.findAll({
      include: [
        { model: Aluno, as: 'Aluno' },
        { model: Disciplina, as: 'Disciplina' },
        { model: Turma, as: 'Turma' }
      ]
    });
    res.render('matriculas_disciplina', { matriculas });
  } catch (error) {
    console.error('Erro ao buscar matrículas por disciplina:', error);
    res.status(500).send('Erro ao buscar matrículas por disciplina');
  }
});

app.get('/add_matricula_disciplina', async (req, res) => {
  try {
    const alunos = await Aluno.findAll();
    const disciplinas = await Disciplina.findAll();
    const turmas = await Turma.findAll();
    res.render('add_matricula_disciplina', { alunos, disciplinas, turmas });
  } catch (error) {
    console.error('Erro ao buscar dados para adicionar matrícula:', error);
    res.status(500).send('Erro ao buscar dados');
  }
});

app.post('/add_matricula_disciplina', async (req, res) => {
  const { id_aluno, id_disciplina, id_turma } = req.body;
  try {
    await vw_MatriculaDisciplina.create({
      id_aluno: id_aluno,
      id_disciplina: id_disciplina,
      id_turma: id_turma
    });
    res.redirect('/matriculas_disciplina');
  } catch (error) {
    console.error('Erro ao adicionar matrícula:', error);
    res.status(500).send('Erro ao adicionar matrícula');
  }
});

app.post('/delete_matricula_disciplina/:id', async (req, res) => {
  const idMatricula = req.params.id;

  try {
      await vw_MatriculaDisciplina.destroy({ where: { id: idMatricula } });

      res.redirect('/matriculas_disciplina');
  } catch (error) {
      console.error('Erro ao excluir matrícula por disciplina:', error);
      res.status(500).send('Erro ao excluir matrícula por disciplina');
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
