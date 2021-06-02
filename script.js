import { HuffmanCoder } from './huffman.js';


onload = function () {
    // Get reference to elements
    // area where tree is displayed 
    const treearea = document.getElementById('treearea');
    // encode button
    const encode = document.getElementById('encode');
   // decode button
    const decode = document.getElementById('decode');
    // comprestion ratio area 
    const temptext = document.getElementById('temptext');
    // file variable
    const upload = document.getElementById('uploadedFile');

    // taking reference of huffmacoder class;
    const coder = new HuffmanCoder();

     // when a file is loaded compleatly show some alert 
    upload.addEventListener('change',()=>{ alert("File uploaded") });
    

    encode.onclick = function () {

        const uploadedFile = upload.files[0];
        //  if not uploaded
        if(uploadedFile===undefined){
            alert("No file uploaded !");
            return;
        }
        //object to read the object of file
        const fileReader = new FileReader();

        fileReader.onload = function(fileLoadedEvent){
            // getting text content  
            const text = fileLoadedEvent.target.result;
            // lenght is zero
            if(text.length===0){
                alert("Text can not be empty ! Upload another file !");
                return;
            }
            let [encoded, tree_structure, info] = coder.encode(text);
            // calling download file function 
            downloadFile(uploadedFile.name.split('.')[0] +'_encoded.txt', encoded);
            // filling feilds
            treearea.innerText = tree_structure;
            
            treearea.style.marginTop = '2000px';
            // text area filling 
            temptext.innerText = info;
        };
        fileReader.readAsText(uploadedFile, "UTF-8");
        // calling file reader .
    };

    decode.onclick = function () {

        const uploadedFile = upload.files[0];
        if(uploadedFile===undefined){
            alert("No file uploaded !");
            return;
        }
        const fileReader = new FileReader();
        fileReader.onload = function(fileLoadedEvent){
            const text = fileLoadedEvent.target.result;
            if(text.length===0){
                alert("Text can not be empty ! Upload another file !");
                return;
            }
            let [decoded, tree_structure, info] = coder.decode(text);
            downloadFile(uploadedFile.name.split('.')[0] +'_decoded.txt', decoded);
            treearea.innerText = tree_structure;
            treearea.style.marginTop = '2000px';
            temptext.innerText = info;
        };
        fileReader.readAsText(uploadedFile, "UTF-8");
    };

};

function downloadFile(fileName, data){
    let a = document.createElement('a');
    a.href = "data:application/octet-stream,"+encodeURIComponent(data);
    a.download = fileName;
    a.click();
}