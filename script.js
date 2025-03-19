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
    const file = event.target.files[0];

    if (file) {
        const reader = new FileReader();

        reader.onloadend = function () {
            const img = new Image();
            img.src = reader.result;

            img.onload = function () {
                // Redimensionar la imagen para reducir su tamaño
                const canvas = document.createElement("canvas");
                const ctx = canvas.getContext("2d");

                const MAX_WIDTH = 800;  // Reducir tamaño
                const MAX_HEIGHT = 600;
                let width = img.width;
                let height = img.height;

                if (width > MAX_WIDTH || height > MAX_HEIGHT) {
                    if (width > height) {
                        height *= MAX_WIDTH / width;
                        width = MAX_WIDTH;
                    } else {
                        width *= MAX_HEIGHT / height;
                        height = MAX_HEIGHT;
                    }
                }

                canvas.width = width;
                canvas.height = height;
                ctx.drawImage(img, 0, 0, width, height);

                // Convertir la imagen optimizada a Base64 (con calidad reducida)
                const imagenBase64 = canvas.toDataURL("image/jpeg", 0.7);  // Calidad 70%

                // Guardar en sessionStorage (para evitar llenar localStorage)
                sessionStorage.setItem(`img-${seccion}${area}`, imagenBase64);

                // Mostrar la imagen en la página
                const imgElement = document.getElementById(`img-${seccion}${area}`);
                if (imgElement) {
                    imgElement.src = imagenBase64;
                    imgElement.style.display = "block";
                }
            };
        };

        reader.readAsDataURL(file);
    }
}

function guardarComentario(seccion, area) {
    // Intentar obtener el textarea por su id
    const textarea = document.getElementById(`coment-${seccion}${area}`);

    // Verificar si el textarea existe
    if (textarea) {
        let comentario = textarea.value.trim(); // Obtener el valor del comentario y eliminar espacios extras

        // Si el comentario está vacío, asignar un valor predeterminado
        if (comentario === "") {
            comentario = "Sin observaciones"; // Valor predeterminado
        }

        // Guardar el comentario (o el valor predeterminado) en sessionStorage
        sessionStorage.setItem(`coment-${seccion}${area}`, comentario);
    } else {
        console.error(`El textarea para ${seccion} ${area} no se ha encontrado.`);
    }
}

// Llamar a guardarComentario al cargar la página, para asegurar que el valor predeterminado se guarde en sessionStorage
document.addEventListener("DOMContentLoaded", function() {
    // Secciones con sus respectivas áreas
    const secciones = {
        "Intensidad": ["TI", "Diseño", "Venta", "Cajas", "Contabilidad", "Sala de Reuniones", "Revision", "Inicio Picking", "Mitad Picking", "Final Picking", "Inicio Bodega Mayor", "Mitad Bodega Mayor", "Final Bodega Mayor", "Recepcion"],
        "Mesones": ["Meson revision 1", "Meson revision 2", "Meson revision 3", "Meson revision 4", "Meson revision 5", "Meson revision 6", "Meson recepcion"],
        "Zunchadoras": ["Zunchadora 1", "Zunchadora 2", "Zunchadora 3", "Zunchadora 4", "Zunchadora 5"],
        "Envolvedora": ["Envolvedora de Film"],
        "Tableros": ["Voltaje de Fases", "Voltaje Fase a Fase", "Intensidades", "Climatizacion"],
        "UPS": ["UPS 1", "UPS 2"],
    };

    // Iterar sobre cada sección y sus áreas
    for (const [seccion, areas] of Object.entries(secciones)) {
        areas.forEach(area => {
            // Llamar a la función para guardar el comentario de cada área
            guardarComentario(seccion, area);
        });
    }
});



function descargarPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    const fechaActual = new Date();
    const fechaFormateada = `${fechaActual.getDate()}-${fechaActual.getMonth() + 1}-${fechaActual.getFullYear()}`;

    doc.setFontSize(18);
    doc.text("Checklist Diario", 14, 20);

    let yPosition = 30;
    const pageHeight = doc.internal.pageSize.height;
    const margin = 14;
    const imgWidth = 50;
    const imgHeight = 95;

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
        yPosition += 8;

        for (let i = 0; i < areas.length; i += 2) {
            if (yPosition + imgHeight + 20 > pageHeight - margin) {
                doc.addPage();
                yPosition = margin;
            }

            doc.setFontSize(12);
            doc.text(areas[i], 14, yPosition);
            if (areas[i + 1]) {
                doc.text(areas[i + 1], 105, yPosition);
            }

            const imagenBase64_1 = sessionStorage.getItem(`img-${seccion}${areas[i]}`);
            const imagenBase64_2 = areas[i + 1] ? sessionStorage.getItem(`img-${seccion}${areas[i + 1]}`) : null;

            const comentario1 = sessionStorage.getItem(`coment-${seccion}${areas[i]}`);
            const comentario2 = areas[i + 1] ? sessionStorage.getItem(`coment-${seccion}${areas[i + 1]}`) : null;


            if (imagenBase64_1) {
                doc.addImage(imagenBase64_1, "JPEG", 14, yPosition + 5, imgWidth, imgHeight);
            }
            if (imagenBase64_2) {
                doc.addImage(imagenBase64_2, "JPEG", 105, yPosition + 5, imgWidth, imgHeight);
            }

            yPosition += imgHeight + 13;

            if (comentario1) {
                doc.setFontSize(11);
                doc.setFont("helvetica", "bold")
                doc.text(comentario1, 14, yPosition);
                doc.setFont("helvetica", "normal")
            }
            if (comentario2) {
                doc.setFontSize(11);
                doc.setFont("helvetica", "bold")
                doc.text(comentario2, 105, yPosition);
                doc.setFont("helvetica", "normal")
            }

            yPosition += 15;
            doc.line(14, yPosition, 200, yPosition);
            yPosition += 10;
        }
    }

    doc.save(`checklist_diario_${fechaFormateada}.pdf`);
    sessionStorage.clear();
    localStorage.clear();
}


