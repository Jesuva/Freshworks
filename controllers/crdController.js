const fs = require('fs');
const stats = fs.statSync('public/dataFile/data-storage.json');
const fileSize = stats.size/1000000.0;


exports.index = function(req, res, next){
    
    res.render('index',
    {
        title:'Home',
        result: fileSize,
        
    });
}

exports.addData = function(req, res, next){
    const existData = getUserData()
    let thisData = req.body
    for(var i =0; i<existData.length;i++){
        if(Object.keys(existData[i])[0] === Object.keys(thisData)[0]){
            return res.status(409).send({error: true, msg: 'username already exist'})
        }
    }
    existData.push(thisData)
    saveUserData(existData);
    res.status(200).send({success: true, msg: 'User data added successfully'})
}

exports.readData = function(req, res, next){
    const existData = getUserData()
    const thisKey = req.params.id
    const thisData = req.body
    // const findExist = existData.find(userKey=>userKey.key === thisKey)

    for(var i =0; i<existData.length;i++){
        if(Object.keys(existData[i])[0] === thisKey){
            return res.status(200).send({msg:existData[i]})
        }
    }

    return res.status(409).send({msg:"not found"})
}

exports.deleteData = function(req, res, next){
    const existData = getUserData()
    const thisKey = req.params.id
    const thisData = req.body
    const findExist = existData.find(userKey=>Object.keys(userKey)[0] === thisKey)
    if(findExist){
        const deleteData = existData.filter( userKey => Object.keys(userKey)[0] !== thisKey )
        saveUserData(deleteData)
        return res.status(200).send({msg:"Record Deleted!"})

    }
    else{
        return res.status(409).send({msg:"not found"})
    }

}


const saveUserData = (data) => {
    const stringifyData = JSON.stringify(data)
    fs.writeFileSync('public/dataFile/data-storage.json', stringifyData)
}

const getUserData = () => {
    const jsonData = fs.readFileSync('public/dataFile/data-storage.json')
    return JSON.parse(jsonData)    
}

