let btn = document.querySelector('#convert-btn');
let num = document.getElementById('number').value;
let out = document.querySelector('#output');

btn.onclick = conv

function conv(){
    num = document.getElementById('number').value;

    if(num.toString().length===0)
    {
        out.innerText = "Please enter a valid number";
    }
    else if(num<=0)
    {   
        out.innerText = "Please enter a number greater than or equal to 1";
    }
    else if(num>=4000){
        out.innerText =  "Please enter a number less than or equal to 3999";
    }
    else{
        out.innerText = intToRoman(num);
    }
}

function intToRoman(num) {
    let s="";
    if(num>=1000)
        {   s=s+('M').repeat(num/1000);
            num=num%1000;
            if (num===0){
                return s;
            }
        }
        
        if(num>=900)
        {
            s=s+'CM';
            num-=900;
            if (num===0){
                return s;
            }
        }
        else{
            s=s+('D').repeat(num/500);
            num=num%500;
            if (num===0){
                return s;
            }
        }

        if(num>=400)
        {   s=s+'CD';
            num-=400;
            if (num===0){
                return s;
            }
        }
        else{
            s=s+('C').repeat(num/100);
            num=num%100;
            if (num===0){
                return s;
            }
        }

        if(num>=90)
        {
            s=s+'XC';
            num-=90;
            if (num===0){
                return s;
            }
        }
        else{
            s=s+('L').repeat(num/50);
            num=num%50;
            if (num===0){
                return s;
            }
        }

        if(num>=40)
        {   s=s+'XL';
            num-=40;
            if (num===0){
                return s;
            }
        }
        else{
            s=s+('X').repeat(num/10);
            num=num%10;
            if (num===0){
                return s;
            }
        }

        if(num>=9)
        {
            s=s+'IX';
            return s;
        }
        else if(num===4)
        {
            s=s+'IV';
            return s;
        }
        else{
            s=s+('V').repeat(num/5);
            num=num%5;
            s=s+('I').repeat(num);
        }
        return s;

    }