const bcrypt = require("bcrypt")

password = "fcWQnl3VUQIiFWq"

bcrypt
.hash(password, Number(8))
.then(hash => {
    console.log(hash);
})
.catch(err => console.error(err.message))

console.log("$2b$08$JGUXNEBkB1MMZ.IzT2W4AOKCyINwkl9kNeeOl8BZYfrOKb777ewMG")