const express = require('express');
const oracledb = require('oracledb');

const app = express();
const PORT = 3000;
app.use(express.json()); // Para ler JSON do body

const dbConfig = {
  user: "C##COUNTRY",
  password: "root",
  connectString: "localhost/XEPDB1"
};

app.get('/test', async (req, res) => {
  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);
    res.status(200).send('Conectado ao Oracle com sucesso!');
  } catch (err) {
    res.status(500).send('Erro na conexão: ' + err.message);
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error(err);
      }
    }
  }
});






// GET all countries
app.get('/COUNTRIES', async (req, res) => {
  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);
    const result = await connection.execute(`SELECT * FROM COUNTRIES`);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  } finally {
    if (connection) await connection.close();
  }
});

// GET /countries/:id - retorna um país pelo ID
app.get('/countries/:id', async (req, res) => {
    const { id } = req.params;
    let connection;
  
    try {
      connection = await oracledb.getConnection(dbConfig);
      
      const result = await connection.execute(
        `SELECT * FROM COUNTRIES WHERE ID = :id`,
        [id],
        { outFormat: oracledb.OUT_FORMAT_OBJECT }
      );
  
      if (result.rows.length === 0) {
        res.status(404).send('País não encontrado');
      } else {
        res.json(result.rows[0]);
      }
    } catch (err) {
      console.error(err);
      res.status(500).send('Erro ao buscar país');
    } finally {
      if (connection) await connection.close();
    }
  });


// POST /countries - criar novo país
app.post('/countries', async (req, res) => {
    const { id, countryName } = req.body;
    try {
        connection = await oracledb.getConnection(dbConfig);
        await connection.execute(
            'INSERT INTO COUNTRIES (id, countryName) VALUES (:id, :countryName)',
            [id, countryName],
            { autoCommit: true }
      );
      res.status(201).send('País criado com sucesso');
    } catch (err) {
      console.error('Erro na query:', err);
      res.status(500).send(err.message);
    }
  });
  



// PUT /countries/:id - atualizar país existente
app.put('/countries/:id', async (req, res) => {
    const { id } = req.params;
    const { countryName } = req.body;
    let connection;
    try {
      connection = await oracledb.getConnection(dbConfig);
      const result = await connection.execute(
        `UPDATE COUNTRIES SET COUNTRYNAME = :countryName WHERE ID = :id`,
        [countryName, id],
        { autoCommit: true }
      );
      if (result.rowsAffected === 0) {
        res.status(404).send('País não encontrado');
      } else {
        res.send('País atualizado com sucesso');
      }
    } catch (err) {
      console.error(err);
      res.status(500).send('Erro ao atualizar país');
    } finally {
      if (connection) await connection.close();
    }
  });

  // DELETE /countries/:id - remover país
app.delete('/countries/:id', async (req, res) => {
    const { id } = req.params;
    let connection;
    try {
      connection = await oracledb.getConnection(dbConfig);
      const result = await connection.execute(
        `DELETE FROM COUNTRIES WHERE ID = :id`,
        [id],
        { autoCommit: true }
      );
      if (result.rowsAffected === 0) {
        res.status(404).send('País não encontrado');
      } else {
        res.send('País removido com sucesso');
      }
    } catch (err) {
      console.error(err);
      res.status(500).send('Erro ao remover país');
    } finally {
      if (connection) await connection.close();
    }
  });

  // PATCH /countries/:id - atualizar parcialmente um país
app.patch('/countries/:id', async (req, res) => {
    const { id } = req.params;
    const { countryName } = req.body; // aqui você pode receber apenas os campos que quer atualizar
    let connection;
    try {
      connection = await oracledb.getConnection(dbConfig);
      
      // Checa se veio algum campo para atualizar
      if (!countryName) {
        return res.status(400).send('Nenhum campo fornecido para atualização');
      }
  
      const result = await connection.execute(
        `UPDATE COUNTRIES SET COUNTRYNAME = :countryName WHERE ID = :id`,
        [countryName, id],
        { autoCommit: true }
      );
  
      if (result.rowsAffected === 0) {
        res.status(404).send('País não encontrado');
      } else {
        res.send('País atualizado parcialmente com sucesso');
      }
    } catch (err) {
      console.error(err);
      res.status(500).send('Erro ao atualizar país');
    } finally {
      if (connection) await connection.close();
    }
  });


app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
  });

