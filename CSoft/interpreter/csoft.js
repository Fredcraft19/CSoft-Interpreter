// turns code into tokens!

// Example lines of code:
// "int x = 0 + 9"


// enum for tokens
const Token = {
    // ---- Command tokens
    // variables
    CREATE_VAR          :Symbol("Create Var"), // creating a variable
    CHANGE_VAR          :Symbol("Set Var"), // changing a variable

    IN_BRK              :Symbol("New Bracket"),   // found a {  so its nested+1
    OUT_BRK             :Symbol("End Bracket"),  // found a } so its nested-1 -> Delete all variables of indent lvl

    // nested objects
    IF                  :Symbol("IF"),


    METHOD              :Symbol("METHOD"),

    
    // ---- Operator tokens
    // basic arithmetic
    ADD                 :Symbol("ADD"),   // add
    SUB                 :Symbol("SUB"),   // subract
    MUL                 :Symbol("MUL"),   // multiply
    DIV                 :Symbol("DIV"),   // division
    POW                 :Symbol("POW"),    // power

    // boolean
    EQL                 :Symbol("EQL")  ,
    NEQL                :Symbol("N-EQL"),
    EQLT                :Symbol("T-EQL"),

    GTR                 :Symbol("GTR"),
    LES                 :Symbol("LES"),
    GTRE                :Symbol("GTRE"),
    LESE                :Symbol("LESE")
}

const Operators = {
    // Base operators
    "+"             :Token.ADD,
    "-"             :Token.SUB,
    "*"             :Token.MUL,
    "/"             :Token.DIV,
    "^"             :Token.POW,

    // Boolean operators

    "=="            :Token.EQL,
    "!="            :Token.NEQL,
    "::"            :Token.EQLT,

    ">"             :Token.GTR,
    "<"             :Token.LES,
    ">="            :Token.GTRE,
    "<="            :Token.LESE    
}

class CSoft{
    static debug = false;

    // All keywords return true. 
    // no need for .contains()  just do keywords["word"]
    static keywords = {
        "var"       :Token.CREATE_VAR,
        "if"        :Token.IF
        // FOR CUSTOM CLASSES ADD TO THIS DURING RUNTIME!!
    };

    static object_args = [];
    static object_condition = "";

    static Reset(){
        this.keywords = {
            "var"       :Token.CREATE_VAR,
            "if"        :Token.IF
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
                case '/':   // comment
                    if(line[i+1] == '/'){
                        return;
                        break;
                    }
                    
                case ' ': // auto clears whitespace
                    if(Memory.current_nest && Memory.current_nest.skip) continue;
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
                        current_word = "";
                    }
                    if(equation_word){
                        if(writing_equation && equation_word.trim().length != 0) equation.push(equation_word); // only add values to the equation if thier not blank space (what str.trim() does)
                        equation_word = ""
                    }
                    continue;
                    break;
                
                    // Equations
                case '=':
                    if(Memory.current_nest && Memory.current_nest.skip) continue;
                    if(qc % 2 != 0) break;

                    if((qc % 2 == 0) || (writing_equation)){
                        let full_oper = char + line[i+1];
                        if (Object.hasOwn(Operators, full_oper) && qc % 2 == 0) {
                            if (equation_word && current_word) {
                                words.push(current_word.trim());
                                equation.push(equation_word.trim());
                                equation_word = ""; 
                                current_word = "";
                            }
                            equation.push(Operators[full_oper]);
                            i++; // Skip the next character since we consumed it as part of '=='
                            continue;
                        } 
                        else if (Object.hasOwn(Operators, char) && qc % 2 == 0) {
                            if (equation_word && current_word) {
                                words.push(current_word.trim());
                                equation.push(equation_word.trim());
                                equation_word = ""; 
                                current_word = "";
                            }
                            equation.push(Operators[char]);
                            continue;
                        }
                    }
                    
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
                        
                        if(writing_equation && equation_word.trim().length != 0) equation.push(equation_word); // only add values to the equation if thier not blank space (what str.trim() does)
                        
                        current_word = "";
                        equation_word = ""
                    }
                    writing_equation = true;
                    continue;
                    break;

                // Nesting / Depth
                // Conditions & Parameters
                
                case '(':
                    if(qc % 2 != 0) break; 
                    if(Memory.current_nest && Memory.current_nest.skip) continue;
                    if(this.keywords[current_word]){
                        writing_equation = true;
                        main_token = this.keywords[current_word];
                    }   
                    else{
                        console.error("unknown call for keyword? OR FUNCTION WHICH IS WIP!")
                    }
                    continue;
                    break;
                
                case ',':
                    if(Memory.current_nest && Memory.current_nest.skip) continue;
                    if(qc % 2 == 0 && main_token){
                        if(main_token == Token.METHOD) this.object_args.push(current_word); // calling a method!
                        else{   // while/if -> they have 1 args which is the condition
                            if(writing_equation){
                                equation.push(equation_word);
                            }
                        }
                        break;

                    }
                    continue;

