// Función para redirigir al usuario a la página de crear checklist
function irACrearchecklist() {
    window.location.href = "checklist.html";
}
function irAIndex() {
    window.location.href = "index.html";
}
function irAWifi() {
    window.location.href = "wifi.html";
}
function irAMesones() {
    window.location.href = "mesones.html";
}
function irAUPS() {
    window.location.href = "ups.html";
}
function irAZunchadoras() {
    window.location.href = "zunchadoras.html";
}
function irAEnvolverdora() {
    window.location.href = "film.html";
}
function irATableros() {
    window.location.href = "tableros.html";
}


// Función para guardar la imagen
function guardarImagen(event, seccion, area) {
    const file = event.target.files[0]; // Obtener el archivo de imagen

    if (file) {
        const reader = new FileReader();

        reader.onloadend = function () {
            // Convertir la imagen a Base64
            const imagenBase64 = reader.result;

            // Guardar la imagen en localStorage con la clave correcta
            localStorage.setItem(`img-${seccion}${area}`, imagenBase64);

            // Verificar si la imagen se ha guardado correctamente
            const imagenGuardada = localStorage.getItem(`img-${seccion}${area}`);
            if (imagenGuardada) {
                console.log("Imagen guardada correctamente:", imagenGuardada);
                // Mostrar la imagen en el elemento correspondiente (opcional)
                const imgElement = document.getElementById(`img-${seccion}${area}`);
                if (imgElement) {
                    imgElement.src = imagenGuardada; // Asignar la imagen guardada al elemento
                    imgElement.style.display = 'block'; // Mostrar la imagen
                }
            } else {
                console.error("No se pudo guardar la imagen.");
            }
        };

        reader.readAsDataURL(file); // Leer la imagen como URL de datos
    }
}


// Función para guardar el comentario
function guardarComentario(seccion, area) {
    // Intentar obtener el textarea por su id
    const textarea = document.getElementById(`coment-${seccion}${area}`);

    // Verificar si el textarea existe
    if (textarea) {
        const comentario = textarea.value; // Obtener el valor del comentario
        localStorage.setItem(`coment-${seccion}${area}`, comentario);// Guardar el comentario en localStorage
    } else {
        console.error(`El textarea para ${seccion}  ${area} no se ha encontrado.`);
    }
}

function descargarPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    const fechaActual = new Date();
    const dia = String(fechaActual.getDate()).padStart(2, '0');
    const mes = String(fechaActual.getMonth() + 1).padStart(2, '0');
    const año = fechaActual.getFullYear();
    const fechaFormateada = `${dia}-${mes}-${año}`;

    doc.setFontSize(18);
    doc.text("Checklist Diario", 14, 20);

    let yPosition = 30;
    const pageHeight = doc.internal.pageSize.height;
    const margin = 14;

    const secciones = {
        "Intensidad": ["TI", "Diseño", "Venta", "Cajas", "Contabilidad", "Sala de Reuniones", "Revision", "Inicio Picking", "Mitad Picking", "Final Picking", "Inicio Bodega Mayor", "Mitad Bodega Mayor", "Final Bodega Mayor", "Recepcion"],
        "Mesones": ["Meson revision 1", "Meson revision 2", "Meson revision 3", "Meson revision 4", "Meson revision 5", "Meson revision 6", "Meson recepcion"],
        "Zunchadoras": ["Zunchadora 1", "Zunchadora 2", "Zunchadora 3", "Zunchadora 4", "Zunchadora 5"],
        "Envolvedora": ["Envolvedora de Film"],
        "Tableros": ["Voltaje de Fases", "Voltaje Fase a Fase", "Intensidades", "Climatizacion"],
        "UPS": ["UPS 1", "UPS 2"],
    };

    for (const [seccion, areas] of Object.entries(secciones)) {
        doc.setFontSize(14);
        doc.text(seccion, 14, yPosition);
        yPosition += 10;

        for (let i = 0; i < areas.length; i += 2) {
            doc.setFontSize(12);
            const area1 = areas[i];
            const area2 = areas[i + 1] || "";

            doc.text(area1, 14, yPosition);
            if (area2) {
                doc.text(area2, 105, yPosition);
            }

            const imgWidth = 70;
            const imgHeight = 100;

            const imagenBase64_1 = localStorage.getItem(`img-${seccion}${area1}`);
            const imagenBase64_2 = localStorage.getItem(`img-${seccion}${area2}`);

            const comentario1 = localStorage.getItem(`coment-${seccion}${area1}`);
            const comentario2 = localStorage.getItem(`coment-${seccion}${area2}`);

            let maxHeight = 0; // Para llevar la altura máxima y alinear los comentarios correctamente

            // Agregar imagen 1 si existe
            if (imagenBase64_1) {
                if (yPosition + imgHeight + 20 > pageHeight - margin) {
                    doc.addPage();
                    yPosition = margin;
                }
                doc.addImage(imagenBase64_1, "JPEG", 14, yPosition + 5, imgWidth, imgHeight);
                maxHeight = imgHeight; // Registrar altura de la imagen
            }

            // Agregar imagen 2 si existe
            if (imagenBase64_2) {
                if (yPosition + imgHeight + 20 > pageHeight - margin) {
                    doc.addPage();
                    yPosition = margin;
                }
                doc.addImage(imagenBase64_2, "JPEG", 105, yPosition + 5, imgWidth, imgHeight);
                maxHeight = Math.max(maxHeight, imgHeight);
            }

            yPosition += maxHeight + 10; // Espacio después de la imagen

            // Agregar comentario 1 si existe
            if (comentario1) {
                doc.text(comentario1, 14, yPosition);
            }

            // Agregar comentario 2 si existe
            if (comentario2) {
                doc.text(comentario2, 105, yPosition);
            }

            yPosition += 20; // Espacio después de los comentarios

            // Separador entre áreas
            doc.line(14, yPosition, 200, yPosition);
            yPosition += 10;

            if (yPosition >= pageHeight - margin) {
                doc.addPage();
                yPosition = margin;
            }
        }
    }

    doc.save(`checklist_diario_${fechaFormateada}.pdf`);
    localStorage.clear();
}


