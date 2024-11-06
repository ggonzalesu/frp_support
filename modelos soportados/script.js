// Cargar JSON de modelos
fetch('models.json')
    .then(response => response.json())
    .then(data => {
        const models = data;
        const modelInput = document.getElementById('modelInput');
        const autocompleteSuggestions = document.getElementById('autocompleteSuggestions');
        const modelStatus = document.getElementById('modelStatus');

        modelInput.addEventListener('input', () => {
            const query = modelInput.value.toLowerCase().trim();
            autocompleteSuggestions.innerHTML = '';

            if (query) {
                const filteredModels = models.filter(model => {
                    const modelVariants = model.Variantes.split(',').map(variant => variant.trim().toLowerCase());
                    return model.Model.toLowerCase().includes(query) || 
                           modelVariants.some(variant => variant.includes(query));
                });

                if (filteredModels.length === 0) {
                    autocompleteSuggestions.innerHTML = '<div class="autocomplete-suggestion">Sin resultados</div>';
                } else {
                    filteredModels.forEach(model => {
                        const suggestion = document.createElement('div');
                        suggestion.classList.add('autocomplete-suggestion');
                        suggestion.textContent = `${model.Model} (${model.Variantes})`;
                        suggestion.addEventListener('click', () => {
                            modelInput.value = model.Model;
                            showModelStatus(model);
                            autocompleteSuggestions.innerHTML = '';
                        });
                        autocompleteSuggestions.appendChild(suggestion);
                    });
                }
            }
        });

        function showModelStatus(model) {
            modelStatus.classList.remove('d-none', 'alert-success', 'alert-danger');
            modelStatus.classList.add(model.Support === "Yes" ? 'alert-success' : 'alert-danger');
            modelStatus.textContent = model.Support === "Yes"
                ? `El modelo ${model.Model} está soportado.`
                : `El modelo ${model.Model} no está soportado.`;
        }
    })
    .catch(error => console.error('Error al cargar los modelos:', error));
