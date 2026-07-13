// turns code into tokens!

// Example lines of code:
// "int x = 0 + 9"


// enum for tokens
const Token = {
    // ---- Command tokens
    // variables
    CREATE_VAR          :"¬¬CRT_VAR¬¬",
    CHANGE_VAR          :"¬¬SET_VAR¬¬",


    
    // ---- Operator tokens
    // basic arithmetic
    ADD                 :"¬¬O_ADD¬¬",   // add
    SUB                 :"¬¬O_SUB¬¬",   // subract
    MUL                 :"¬¬O_MUL¬¬",   // multiply
    DIV                 :"¬¬O_DIV¬¬"    // division
}

const Operators = {
    // Base operators
    "+"             :Token.ADD,
    "-"             :Token.SUB,
    "*"             :Token.MUL,
    "/"             :Token.DIV
}

class CSoft{
    // All keywords return true. 
    // no need for .contains()  just do keywords["word"]
    static keywords = {
        "var":Token.CREATE_VAR
        // FOR CUSTOM CLASSES ADD TO THIS DURING RUNTIME!!
    };

    static Reset(){
        this.keywords = {
            "var":Token.CREATE_VAR
        };
    }

    static ExecuteLine(line){
        let main_token = null;
        let current_word = "";
        let words = [];

        let writing_equation = false;
        let equation_word = "";
        let equation = [];
        
        let target_variable = "";

        let qc = 0; // qc == quote count or " count.

        for(let i = 0; i < line.length; i++){  // only 1 for char's in line, for maximum speed~
            let char = line[i];
            switch(char){
                case ' ': // auto clears whitespace
                    if(qc % 2 != 0){break;}
                    if(!main_token){
                        try{
                            if(this.keywords[current_word]){
                                main_token = this.keywords[current_word];
                            }
                            else if(Object.hasOwn(Memory.variables, current_word)){
                                main_token = Token.CHANGE_VAR;
                                target_variable = current_word;
                            }
                        }catch(e){}
                    }
                    
                    if(current_word){
                        words.push(current_word);
                        
                        if(writing_equation && current_word.trim().length != 0) equation.push(current_word); // only add values to the equation if thier not blank space (what str.trim() does)
                        
                        current_word = "";
                    }
                    
                    continue;
                    break;
                
                    // Equations
                case '=':
                    if(qc % 2 != 0){break;}
 
                    if(!main_token){
                        try{
                            if(this.keywords[current_word]){
                                main_token = this.keywords[current_word];
                            }
                            else if(Object.hasOwn(Memory.variables, current_word)){
                                main_token = Token.CHANGE_VAR;
                                target_variable = current_word;
                            }
                        }catch(e){}
                    }

                    if(current_word){
                        words.push(current_word);
                        
                        if(writing_equation && current_word.trim().length != 0) equation.push(current_word); // only add values to the equation if thier not blank space (what str.trim() does)
                        
                        current_word = "";
                    }
                    writing_equation = true;
                    continue;
                    break;

                    // equation operators
                case '+':
                    if(equation_word){
                    equation.push(equation_word);
                    equation_word = "";
                    }
                    equation.push(Token.ADD);
                    continue;
                    break;
                case '-':
                    if(equation_word){
                    equation.push(equation_word);
                    equation_word = "";}
                    equation.push(Token.SUB);
                    continue;
                    break;
                case '*':
                    if(equation_word){
                    equation.push(equation_word);
                    equation_word = "";}
                    equation.push(Token.MUL);
                    continue;
                    break;
                case '/':
                    if(equation_word){
                    equation.push(equation_word);
                    equation_word = "";}
                    equation.push(Token.DIV);
                    continue;
                    break;

                
                case '"':
                    qc++;
                    break;
                case ';': // only way to define an end of line!
                    if(current_word){
                        words.push(current_word);
                        equation.push(current_word);
                    }
                    if(main_token){
                        switch(main_token){
                            case Token.CREATE_VAR:
                                if(words.length >= 3) this.ExecuteToken(main_token, words[1], this.Equate(equation));
                                break;
                            case Token.CHANGE_VAR:
                                if(words.length >= 2) console.log(equation);this.ExecuteToken(main_token, words[0], this.Equate(equation));
                                break;
                            default:
                                console.error("Invalid main token!");

                        }
                    }
                    else{
                        console.error("unknown command or declaration.");
                    }
                    
                    // Reset for new statement. as its after a ';'
                    main_token = null;
                    current_word = "";
                    words = [];
                    writing_equation = false;
                    equation_word = "";
                    equation = [];
                    
                    continue;// super secure 2fa yknow?
                    break;
            }

            if(writing_equation && char != '='){
                equation_word += char;
            }
            
            current_word += char;
        }
    }
    static ExecuteToken(token = null, arg1 = null, arg2 = null){    // eg ET[CREATE_VAR, x, 15]
        let name = null;
        let value = null;
        switch(token){
            case Token.CREATE_VAR:
                name = arg1;
                value = arg2;
                if(!Object.hasOwn(Memory.variables, name)){
                    Memory.variables[name] = new Variable(value);
                    console.log(`MADE variable:\n${name} => ${value}`);
                }
                else{
                    console.error(`invalid variable name!\nA variable of that name may already exist. Or the name may be a keyword!`);
                }

                break;
            case Token.CHANGE_VAR:
                name = arg1;
                value = arg2;
                if(Object.hasOwn(Memory.variables, name)){
                    Memory.variables[name].value = arg2;
                    console.log(`SET variable:\n${name} => ${value}`);
                }
                else{
                    console.error(`Variable: '${name}' does not exist.`);
                }
                break;
        
        }

    }

