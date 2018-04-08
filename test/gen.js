// const fs = require('fs');
// let content = fs.readFileSync('./test/files/mime.txt', 'utf-8'); // From apache
// let rows = content.split("\n");
// let result = {};
// let supported = [];
// rows.forEach((row,index)=>{
//     if(row[0]!=='#' && row.trim()!==''){
//         let parts = row.split(/[\t]+/);
//         let mimeType = parts[0];
//         let extensions = parts[1].split(' ');
//         extensions.forEach((extension)=>{
//             result[extension] = mimeType;
//             supported.push('1. '+extension);
//         });
        
//     }
// });

// fs.writeFileSync('./mime.json', JSON.stringify(result), {encoding:'utf-8'});
// fs.writeFileSync('./supported.txt', supported.sort().join("\n"), {encoding:'utf-8'});
// console.log(supported.sort().join("\n"));