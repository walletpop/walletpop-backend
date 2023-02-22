const app = require("./");
require('dotenv').config();

const { PORT = 3000 } = process.env;

app.listen(PORT, () => {
  console.log(`walletpop are ready at http://localhost:${PORT}`);
});
