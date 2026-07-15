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

    local_code = "";

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
            console.log("RUN IF? " + CSoft.Equate(args[0]));
        }
        if(this.token == Token.WHILE){
            this.condition = args[0];
        }

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
