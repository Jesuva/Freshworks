const fs = require('fs');
opsys = process.platform
 if (opsys=="win32"||opsys=="win64"){
     var cDir = 'D:\\users\\data-storage.json'
 }
 else if(opsys=='darwin'||opsys=='linux'){
     var cDir = '/users/data-storage.json'
 }
 if (fs.existsSync(cDir)) {
    
}
else{
    var ws = fs.createWriteStream(cDir)
    ws.write("[]")
    ws.end()
}


exports.index = function(req, res, next){
    var s = refreshFile()
    res.render('index',
    {
        title:'Home',
        result: s[0],
        
    });
}

exports.addData = function(req, res, next){
    const existData = getUserData()
    let thisData = req.body
    for(var i =0; i<existData.length;i++){
        if(Object.keys(existData[i])[0] === Object.keys(thisData)[0]){
            return res.status(409).send({error: true, msg: 'User Key Already Exist'})
        }
    }
    existData.push(thisData)
    saveUserData(existData);
    let k = Object.keys(thisData)[0]
    let s = refreshFile()
    res.status(200).send({success: true, msg: 'User Data Added successfully',timerDeleteKey:k,size:s[0],dangerFlag:s[1]})
}

exports.readData = function(req, res, next){
    const existData = getUserData()
    const thisKey = req.params.id
    const thisData = req.body
    let s = refreshFile()
    for(var i =0; i<existData.length;i++){
        if(Object.keys(existData[i])[0] === thisKey){
            return res.status(200).send({msg:existData[i],result:s[0]})
        }
    }

    return res.status(409).send({msg:"Key Not Found"})
}

exports.deleteData = function(req, res, next){
    const existData = getUserData()
    const thisKey = req.params.id
    const thisData = req.body
    let s = refreshFile()
    const findExist = existData.find(userKey=>Object.keys(userKey)[0] === thisKey)
    if(findExist){
        const deleteData = existData.filter( userKey => Object.keys(userKey)[0] !== thisKey )
        saveUserData(deleteData)
        return res.status(200).send({msg:"Record Deleted!",result:s[0],dangerFlag:s[1]})

    }
    else{
        return res.status(409).send({msg:"Not Found"})
    }

}


const saveUserData = (data) => {
    const stringifyData = JSON.stringify(data)
    fs.writeFileSync(cDir, stringifyData)
}

const getUserData = () => {
    const jsonData = fs.readFileSync(cDir)
    return JSON.parse(jsonData)    
}

const refreshFile = () =>{
    
let stats = fs.statSync(cDir);
let {size} = stats;
let i = Math.floor(Math.log(size) / Math.log(1024));
let fsize = (size / Math.pow(1024, i)).toFixed(2) * 1;
const totalSize = (size / Math.pow(1024, i)).toFixed(2) * 1 + ' ' + ['B', 'KB', 'MB'][i];
if (i==2&& fsize>1022){
   
    return [totalSize,1]
}
return [totalSize,0]
}