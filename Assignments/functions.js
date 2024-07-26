const greet = console.log('good morning')
//This is a global variable and can be accessed everywhere in the code

const add = (x,y,z) => {
    let arr = [x,y,z]
    //arr here is not global and can only be accessed in just the add function
    if (typeof x,y,z !== "number"){
        return "Please enter a number"
    }
    return x + y + z
}

function subtract(x,y){
    if(typeof x,y !== "number"){
        return "Please enter a number"
    }
    return x - y;
}

function max(x,y){
    if(typeof x,y !== "number"){
        return "Please enter a number"
    }
    if(x > y){
        return x;
    }else{
        return y
    }
}

