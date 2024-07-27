const fs = require('fs');
const path = require('path');

const crimsonPath = path.join(__dirname, 'crimson')
const slightlyTechiePath = path.join(crimsonPath, 'slightly_techie');
const Basit = path.join(crimsonPath, 'Basit');
const fsPath = path.join(crimsonPath, 'path/fs')


if(fs.existsSync(crimsonPath)){
    console.log('crimson exists')
}else{
    fs.mkdirSync(crimsonPath, {recursive: true});
    console.log('crimson created')
    fs.mkdirSync(slightlyTechiePath, {recursive: true})
    console.log('slightly_techie created')
    fs.mkdirSync(Basit, {recursive: true})
    console.log('Basit created')
    fs.mkdirSync(fsPath, {recursive: true})
    console.log('fs created')
    console.log('Folders created');
}

// Delete the 'path/fs' folder
if (fs.existsSync(fsPath)) {
    fs.rmdirSync(fsPath, { recursive: true });
    console.log('Deleted folder path/fs.');
} else {
    console.log('Folder path/fs does not exist.');
}

// View contents of 'crimson' folder
const crimsonContents = fs.readdirSync(crimsonPath);
console.log('Contents of crimson folder:', crimsonContents);

// Create files in the 'crimson' folder
const files = ['index.js', 'index.txt', 'index.md'];
files.forEach(file => {
    const filePath = path.join(crimsonPath, file);
    fs.writeFileSync(filePath, `This is the initial content of ${file}.`);
    console.log(`Created file: ${filePath}`);
});

// Append new data/content to the files
files.forEach(file => {
    const filePath = path.join(crimsonPath, file);
    fs.appendFileSync(filePath, `\nAppended content to ${file}.`);
    console.log(`Appended content to file: ${filePath}`);
});

// Read from the files created above
files.forEach(file => {
    const filePath = path.join(crimsonPath, file);
    const content = fs.readFileSync(filePath, 'utf8');
    console.log(`Content of ${file}:\n${content}`);
});
