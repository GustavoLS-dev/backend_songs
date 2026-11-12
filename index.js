import express from "express";
import cors from "cors";
import mysql2 from "mysql2";
import "dotenv/config";

const app = express();

app.use(express.json());
app.use(cors());

const sql = mysql2.createPool({
    host: process.env.HOST_BANCO,
    user: process.env.USUARIO_BANCO,
    password: process.env.SENHA_BANCO,
    database: process.env.NOME_BANCO
});

app.get("/", (request, response) => {
    const comandoSelect = "SELECT * FROM musicas_gustavolima";

    sql.query(comandoSelect, (error, data) => {
        if (error) {
            console.log(error);
            return;
        }

        response.json(data);
    });
});

app.post("/cadastrar", (request, response) => {
    const { titulo, artista, genero, ano, duracao } = request.body

    const comandoInsert = "INSERT INTO musicas_gustavolima(titulo, artista, genero, ano, duracao) VALUES (?, ?, ?, ?, ?)"

    sql.query(comandoInsert, [titulo, artista, genero, ano, duracao], (error) => {
        if (error) {
            console.log(error)
            return
        }

        response.status(201).json({ mensagem: "Música cadastrada com sucesso!" })
    })
})

app.delete("/apagar/:id", (request, response) => {
    const { id } = request.params

    const comandoDelete = "DELETE FROM musicas_gustavolima WHERE id = ?"

    sql.query(comandoDelete, [id], (error) => {
        if (error) {
            console.log(error)
            return
        }

        response.json({ mensagem: "Música apagada com sucesso!" })
    })
})

app.get("/musica/:id", (request, response) => {
    const { id } = request.params

    const comandoSelect = "SELECT * FROM musicas_gustavolima WHERE id = ?"

    sql.query(comandoSelect, [id], (error, data) => {
        if (error) {
            console.log(error)
            return
        }

        response.json(data[0])
    })
})

app.put("/editar/:id", (request, response) => {
    const { id } = request.params
    const { titulo, artista, genero, ano, duracao } = request.body

    const comandoUpdate = "UPDATE musicas_gustavolima SET titulo = ?, artista = ?, genero = ?, ano = ?, duracao = ? WHERE id = ?"

    sql.query(comandoUpdate, [titulo, artista, genero, ano, duracao, id], (error) => {
        if (error) {
            console.log(error)
            return
        }

        response.json({ mensagem: "Música alterada com sucesso!" })
    })
})

app.listen(3000, () => {
    console.log("Servidor online");
});

export default app;
