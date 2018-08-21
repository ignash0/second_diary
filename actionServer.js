
class Server {
  constructor() {
    this.fs = require('fs');
  }
  registration(req, res) {
    const dateReq = req.body,
      idUser = Math.random().toString(36).substr(2, 9),
      usersData = this.getDataFile('/bd/user.json');

    dateReq.statue = 'curator';
    dateReq.id = idUser;

    let equal = true;

    for (let i =0; i < usersData.length; i++){
      const user = usersData[i];
      if (user.userEmail === dateReq.userEmail) {
        equal = false;
        break
      }
    };

    if (!equal) {
      res.send('no');
    } else {
      usersData.push(dateReq);
      var usersNew = JSON.stringify(usersData);
      this.writeFile('/bd/user.json', usersNew);
      res.send('yes');
    }
  }
  getDataFile(fileDirectory) {
    let result;
    this.fs.readFile(__dirname + fileDirectory, function (err, data) {
      if (err) {
        return console.log(err)
      } else {
        console.log(JSON.parse(data.toString()));
        result = JSON.parse(data.toString());
      }
    })
    return result;
  }

  writeFile(fileDirectory, data) {
    this.fs.writeFile(__dirname +  fileDirectory, data, 'utf8', (err) => {
      if (err) throw err;
      console.log('The file has been saved!');
    });
  }
}

module.exports.serverResponse = new Server;