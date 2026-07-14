// Classes
class Variable{
    value = null;
    nest = 0;
    constructor(value, type){
        this.value = value;
        this.type = type;
    }
}
// eg, 'if', 'while', anything with {}.
class NestingObject{
    token = null; // symbol! e.g. 'Token.IF'
    depth = 0;
    local_variables = {};
    skip = false;

    constructor(depth, token, args = []){ // args is for parameters in function or a condition
        this.depth = depth;
        this.token = token;

        if(this.token == Token.IF){ // for every if statement, args[0] will be the condition
            if(args[0] == true){
                this.skip = false;
            }
            else {
                this.skip = true;
            }
        }
    }
}

class Memory{
    // Map of all variables, KEY = "VAR_NAME" VALUE = "value"-if primitive / "class instance"-if custom
    // global variables always in scope
    static variables = {
        csoft_version:"0.0.1"
    };

    static depth = 0;
    static nest_objects = {};
    static current_nest = null;

    static Reset(){
        this.variables = {
            csoft_version:"0.0.1"
        };
    }

    static AddNesting(){

    }
    static OutNesting(){
        if(this.nest_value > 0){
            this.nest_value--;
        }
        to_delete = [];
        for(let i = 0; i < this.variables.length; i++){
            if(this.variables[i].nest > this.nest_value){
                to_delete.push(this.variables[i]);
            }
        }
    }
}
