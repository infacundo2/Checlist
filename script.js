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


function abrirCamara(seccion, area) {
    const fileInput = document.getElementById(`file-${seccion}${area}`);

    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        // Si es un móvil con cámara, abrir la cámara
        navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } })
            .then(stream => {
                fileInput.click();  // Simula la selección de archivo
            })
            .catch(error => {
                console.warn("No se pudo acceder a la cámara, se abrirá el explorador de archivos.");
                fileInput.click();
            });
    } else {
        // En PC, abrir el explorador de archivos directamente
        fileInput.click();
    }
}

// Función para verificar si el dispositivo tiene una cámara disponible
function tieneCamaraDisponible() {
    return new Promise((resolve, reject) => {
        navigator.mediaDevices.enumerateDevices()
            .then(devices => {
                const camaras = devices.filter(device => device.kind === 'videoinput');
                resolve(camaras.length > 0);
            })
            .catch(error => {
                console.error("Error al verificar dispositivos:", error);
                resolve(false);
            });
    });
}

// Función para iniciar la cámara
function iniciarCamara(seccion, area) {
    const videoElement = document.getElementById(`video-${seccion}${area}`);
    const canvasElement = document.getElementById(`canvas-${seccion}${area}`);

    if (!videoElement || !canvasElement) {
        console.error(`No se encontraron elementos de video o canvas para ${seccion} - ${area}`);
        return;
    }

    // Verificar si el dispositivo tiene una cámara disponible
    tieneCamaraDisponible().then(tieneCamara => {
        if (tieneCamara) {
            // Si hay cámara disponible, solicitar acceso
            navigator.mediaDevices.getUserMedia({ video: true })
                .then(stream => {
                    videoElement.srcObject = stream;
                    videoElement.style.display = 'block'; // Mostrar el video en pantalla (ahora visible)
                    // Cuando el video comience a reproducirse, también mostrar el canvas y la imagen
                    videoElement.onplay = () => {
                        console.log('La cámara está en vivo');
                    };
                })
                .catch(error => {
                    console.error('Error al acceder a la cámara: ', error);
                    alert("No se pudo acceder a la cámara. Verifique los permisos.");
                });
        } else {
            console.log("No hay cámaras disponibles en este dispositivo.");
            alert("No se ha encontrado una cámara en este dispositivo.");
        }
    });
}

// Función para tomar la foto
function tomarFoto(seccion, area) {
    const videoElement = document.getElementById(`video-${seccion}${area}`);
    const canvasElement = document.getElementById(`canvas-${seccion}${area}`);
    const imgElement = document.getElementById(`img-${seccion}${area}`);

    if (!videoElement || !canvasElement || !imgElement) {
        console.error(`No se encontraron elementos de video, canvas o imagen para ${seccion} - ${area}`);
        return;
    }

    // Verificar si el video está reproduciéndose
    if (videoElement.srcObject) {
        const context = canvasElement.getContext('2d');
        // Establecer las dimensiones del canvas
        canvasElement.width = videoElement.videoWidth;
        canvasElement.height = videoElement.videoHeight;

        // Dibujar el frame actual del video en el canvas
        context.drawImage(videoElement, 0, 0, canvasElement.width, canvasElement.height);

        // Convertir la imagen del canvas a base64 y asignarla a la etiqueta <img>
        const imagenBase64 = canvasElement.toDataURL("image/jpeg", 0.7);  // Calidad 70%
        imgElement.src = imagenBase64;
        imgElement.style.display = "block";

        // Guardar la imagen en sessionStorage (para evitar sobrecargar localStorage)
        sessionStorage.setItem(`img-${seccion}${area}`, imagenBase64);
        
        // Detener el flujo de la cámara después de tomar la foto (opcional)
        const stream = videoElement.srcObject;
        const tracks = stream.getTracks();
        tracks.forEach(track => track.stop());
        videoElement.srcObject = null;
        videoElement.style.display = 'none';  // Esconde el video después de tomar la foto
    } else {
        console.error("El video no está reproduciéndose o no hay flujo de cámara.");
    }
}

// Función que se ejecuta cuando el DOM está completamente cargado
document.addEventListener("DOMContentLoaded", function() {
    const secciones = {
        "Intensidad": ["TI", "Diseño", "Ventas", "Cajas", "Contabilidad", "Sala de Reuniones", "Revision", "Inicio Picking", "Mitad Picking", "Final Picking", "Inicio Bodega Mayor", "Mitad Bodega Mayor", "Final Bodega Mayor", "Recepcion"],
        "Mesones": ["Meson revision 1", "Meson revision 2", "Meson revision 3", "Meson revision 4", "Meson revision 5", "Meson revision 6", "Meson recepcion"],
        "Zunchadoras": ["Zunchadora 1", "Zunchadora 2", "Zunchadora 3", "Zunchadora 4", "Zunchadora 5"],
        "Envolvedora": ["Envolvedora de Film"],
        "Tableros": ["Voltaje de Fases", "Voltaje Fase a Fase", "Intensidades", "Climatizacion"],
        "UPS": ["UPS 1", "UPS 2"],
    };

    // NO hacer nada aquí respecto a la cámara
});


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
        "Intensidad": ["TI", "Diseño", "Ventas", "Cajas", "Contabilidad", "Sala de Reuniones", "Revision", "Inicio Picking", "Mitad Picking", "Final Picking", "Inicio Bodega Mayor", "Mitad Bodega Mayor", "Final Bodega Mayor", "Recepcion"],
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
        "Intensidad": ["TI", "Diseño", "Ventas", "Cajas", "Contabilidad", "Sala de Reuniones", "Revision", "Inicio Picking", "Mitad Picking", "Final Picking", "Inicio Bodega Mayor", "Mitad Bodega Mayor", "Final Bodega Mayor", "Recepcion"],
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


