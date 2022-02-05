// config inicial
const express = require('express')
const app = express()

// depois do db
const mongoose = require('mongoose')

const User = require('./models/User')

app.use(
  express.urlencoded({
    extended: true,
  }),
)

app.use(express.json())

app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    // handle OPTIONS method
    if ('OPTIONS' == req.method) {
        return res.sendStatus(200);
    } else {
        next();
    }
});
// rotas
app.post('/', async (req, res) => {
  
  const { name, endereço, numeroCasa, cpf } = req.body

  const usuario = {
    name,
    endereço,
    numeroCasa,
    cpf
  }

  try {
    await User.create(usuario)

    res.status(201).json({ message: 'Pessoa inserida com sucesso!'})
    console.log('Usuario Criado')
  } catch (error) {
    res.status(500).json({ erro: error })
  }
})

app.get('/', async (req, res) => {
  try {
    const usuarios = await User.find()

    res.status(200).json(usuarios)
  } catch (error) {
    res.status(500).json({ erro: error })
  }
})

app.get('/:id', async (req, res) => {
  const id = req.params.id

  try {
    const usuarios = await User.findOne({ _id: id })

    if (!usuarios) {
      res.status(422).json({ message: 'Usuário não encontrado!' })
      return
    }

    res.status(200).json(usuarios)
  } catch (error) {
    res.status(500).json({ erro: error })
  }
})

app.patch('/:id', async (req, res) => {
  const id = req.params.id

  const { name, endereço, numeroCasa, cpf } = req.body

  const usuario = {
    name,
    endereço,
    numeroCasa,
    cpf
  }

  try {
    const updateUsuario = await User.updateOne({ _id: id }, usuario)

    if (updateUsuario.matchedCount === 0) {
      res.status(422).json({ message: 'Usuário não encontrado!' })
      return
    }

    res.status(200).json(usuario)
  } catch (error) {
    res.status(500).json({ erro: error })
  }
})

app.delete('/:id', async (req, res) => {
  const id = req.params.id

  const usuario = await User.findOne({ _id: id })

  if (!usuario) {
    res.status(422).json({ message: 'Usuário não encontrado!' })
    return
  }

  try {
    await User.deleteOne({ _id: id })

    res.status(200).json({ message: 'Usuário removido com sucesso!' })
  } catch (error) {
    res.status(500).json({ erro: error })
  }
})

const PORT = 8877

mongoose
  .connect(
    'mongodb+srv://...',
  )
  .then(() => {
    console.log('API Conectou com o banco de dados!')
    app.listen(PORT, () =>{
      console.log("Servidor iniciado na porta: " + PORT);
    });
  })
  .catch((err) => console.log(err))
