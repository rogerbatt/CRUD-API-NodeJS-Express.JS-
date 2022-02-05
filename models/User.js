const mongoose = require('mongoose')

const User = mongoose.model('Usuarios', {
  name: String,
  endereço: String,
  numeroCasa: Number,
  cpf: String
})

module.exports = User
