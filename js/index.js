const apiURL = 'https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?api_key=Akcm45f7zgTZhG5aJbpJ3MPVEYmxR2TByajmSBSA';
let pag_actual = 1;

// Carga inicial de la página con la fecha 2015-7-2
window.onload = function() {
    document.getElementById("fecha_consulta").value = '2015-7-2';
    buscar(true);
};

// Función principal de búsqueda
function buscar(nueva_consulta = false) {
    const fecha_consulta = document.getElementById("fecha_consulta").value;

    // Si se hace una nueva consulta, reinicia la página a 1 para la nueva consulta
    if (nueva_consulta) {
      pag_actual = 1;
    }

    document.getElementById("btn_anterior").disabled = pag_actual === 1;
    
    const consulta = `${apiURL}&earth_date=${fecha_consulta}&page=${pag_actual}`;
    console.log("Consulta a la API:", consulta);

    fetch(consulta)
        .then(response => response.json())
        .then(data => {
            const listaFotos = document.getElementById("lista_fotos").getElementsByTagName('tbody')[0];
            listaFotos.innerHTML = ''; 

            data.photos.forEach((photo) => {
                const fila = document.createElement('tr');
                fila.innerHTML = `
                    <td>${photo.id}</td>
                    <td>${photo.rover.name}</td>
                    <td>${photo.camera.name}</td>
                    <td><button class="btn_detalles" onclick="verDetalles('${photo.img_src}', '${photo.id}', '${photo.sol}', '${photo.earth_date}')">More</button></td>
                `;
                listaFotos.appendChild(fila);
            });

            // Validación por si hay fotos para determinada fecha junto con sus detalles
            if (data.photos.length > 0) {
                verDetalles(data.photos[0].img_src, data.photos[0].id, data.photos[0].sol, data.photos[0].earth_date);
            } else {
                document.getElementById('foto').innerHTML = 'No hay fotos disponibles para esta fecha o no hay más páginas.';
                document.getElementById('p_id').textContent = `ID: No disponible`;
                document.getElementById('p_martian_sol').textContent = `Martian sol: No disponible`;
                document.getElementById('p_earth_date').textContent = `Earth date: No disponible`;
            }
        })
        .catch(error => console.error('Error al obtener los datos:', error));
}

// Función para el botón de ver detalles (more)
function verDetalles(url, id, martian_sol, earth_date) {
    const fotoDiv = document.getElementById('foto');
    const img = document.createElement('img');
    img.src = url;
    img.width = 315;  //Tamaño que establecí según el tamaño que observé en los requierimientos
    img.height = 315;

    fotoDiv.innerHTML = '';
    fotoDiv.appendChild(img);

  
    document.getElementById('p_id').textContent = `ID: ${id}`;
    document.getElementById('p_martian_sol').textContent = `Martian sol: ${martian_sol}`;
    document.getElementById('p_earth_date').textContent = `Earth date: ${earth_date}`;
}

// Funciones para los botones previous - next

function siguiente() {
    pag_actual++;
    buscar();
}

function anterior() {
    if (pag_actual > 1) {
        pag_actual--;
        buscar();
    }
}

// Evento que detecta cambios en el campo de fecha y hace una nueva consulta
document.getElementById("fecha_consulta").addEventListener('change', function() {
  buscar(true); // Señala que es una nueva consulta con la nueva fecha
});
