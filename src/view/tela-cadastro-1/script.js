// Lógica para pular para o próximo campo ao pressionar Enter
document.addEventListener('DOMContentLoaded', function() {
    const inputs = document.querySelectorAll('input[type="text"], input[type="number"], input[type="radio"]');
    const btnProximo = document.getElementById('proximo');

    inputs.forEach((input, index) => {
        input.addEventListener('keypress', function(event) {
            if (event.key === 'Enter') {
                event.preventDefault();
                
                if (input.type === 'radio') {
                    let nextIndex = index + 1;
                    while (nextIndex < inputs.length && inputs[nextIndex].type === 'radio' && 
                        inputs[nextIndex].name === input.name) {
                        nextIndex++;
                    }
                    
                    if (nextIndex < inputs.length) {
                        inputs[nextIndex].focus();
                    } else {
                        btnProximo.click();
                    }
                } else {
                    if (index < inputs.length - 1) {
                        inputs[index + 1].focus();
                    } else {
                        btnProximo.click();
                    }
                }
            }
        });
    });

});
