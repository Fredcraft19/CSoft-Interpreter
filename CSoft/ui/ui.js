editor = null;
run = document.getElementById('run');

require.config({ 
    paths: { vs: 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.39.0/min/vs' } 
});
require(['vs/editor/editor.main'], function () {
    editor = monaco.editor.create(document.getElementById('editor'), {
        value: `var x = 2;\nx = 9;\nvar c = x + 2;`,
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

    console.clear();

    for(let i = 0; i < lines.length; i++){
        CSoft.ExecuteLine(lines[i]);
    }
});
