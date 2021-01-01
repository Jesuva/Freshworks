const fs = require('fs');

opsys = process.platform
 if (opsys=="win32"||opsys=="win64"){
     var cDir = 'D:\\users\\data-storage.json'
 }
 else if(opsys=='darwin'||opsys=='linux'){
     var cDir = '/users/data-storage.json'
 }

let stats = fs.statSync(cDir);
let {size} = stats;
let i = Math.floor(Math.log(size) / Math.log(1024));
const s = (size / Math.pow(1024, i)).toFixed(2) * 1 + ' ' + ['B', 'KB', 'MB'][i];


exports.index = function(req, res, next){
    res.render('index',
    {
        title:'Home',
        result: s,
        
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
    res.status(200).send({success: true, msg: 'User Data Added successfully',timerDeleteKey:k})
}

exports.readData = function(req, res, next){
    const existData = getUserData()
    const thisKey = req.params.id
    const thisData = req.body
    for(var i =0; i<existData.length;i++){
        if(Object.keys(existData[i])[0] === thisKey){
            return res.status(200).send({msg:existData[i],result:s})
        }
    }

    return res.status(409).send({msg:"Key Not Found"})
}

exports.deleteData = function(req, res, next){
    const existData = getUserData()
    const thisKey = req.params.id
    const thisData = req.body
    const findExist = existData.find(userKey=>Object.keys(userKey)[0] === thisKey)
    if(findExist){
        const deleteData = existData.filter( userKey => Object.keys(userKey)[0] !== thisKey )
        saveUserData(deleteData)
        return res.status(200).send({msg:"Record Deleted!",result:s})

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

