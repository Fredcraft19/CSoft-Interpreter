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

    condition = "";

    constructor(depth, token, args = []){ // args is for parameters in function or a condition
        this.depth = depth;
        this.token = token;

        if(this.token == Token.IF){ // for every if statement, args[0] will be the condition
            if(CSoft.Equate(args[0]) == true){
                this.skip = false;
            }
            else {
                this.skip = true;
            }
        }
        if(this.token == Token.WHILE){
            this.condition = args[0];
        }
    }
}

class MethodObject extends NestingObject{
    name = "";
    local_code = "";
    wanted_parameters = [];1
    token = null;

    constructor(depth, token, args = []){
        super();
        this.depth = depth;
        this.token = token;
        this.local_code = "";
        this.wanted_parameters = args;
    }
    Run(args = []){
        this.GetParameters(args);
        this.skip = false;
        CSoft.ExecuteLine(this.local_code);

        this.ClearMyScope();
    }

    GetParameters(args = []){
        for(let i = 0; i < this.wanted_parameters.length; i++){   
            if(!args[i]){
                this.local_variables[this.wanted_parameters[i]] = new Variable(null);
            }
            else{
                this.local_variables[this.wanted_parameters[i]] = new Variable(args[i]);
            }
        }
        Object.entries(this.local_variables).forEach(([k, v]) => {
        });
    }
    ClearMyScope(){
        this.local_variables = {}; 
    }
}

class MiniObject{
    token = null;
    args = [];
    constructor(token, args){
        this.token = token;
        this.args = args;
    }
    Token(){
        return this.token;
    }
    Args(){
        return this.args;
    }
    FirstArgs(){
        return this.args[0];
    }
}

class Memory{
    // Map of all variables, KEY = "VAR_NAME" VALUE = "value"-if primitive / "class instance"-if custom
    // global variables always in scope
    static variables = {
        csoft_version:new Variable("0.0.1")
    };

    static methods = {};

    static depth = 0;
    static nest_objects = {};
    static current_nest = null;

    static Reset(){
        this.variables = {
            "csoft_version":new Variable("0.0.1")
        };
        this.depth = 0;
        this.nest_objects = {};
        this.current_nest = null;
    }
}
