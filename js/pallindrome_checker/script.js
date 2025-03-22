const button1=document.querySelector('#check-btn');
let text = document.querySelector("#text-input");
let result=document.querySelector("#result");
button1.onclick = check_palllin;

function is_numeric(str){
    return /^\d+$/.test(str);
}

function get_str(text){
    let p="";


    for(let i=0;i<text.length;i++){
        if(is_numeric(text[i]))
        {   p+=text[i];
        
        }
        else if(text[i].match(/[a-z]/i)){
            p+=text[i].toLowerCase();
        }
    }
    return p;
}

function check_palllin(){
    text = document.querySelector("#text-input").value;
    console.log(text);
    if(text.length===0)
    {   alert("Please input a value");
        //result.innerText="Please input a value"
}
    else{
        let p=get_str(text);
        console.log(p);
        let k=p.split('').reverse().join('');
        if(p===k)
        {
            result.innerText=text+" is a palindrome";
        }
        else{
            result.innerText=text+" is not a palindrome";
        }

    }
}