// Función para generar el PDF
/*function descargarPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();  // Crear un nuevo documento PDF
     // Obtener la fecha actual y formatearla como "DD-MM-YYYY"
     const fechaActual = new Date();
     const dia = String(fechaActual.getDate()).padStart(2, '0');  // Agrega un 0 si es menor a 10
     const mes = String(fechaActual.getMonth() + 1).padStart(2, '0'); // Los meses van de 0-11, por eso sumamos 1
     const año = fechaActual.getFullYear();
 
     const fechaFormateada = `${dia}-${mes}-${año}`;

    // Título del documento
    doc.setFontSize(18);
    doc.text("Checklist Diario", 14, 20);

    let yPosition = 30; // Posición inicial vertical para el contenido
    const pageHeight = doc.internal.pageSize.height; // Altura de la página
    const margin = 14; // Margen izquierdo

    // Listado de secciones y sus áreas
    const secciones = {
        "Intensidad": ["TI", "Diseño", "Venta", "Cajas", "Contabilidad", "Sala de reuniones", "Revision", "Inicio Picking", "Mitad Picking", "Final Picking", "Inicio Bodega Mayor", "Mitad Bodega Mayor", "Final Bodega Mayor", "Recepcion"],
        "Mesones": ["Meson revision 1", "Meson revision 2", "Meson revision 3", "Meson revision 4", "Meson revision 5", "Meson revision 6", "Meson recepcion"],
        "Zunchadoras": ["Zunchadora 1", "Zunchadora 2", "Zunchadora 3", "Zunchadora 4", "Zunchadora 5"],
        "Envolvedora": ["Envolvedora de Film"],
        "Tableros": ["Voltaje de Fases", "Voltaje Fase a Fase", "Intensidades", "Climatizacion"],
        "UPS": ["UPS 1", "UPS 2"],  // Especificando las áreas de UPS
        
    };

    // Recorremos cada sección y sus áreas
    for (const [seccion, areas] of Object.entries(secciones)) {
        // Agregar título de la sección
        doc.setFontSize(14);
        doc.text(seccion, 14, yPosition);
        yPosition += 10; // Espacio para el siguiente contenido

        // Recorremos las áreas de la sección
        areas.forEach(area => {
            
            // Agregar título de la subsección
            doc.setFontSize(12);
            doc.text(area, 20, yPosition); // Se mueve un poco a la derecha para indicar jerarquía
            yPosition += 8;

            // Obtener los comentarios e imágenes desde localStorage para cada área
            const comentario = localStorage.getItem(`coment-${seccion}${area}`);
            const imagenBase64 = localStorage.getItem(`img-${seccion}${area}`);

            // Agregar imagen si existe
            if (imagenBase64) {
                // Si no hay suficiente espacio en la página para la imagen, agregar una nueva página
                if (yPosition + 60 > pageHeight - margin) {
                    doc.addPage();
                    yPosition = margin; // Resetear la posición Y en la nueva página
                }

                doc.addImage(imagenBase64, "JPEG", 20, yPosition, 50, 50);
                yPosition += 60; // Espacio para la imagen
            }

            // Agregar comentario si existe
            if (comentario) {
                doc.setFontSize(12);
                doc.text(comentario, 14, yPosition);
                yPosition += 20; // Espacio para el siguiente comentario
            }

            // Agregar un separador entre áreas
            doc.line(14, yPosition, 200, yPosition); 
            yPosition += 10; // Espacio después del separador
            // Si la posición `yPosition` excede la altura de la página, agregar una nueva página
            
            if (yPosition >= pageHeight - margin) {
                doc.addPage(); // Añadir una nueva página
                yPosition = margin; // Resetear la posición Y para la nueva página
            }
        });

        // Espacio después de cada sección
        yPosition += 10;
    }

    
    doc.save(`checklist_diario_${fechaFormateada}.pdf`);
    // Guardar el PDF con el nombre deseado

    // Limpiar localStorage después de generar el PDF (si es necesario)
    localStorage.clear();
}*/

/*function obtenerAreas(seccion) {
    const areas = {
        "Intensidad WiFi": ["TI", "Diseño", "Venta", "Cajas", "Contabilidad", "Sala de reuniones", "Revisión", "Inicio Picking", "Mitad Picking", "Final Picking", "Inicio Bodega Mayor", "Mitad Bodega Mayor", "Final Bodega Mayor", "Oficina Recepción"],
        "Mesones": ["Meson revisión 1", "Meson revisión 2", "Meson revisión 3", "Meson revisión 4", "Meson revisión 5", "Meson revisión 6"],
        "Envolvedora de Film": ["Envolvedora de Film"],
        "Tableros": ["Voltajefases", "Voltaje_fase_a_fase", "Intensidades"],
        "UPS": ["UPS 1", "UPS 2"],
        "Zunchadoras": ["Zunchadora 1", "Zunchadora 2", "Zunchadora 3", "Zunchadora 4", "Zunchadora 5"]
    };
    
    return areas[seccion] || [];  // Devuelve el arreglo de áreas de la sección solicitada
}*/
