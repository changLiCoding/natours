const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });
const app = require(`${__dirname}/app.js`);

console.log(app.get('env'));
const port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log(`App running on port ${port}...`);
});
