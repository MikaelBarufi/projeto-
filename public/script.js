document.getElementById('addToolForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const toolName = document.getElementById('toolName').value;
    const toolQuantity = document.getElementById('toolQuantity').value;
    
    fetch('/addTool', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: toolName, quantity: toolQuantity }),
    })
    .then(response => response.json())
    .then(data => {
        alert('Ferramenta adicionada com sucesso!');
        document.getElementById('addToolForm').reset();
    })
    .catch((error) => {
        console.error('Erro:', error);
    });
});

document.getElementById('removeToolForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const toolId = document.getElementById('toolId').value;
    
    fetch('/removeTool', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: toolId }),
    })
    .then(response => response.json())
    .then(data => {
        alert('Ferramenta removida com sucesso!');
        document.getElementById('removeToolForm').reset();
    })
    .catch((error) => {
        console.error('Erro:', error);
    });
});

document.getElementById('useToolForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const toolId = document.getElementById('useToolId').value;
    const employeeName = document.getElementById('employeeName').value;
    const siteLocation = document.getElementById('siteLocation').value;
    
    fetch('/useTool', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: toolId, employee: employeeName, location: siteLocation }),
    })
    .then(response => response.json())
    .then(data => {
        alert('Uso da ferramenta registrado com sucesso!');
        document.getElementById('useToolForm').reset();
    })
    .catch((error) => {
        console.error('Erro:', error);
    });
});