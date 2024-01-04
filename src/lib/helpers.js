const bcrypt = require('bcryptjs'); // modulo para cifrar
const helpers = {};

helpers.encryptPassword = async (password) =>{
    const salt = await bcrypt.genSalt(10); // GENERA UN PATRÓN NECESARIO PARA CIFRAR LA CONTRASEÑA
    const hash = await bcrypt.hash(password, salt); // SE CIFRA LA CONTRASEÑA
    return hash; // RETORNA LA CONTRASEÑA
};

helpers.matchPassword = async (password, savedPassword) =>{
    try{
        return await bcrypt.compare(password, savedPassword); // COMPARA LA CONTRASEÑA INGRESADA CON LA QUE ESTÁ EN LA BD   
    }catch(e){
        console.log(e);
    }
};

module.exports = helpers;