                case ')':
                    if(Memory.current_nest && Memory.current_nest.skip) continue;
                    if(qc % 2 == 0 && main_token){
                        equation.push(equation_word);
                        writing_equation = false;
                        
                        break;
                    }
                    continue;

                case '{':
                    if(Memory.current_nest && Memory.current_nest.skip) continue;
                    if(qc % 2 != 0) break; 
                    if(main_token){
                        Memory.depth++;
                        switch(main_token){
                            case Token.IF:
                                Memory.current_nest = new NestingObject(Memory.depth, main_token, [this.Equate(equation)]);
                                break;
                            default:
                                
                                console.error("Unknown token for a nesting object, Token: ");
                                console.error(main_token);
                                break;

                        }
                        
                        Memory.nest_objects[Memory.depth] = Memory.current_nest;
                        continue;
                    }
                    break;
                case '}':
                    if(qc % 2 != 0) break; 
                    if(Memory.depth > 0){
                        delete Memory.nest_objects[Memory.depth];

                        Memory.depth--;

                        if(Memory.depth == 0){
                            Memory.current_nest = null;
                        }
                        else{
                            Memory.current_nest = Memory.nest_objects[Memory.depth];
                        }
                        
                    }
                    else{
                        console.error("'}' is wrong place? cant get out of depth 0 aka global!");
                    }
                    continue;
                    break;
                

                case '"':
                    if(Memory.current_nest && Memory.current_nest.skip) continue;
                    qc++;
                    break;
                case ';': // only way to define an end of line!
                    if(Memory.current_nest && Memory.current_nest.skip) continue;
                    if(current_word && equation_word){
                        words.push(current_word);
                        equation.push(equation_word);
                    }
                    
                    if(!main_token){    // if a main token wasn't previously assigned, see if we can make one now!
                        if(this.keywords[current_word]){
                            main_token = this.keywords[current_word];
                        }
                    }

                    if(main_token){
                        switch(main_token){
                            case Token.CREATE_VAR:
                                if(words.length >= 3) this.ExecuteToken(main_token, words[1], this.Equate(equation));
                                break;
                            case Token.CHANGE_VAR:
                                if(words.length >= 2) this.ExecuteToken(main_token, words[0], this.Equate(equation));
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
                default:
                    if(Memory.current_nest && Memory.current_nest.skip) continue;
                    let full_oper = char + line[i+1];
                    if (Object.hasOwn(Operators, full_oper) && qc % 2 == 0) {
                        if (equation_word && current_word) {
                            words.push(current_word.trim());
                            equation.push(equation_word.trim());
                            equation_word = ""; 
                            current_word = "";
                        }
                        equation.push(Operators[full_oper]);
                        i++; // skip next char
                        continue;
                    } 
                    else if (Object.hasOwn(Operators, char) && qc % 2 == 0) {
                        if (equation_word && current_word) {
                            words.push(current_word.trim());
                            equation.push(equation_word.trim());
                            equation_word = ""; 
                            current_word = "";
                        }
                        equation.push(Operators[char]);
                        continue;
                    }
                    break;
            }
            if(Memory.current_nest && Memory.current_nest.skip) continue;
            if(writing_equation){
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
            let value = null;
            
            if(equation[i].length >= 2 && equation[i][equation[i].length-1] == '"' && equation[i][0] == '"'){ // values a string!
                value = equation[i];
            }
            else{ // number or variable!
                if(typeof equation[i] == "symbol"){    // token spotted!!!
                    oper = equation[i];
                }
                else if(Number(equation[i])){    // is number!
                    value = Number(equation[i]);
                }
                else if(Object.hasOwn(Memory.variables, equation[i])){
                    value = Memory.variables[equation[i]].value;
                }
                else if(Boolean(equation[i])){
                    value = Boolean(equation[i]);
                    if(equation.length == 1){
                        return value;
                    }
                }
                else{
                    console.error(`unknown value of: -${equation[i]}-`);

                    console.error(Memory.variables);
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
                                term1 = term1 + term2; break;
                            case Token.SUB:
                                term1 = term1 - term2; break;
                            case Token.MUL:
                                term1 = term1 * term2; break;
                            case Token.DIV:
                                if(term2) term1 = term1 / term2; else term1 = 0; break;
                            case Token.POW:
                                term1 = Math.pow(term1, term2); break;
                            case Token.EQL:
                                term1 = term1 == term2; break;
                            case Token.NEQL:
                                term1 = term1 != term2; break;
                            case Token.EQLT:
                                term1 = term1 === term2; break;
                            case Token.GTR:
                                term1 = term1 > term2; break;
                            case Token.GTRE:
                                term1 = term1 >= term2; break;
                            case Token.LES:
                                term1 = term1 < term2; break;
                            case Token.LESE:
                                term1 = term1 <= term2; break;
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
