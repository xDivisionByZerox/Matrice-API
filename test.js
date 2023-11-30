const bcrypt = require('bcrypt');

func = async () => {
    r = await bcrypt.compare("OZGMLMp0FXCZ5ur", "$2b$08$zUukghtS6AV0Lc8jsskqROrL0qsDRJSExe6JQPJJNmlnr.zsh3j6u")
    console.log(r)
}

func();