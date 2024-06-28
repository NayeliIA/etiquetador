document.getElementById('upload').addEventListener('change', loadImage);
document.getElementById('save').addEventListener('click', saveAnnotations);

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let image = new Image();
let annotations = []; //en este arreglo se guardan los datos 
let isDrawing = false;
let startX, startY;

canvas.addEventListener('mousedown', iniciar);
canvas.addEventListener('mousemove', dibujarrec);
canvas.addEventListener('mouseup', fin);

const deleteButton = document.createElement('button');
deleteButton.textContent = 'Eliminar datos';
deleteButton.addEventListener('click', deleteAllAnnotations); // Elimina todas las anotaciones
document.body.appendChild(deleteButton);


function loadImage(event) {
  const file = event.target.files[0];
  const reader = new FileReader();

  reader.onload = function (e) {
    image.onload = function () {
      canvas.width = image.width;
      canvas.height = image.height;
      ctx.drawImage(image, 0, 0);
    };

    image.src = e.target.result;
  };

  reader.readAsDataURL(file);
}

function iniciar(event) {
  isDrawing = true;
  [startX, startY] = getMousePos(event);
}

function dibujarrec(event) {
  if (!isDrawing) return;
  const [x, y] = getMousePos(event);

 ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas before redrawing
 ctx.drawImage(image, 0, 0);

  ctx.beginPath();
  ctx.rect(startX, startY, x - startX, y - startY);
  ctx.lineWidth = 2;
  ctx.strokeStyle = 'blue';
  ctx.stroke();
}

function fin(event) {
  isDrawing = false;
  const [x, y] = getMousePos(event);
  const label = prompt("Escribe el nombre de la etiqueta:");

  annotations.push({ //arreglo que guarda las coordenadas y la etiqueta de la imagen
    x1: startX,
    y1: startY,
    x2: x,
    y2: y,
    label,
  });

  updateAnnotationsList(); //se llama a la funcion para mostrarlos en la parte de abajo 
 
}
  //ctx.clearRect(0, 0, canvas.width, canvas.height); //limpiar canvas despues de terminar de dibujar
 // ctx.drawImage(image, 0, 0);

  /*ctx.beginPath();
  ctx.rect(startX, startY, x - startX, y - startY);
  ctx.lineWidth = 2;
  ctx.strokeStyle = 'blue';
  ctx.stroke();*/


function getMousePos(event) {
  const rect = canvas.getBoundingClientRect();
  return [event.clientX - rect.left, event.clientY - rect.top];
}

function updateAnnotationsList() {
  const ul = document.getElementById('annotations');
  ul.innerHTML = ''; // 

  annotations.forEach((annotation, index) => {
    const li = document.createElement('li');
    li.textContent = `Label: ${annotation.label}, Coordinates: (${annotation.x1}, ${annotation.y1}) to (${annotation.x2}, ${annotation.y2})`;
    ul.appendChild(li);
  });
}

function saveAnnotations() {
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(annotations)); //aqui se guarda el archivo en .JSON si lo queremos en otro formato lo podemoa cambiar
  const downloadAnchorNode = document.createElement('a');

  downloadAnchorNode.setAttribute("href", dataStr);
  downloadAnchorNode.setAttribute("download", "annotations.json");
  document.body.appendChild(downloadAnchorNode);
  downloadAnchorNode.click();
  downloadAnchorNode.remove();
}
function deleteAllAnnotations() {
    annotations = [];
    updateAnnotationsList();
  }