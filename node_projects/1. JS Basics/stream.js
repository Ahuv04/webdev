//not good to read and write all data at once therefore loading some data at a time is much better

const fs= require('fs');

const ap =  async() =>{
    try{
        const rs = fs.createReadStream("./files/dummy.txt",{encoding: 'utf8'});
        const ws = fs.createWriteStream("./files/writestream.txt");
        
        rs.on('data', (dataChunk)=>{
            ws.write(dataChunk);
        }
        )
        //another more efficient way is to pipe
        rs.pipe(ws);
    }catch(err){
        console.error(err);
    }   
}

//creating directory
if(!fs.existsSync('./new')){

    fs.mkdir('./new', (err) =>{
        if(err) throw err;
        console.log("directory created");
    });
}


