const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const router = express.Router();
const path = require("path");
const Sequelize = require("sequelize");
const cors = require("cors");
  
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, "public")));

port = 4000;

const Aluno = require("./database/Aluno");
const Disciplina = require("./database/Disciplina");
const connection = require("./database/database");

const start = async () => {
  try {
    await connection.authenticate();
    console.log("Conexão estabelecida com sucesso.");

    await connection.sync({ force: false });
    console.log("Tabelas sincronizadas.");
  } catch (error) {
    console.error("Não foi possivel conectar ao banco de dados: ", error);
  }
};

start();

app.get("/alunos", async (req, res) => {
  try {
    const searchQuery = req.query.search || "";
    const alunos = await Aluno.findAll({
      where: {
        nome_aluno: {
          [Sequelize.Op.like]: `%${searchQuery}%`,
        },
      },
    });
    console.log("Dados na rota origem: ", alunos);
    res.json({ alunos });
  } catch (error) {
    console.error("Erro ao buscar alunos:", error);
    res.status(500).send("Erro ao buscar alunos");
  }
});

router.get("/disciplinas", async (req, res) => {
  try {
    const disciplinas = await Disciplina.findAll({
      raw: true,
      order: [["id_disciplina", "DESC"]],
    });

    if (!disciplinas || disciplinas.length === 0) {
      return res
        .status(404)
        .json({ message: "Nenhuma disciplina encontrada." });
    }

    res.status(200).json({ disciplinas });
  } catch (error) {
    console.error("Erro ao buscar disciplinas no servidor:", error); // Log do erro
    res.status(500).json({ error: "Erro ao buscar disciplinas no servidor." });
  }
});

app.post("/editar_disciplina", async (req, res) => {
  const { nome_disciplina, carga_horaria, descricao_disciplina, action } =
    req.body;

  if (action === "incluir") {
    try {
      const disciplina = await Disciplina.create({
        nome_disciplina,
        carga_horaria,
        descricao_disciplina,
      });
      res.status(201).json(disciplina); // Envia a disciplina criada
    } catch (error) {
      console.error("Erro ao inserir dados PARA A DISCIPLINA:", error);
      res
        .status(500)
        .json({ error: "Erro ao inserir dados PARA A DISCIPLINA." });
    }
  }

  if (action === "alterar") {
    try {
      const { id_disciplina } = req.body;
      const disciplina = await Disciplina.findByPk(id_disciplina);
      if (!disciplina) {
        return res
          .status(404)
          .json({
            error: `Disciplina NÃO FOI encontrada - ID: ${id_disciplina}.`,
          });
      }
      disciplina.nome_disciplina = nome_disciplina;
      disciplina.carga_horaria = carga_horaria;
      disciplina.descricao_disciplina = descricao_disciplina;
      await disciplina.save();
      res.status(200).json(disciplina); // Envia a disciplina alterada
    } catch (error) {
      console.error(
        `Erro ao ALTERAR dados PARA A DISCIPLINA: ${nome_disciplina}`,
        error
      );
      res
        .status(500)
        .json({
          error: `Erro ao ALTERAR dados PARA A DISCIPLINA: ${nome_disciplina}`,
        });
    }
  }
});

app.post("/excluir_disciplina/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const disciplina = await Disciplina.findByPk(id);
    if (!disciplina) {
      return res.status(404).json({ error: "Disciplina não encontrada." });
    }
    await Disciplina.destroy({ where: { id_disciplina: id } });
    res.redirect("/disciplinas");
  } catch (error) {
    console.error("Erro ao excluir dados:", error);
    res
      .status(500)
      .json({ error: "Erro ao excluir dados da tabela de disciplina." });
  }
});

app.use("/", router); // Isso irá registrar o router no app principal

app.listen(port, () => {
  console.log(`Aplicação rodando na porta ${port}`);
});
