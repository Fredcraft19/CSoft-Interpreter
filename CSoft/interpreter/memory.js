// Classes
class Variable{
    value = null;
    type = "null";
    constructor(value, type){
        this.value = value;
        this.type = type;
    }
}

class Memory{
    // Map of all variables, KEY = "VAR_NAME" VALUE = "value"-if primitive / "class instance"-if custom
    static variables = {
        csoft_version:"0.0.1"
    };

    static Reset(){
        this.variables = {
        csoft_version:"0.0.1"
    };
    }

}
