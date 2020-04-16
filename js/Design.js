const fs = require('fs');
var path = require('path');
var appDir = path.dirname(require.main.filename);

module.exports = {
  LoadDesignsFromFile: function(){
    let stringIn = fs.readFileSync(appDir+"\\data\\designs.json","utf8").trim();
    return JSON.parse(stringIn);
  },
  SaveDesign: function(ip,designData) {
    var jsonOBJ = this.LoadDesignsFromFile();
    jsonOBJ.forEach(obj => {
      if(obj.data == designData){
        return;
      }
    });
    jsonOBJ.push({ip:ip,data:designData});
    fs.writeFileSync(appDir+"\\data\\designs.json",JSON.stringify(jsonOBJ));
  }
};
