
import { BinaryHeap } from './heap.js';

export { HuffmanCoder }

class HuffmanCoder{
    // it is a function to convert tree to string with direction
    // make graph look like this
    //00a1b00c like this
    //when u moving left write 0 right 1 and when get char leaf add char.
    // we are adding ' when we get a character to difrenciate from 01 of path

    stringify(node){
        if(typeof(node[1])==="string"){
            return '\''+node[1];
        }
        // inorder traversal
        return '0' + this.stringify(node[1][0]) + '1' + this.stringify(node[1][1]);
    }
  
    display(node, modify, index=1){
        if(modify){
            node = ['',node];
            if(node[1].length===1)
                node[1] = node[1][0];
        }

        if(typeof(node[1])==="string"){
            return String(index) + " = " + node[1];
        }

        let left = this.display(node[1][0], modify, index*2);
        let right = this.display(node[1][1], modify, index*2+1);
        let res = String(index*2)+" <= "+index+" => "+String(index*2+1);
        return res + '\n' + left + '\n' + right;
    }

    destringify(data){
        let node = [];
        if(data[this.ind]==='\''){
            this.ind++;
            node.push(data[this.ind]);
            this.ind++;
            return node;
        }

        this.ind++;
        let left = this.destringify(data);
        node.push(left);
        this.ind++;
        let right = this.destringify(data);
        node.push(right);

        return node;
    }
    // here , we are going to apply  dfs or say we are going to traverse the tree.
    getMappings(node, path){
        // if we get object means that we are not at the leaf node , but we have 
        // string (char is also a string ) means that we are at leaf node 
        // so we just change the second element of that  it string of code .
        if(typeof(node[1])==="string"){
            this.mappings[node[1]] = path;
            return;
        }
        // traversing both the sides so that we can get code for every 
        //char or every leaf node.

        this.getMappings(node[1][0], path+"0");
        this.getMappings(node[1][1], path+"1");
    }
    // here data is whatever your text was .

    encode(data){

        this.heap = new BinaryHeap();
        // heap to implement .
        //hash map or array but here is hash map 
        // to calculate the frequecy of character
        const mp = new Map();

        // creating map 
        // sotoring frquency for each element .

        for(let i=0;i<data.length;i++){
            if(data[i] in mp){
                mp[data[i]] = mp[data[i]] + 1;
            } else{
                mp[data[i]] = 1;
            }
        }
 
        // inserting elements in heap ,  i have max heap so i am using  -neg . 
        // we are calling insert function of heap here and elements.

        for(const key in mp){
            this.heap.insert([-mp[key], key]);
            //frequecy then character . 
            // map is reverse of it 
        }
    

        while(this.heap.size() > 1){
          // extracting two min elements from the heap 
          // extractmax is pre writtern in heap .

            const node1 = this.heap.extractMax();//left
            const node2 = this.heap.extractMax();//right

            // creating new node using sum of frequency and conerting/ adding  
            const node = [node1[0]+node2[0],[node1,node2]];
            this.heap.insert(node);
        }

        // the remaing left node or element of the heap is root 
        const huffman_encoder = this.heap.extractMax();
         
        this.mappings = {};
        // passing root node and empty string to get mapping 

        this.getMappings(huffman_encoder, "");

        // coverting string to binary string
        // from codes.
        let binary_string = "";
        for(let i=0;i<data.length;i++) {
            binary_string = binary_string + this.mappings[data[i]];
        }

        // now you have a binary string in binary string you have to convert that string
        // to 8 bit buckets and than convert those buckit to any ascii charater.
        // map 8 bit with ascii char . 

        // calculating how many 0 must be added to make string%8==0
        let rem = (8 - binary_string.length%8)%8;
        let padding = "";

        // adding extra zero to make correct representation 
        for(let i=0;i<rem;i++)
            padding = padding + "0";
        binary_string = binary_string + padding;

        // converting that buckets to char 
        let result = "";
        for(let i=0;i<binary_string.length;i+=8){
            let num = 0;
            for(let j=0;j<8;j++){
                num = num*2 + (binary_string[i+j]-"0");
            }
            // converting num(0-255) to corrsponding char
            result = result + String.fromCharCode(num);
        }
        // result is the shorter string . of ascii reprentation od those bucket .
        // we are converting binary because other wise that string is even more longer than original 
        // so we are paking to 8 bits and converting them .

        // sending haufman tree by converting to string stringyfy
        let final_res = this.stringify(huffman_encoder) + '\n' + rem + '\n' + result;
       // final result = tree string+ exta zero + or reduced string.
        
       // calculating compression %
       let info = "Compression Ratio : " + data.length/final_res.length;
       
       info = "Compression complete and file sent for download" + '\n' + info;
       
       
       // call display 
       return [final_res, this.display(huffman_encoder, false), info];
    }

    decode(data){
        data = data.split('\n');
        if(data.length===4){
            // Handling new line
            data[0] = data[0] + '\n' + data[1];
            data[1] = data[2];
            data[2] = data[3];
            data.pop();
        }

        this.ind = 0;
        const huffman_decoder = this.destringify(data[0]);
        const text = data[2];

        let binary_string = "";
        for(let i=0;i<text.length;i++){
            let num = text[i].charCodeAt(0);
            let bin = "";
            for(let j=0;j<8;j++){
                bin = num%2 + bin;
                num = Math.floor(num/2);
            }
            binary_string = binary_string + bin;
        }
        binary_string = binary_string.substring(0,binary_string.length-data[1]);

        console.log(binary_string.length);

        let res = "";
        let node = huffman_decoder;
        for(let i=0;i<binary_string.length;i++){
            if(binary_string[i]==='0'){
                node = node[0];
            } else{
                node = node[1];
            }

            if(typeof(node[0])==="string"){
                res += node[0];
                node = huffman_decoder;
            }
        }
        let info = "Decompression complete and file sent for download";
        return [res, this.display(huffman_decoder, true), info];
    }
}