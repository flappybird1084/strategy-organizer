const express = require('express');
const path = require('path');
var methodOverride = require('method-override');
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));

app.get('/', (req, res) => {
  // console.log(path.join(__dirname, 'public', 'index.html'));
  // res.sendFile(path.join(__dirname, 'public', 'index.html'));
  res.sendFile("index.html", { root: path.join(__dirname, 'public') });
  
});


app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
