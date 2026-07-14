editor = null;
run = document.getElementById('run');

require.config({ 
    paths: { vs: 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.39.0/min/vs' } 
});
require(['vs/editor/editor.main'], function () {
    editor = monaco.editor.create(document.getElementById('editor'), {
        value: `var x = 9;\nvar y = 19;\nvar output = "nullptr";\n\nif(x > y){\n    output = "x>y";\n}\n\nif(y >= x){\n    output = "y>=x";\n}`,
        language: 'csharp',
        theme: 'vs-dark',
        automaticLayout: true,
        fontSize: 16
    });
});

run.addEventListener('click', function(){
    lines = window.editor.getModel().getLinesContent();

    Memory.Reset();
    CSoft.Reset();
    CSoft.debug = true;

    console.clear();
    let start = performance.now();
    for(let i = 0; i < lines.length; i++){
        CSoft.ExecuteLine(lines[i]);
    }
    let end = performance.now();
    console.log(`C~ finished in: ${(end-start).toFixed(3)}ms | ${Math.round((end-start) * 1000)}`);

    if(Memory.variables["output"]){
        console.log(`\nC~ Output:\n${Memory.variables["output"].value}`);
    }
});