    static Equate(equation){    // example equation => [66 ADD 1]

        let term1 = null;
        let term2 = null;
        let oper = null;
        for(let i = 0; i < equation.length; i++){
            let value = null
            if(equation[i].length >= 3 && equation[i][equation[i].length-1] == '"' && equation[i][0] == '"'){ // values a string!
                value = equation[i].substring(1, equation[i].length - 1);
            }
            else{ // number or variable!
                if(Number(equation[i])){    // is number!
                    value = Number(equation[i]);
                }
                else if(Object.hasOwn(Memory.variables, equation[i])){
                    value = Memory.variables[equation[i]].value;
                }
                else if(equation[i][0] == "¬" && equation[i][1] == "¬"){    // token spotted!!! yes just '¬¬..' net delecate at all..
                    switch(equation[i]){
                        case Token.ADD:
                            oper = Token.ADD;
                            break;
                        case Token.SUB:
                            oper = Token.SUB;
                            break;
                        case Token.MUL:
                            oper = Token.MUL;
                            break;
                        case Token.DIV:
                            oper = Token.DIV;
                            break;
                        default:
                            console.error(`unknown value of: -${equation[i]}-`);
                            break;
                    }
                }
                else{
                    console.error(`unknown value of: -${equation[i]}-`);
                }
            }
            if(value){
                if(!term1){
                    term1 = value;
                }
                else if(!term2){
                    term2 = value;
                    if(term1 && term2){
                        switch(oper){
                            case Token.ADD:
                                term1 = term1 + term2;
                                break;
                            case Token.SUB:
                                term1 = term1 - term2;
                                break;
                            case Token.MUL:
                                term1 = term1 * term2;
                                break;
                            case Token.DIV:
                                if(term2){
                                term1 = term1 / term2;}else {term1 = 0}
                                break;
                        }
                        term2 = null;
                    }
            else{
                console.error("2 terms dont surround the operator? WHy?");
            }
                }
                else{
                    console.error(`cant put values next to eachother without an operator!`)
                }
            }
            
        }
        return term1; // term1 is always the output. so yeah its the output.
    }
}
