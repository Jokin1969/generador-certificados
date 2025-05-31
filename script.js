// Variables globales
let certificateData = {};

// Inicialización cuando se carga la página
document.addEventListener('DOMContentLoaded', function() {
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('fecha').value = today;
    document.getElementById('fechaEmision').value = today;
    document.getElementById('horaInicio').value = '09:00';
    document.getElementById('horaFin').value = '10:00';
    document.getElementById('ciudad').value = 'Bilbao';
});

// Función principal para generar el certificado
function generateCertificate() {
    // Recoger datos del formulario
    certificateData = {
        nombre: document.getElementById('nombre').value.trim(),
        genero: document.getElementById('genero').value,
        dni: document.getElementById('dni').value.trim(),
        fecha: document.getElementById('fecha').value,
        horaInicio: document.getElementById('horaInicio').value,
        horaFin: document.getElementById('horaFin').value,
        ciudad: document.getElementById('ciudad').value.trim(),
        fechaEmision: document.getElementById('fechaEmision').value
    };
    
    // Validar campos requeridos
    if (!certificateData.nombre || !certificateData.genero || !certificateData.dni || 
        !certificateData.fecha || !certificateData.horaInicio || !certificateData.horaFin || 
        !certificateData.ciudad) {
        alert('Por favor, completa todos los campos obligatorios.');
        return;
    }
    
    // Ocultar formulario y mostrar sección de descarga
    document.getElementById('formSection').className = 'hidden';
    document.getElementById('downloadSection').className = 'download-section visible';
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Función para volver al formulario
function showForm() {
    document.getElementById('formSection').className = '';
    document.getElementById('downloadSection').className = 'download-section hidden';
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Función para generar el contenido del certificado
function generateCertificateContent() {
    const fechaObj = new Date(certificateData.fecha);
    const fechaFormateada = fechaObj.toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
    
    const fechaEmision = new Date(certificateData.fechaEmision);
    const diaEmision = fechaEmision.getDate();
    const mesEmision = fechaEmision.toLocaleDateString('es-ES', { month: 'long' });
    const añoEmision = fechaEmision.getFullYear();
    
    // Determinar el tratamiento según el género
    const tratamiento = certificateData.genero === 'masculino' ? 'D.' : 'Dña.';
    
    return `FUNDACIÓN ESPAÑOLA DE ENFERMEDADES PRIÓNICAS
Certificado de Donación de Sangre

═══════════════════════════════════════════════════════════════════

Por la presente, D. Joaquín Castilla, con DNI 16287336R, en calidad de Presidente de la Fundación Española de Enfermedades Priónicas,

CERTIFICA:

Que ${tratamiento} ${certificateData.nombre}, con DNI ${certificateData.dni}, ha acudido el día ${fechaFormateada} de 2025, desde las ${certificateData.horaInicio} hasta las ${certificateData.horaFin} horas, a nuestras instalaciones para realizar una donación de sangre en colaboración con el Biobanco Vasco.

Esta donación forma parte de la campaña especial de recolección de muestras biológicas para investigación en enfermedades priónicas.

Y para que así conste a los efectos oportunos de justificación laboral, se expide el presente certificado.

En ${certificateData.ciudad}, a ${diaEmision} de ${mesEmision} de ${añoEmision}.




_________________________                    _________________________
Fdo.: Joaquín Castilla                      Fdo.: Izaro Kortazar
Presidente                                  Facultativo especialista en neurología
Fundación Española de                       Responsable del Proyecto
Enfermedades Priónicas                      



═══════════════════════════════════════════════════════════════════
Nota: Este documento tiene validez como justificante oficial de asistencia a donación de sangre.

Sello de la Fundación`;
}

// Función para copiar al portapapeles
function copyToClipboard() {
    try {
        const content = generateCertificateContent();
        
        // Crear modal para mostrar el contenido
        const modal = document.createElement('div');
        modal.className = 'modal';
        
        const modalContent = document.createElement('div');
        modalContent.className = 'modal-content';
        
        modalContent.innerHTML = `
            <h3 style="margin-top: 0; color: #2c5aa0;">📋 Certificado listo para copiar</h3>
            <p><strong>Instrucciones:</strong> El texto ya está seleccionado. Cópialo (Ctrl+C) y pégalo en Word.</p>
            <textarea id="certificateTextArea" readonly>${content}</textarea>
            <div class="modal-buttons">
                <button class="modal-btn btn-copy" onclick="copyTextToClipboard()">📋 Copiar al Portapapeles</button>
                <button class="modal-btn btn-close" onclick="closeModal()">❌ Cerrar</button>
            </div>
        `;
        
        modal.appendChild(modalContent);
        document.body.appendChild(modal);
        
        // Seleccionar todo el texto automáticamente
        setTimeout(() => {
            const textarea = document.getElementById('certificateTextArea');
            textarea.select();
            textarea.focus();
        }, 100);
        
    } catch (error) {
        alert('Error al generar el certificado: ' + error.message);
    }
}

// Función para copiar texto al portapapeles
function copyTextToClipboard() {
    const textarea = document.getElementById('certificateTextArea');
    textarea.select();
    document.execCommand('copy');
    alert('¡Texto copiado al portapapeles! Ahora puedes pegarlo en Word con Ctrl+V');
}

// Función para descargar como archivo Word
function downloadWordDoc() {
    try {
        const content = generateCertificateContent();
        
        // Crear blob con el contenido
        const blob = new Blob([content], { 
            type: 'application/msword;charset=utf-8' 
        });
        
        // Crear enlace de descarga
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Certificado_Donacion_${certificateData.nombre.replace(/\s+/g, '_')}.doc`;
        a.style.display = 'none';
        
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        alert('¡Certificado descargado! Revisa tu carpeta de Descargas.');
        
    } catch (error) {
        alert('Error al descargar el certificado: ' + error.message);
    }
}

// Función para generar HTML imprimible
function downloadHTML() {
    try {
        const fechaObj = new Date(certificateData.fecha);
        const fechaFormateada = fechaObj.toLocaleDateString('es-ES', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
        
        const fechaEmision = new Date(certificateData.fechaEmision);
        const diaEmision = fechaEmision.getDate();
        const mesEmision = fechaEmision.toLocaleDateString('es-ES', { month: 'long' });
        const añoEmision = fechaEmision.getFullYear();
        
        const tratamiento = certificateData.genero === 'masculino' ? 'D.' : 'Dña.';
        
        const htmlContent = `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Certificado de Donación - ${certificateData.nombre}</title>
    <style>
        body { 
            font-family: Arial, sans-serif; 
            margin: 40px; 
            line-height: 1.6; 
        }
        .certificate { 
            border: 3px solid #2c5aa0; 
            padding: 40px; 
            max-width: 700px; 
            margin: 0 auto; 
        }
        .header { 
            text-align: center; 
            margin-bottom: 30px; 
        }
        .foundation-name { 
            font-size: 18px; 
            font-weight: bold; 
            text-transform: uppercase; 
            color: #2c5aa0; 
            margin-bottom: 10px; 
        }
        .certificate-title { 
            font-size: 16px; 
            font-weight: bold; 
            margin-bottom: 20px; 
        }
        .content { 
            font-size: 14px; 
            text-align: justify; 
        }
        .signatures { 
            display: flex; 
            justify-content: space-between; 
            margin-top: 60px; 
        }
        .signature-block { 
            text-align: center; 
            flex: 1; 
        }
        .signature-line { 
            border-bottom: 1px solid #333; 
            height: 50px; 
            margin-bottom: 10px; 
        }
        .signature-name { 
            font-weight: bold; 
            margin-bottom: 5px; 
        }
        .signature-title { 
            font-size: 12px; 
            color: #666; 
        }
        .footer-note { 
            margin-top: 30px; 
            font-size: 12px; 
            border-top: 1px solid #ddd; 
            padding-top: 15px; 
        }
        .print-btn { 
            position: fixed; 
            top: 20px; 
            right: 20px; 
            background: #2c5aa0; 
            color: white; 
            border: none; 
            padding: 10px; 
            border-radius: 5px; 
            cursor: pointer; 
        }
        @media print { 
            .print-btn { display: none; } 
            body { margin: 0; } 
        }
    </style>
</head>
<body>
    <button class="print-btn" onclick="window.print()">🖨️ Imprimir</button>
    <div class="certificate">
        <div class="header">
            <div class="foundation-name">FUNDACIÓN ESPAÑOLA DE ENFERMEDADES PRIÓNICAS</div>
            <div class="certificate-title">Certificado de Donación de Sangre</div>
            <hr>
        </div>
        
        <div class="content">
            <p>Por la presente, <strong>D. Joaquín Castilla</strong>, con DNI <strong>16287336R</strong>, en calidad de Presidente de la Fundación Española de Enfermedades Priónicas,</p>
            
            <p><strong>CERTIFICA:</strong></p>
            
            <p>Que <strong>${tratamiento} ${certificateData.nombre}</strong>, con DNI <strong>${certificateData.dni}</strong>, ha acudido el día <strong>${fechaFormateada}</strong> de 2025, desde las <strong>${certificateData.horaInicio}</strong> hasta las <strong>${certificateData.horaFin}</strong> horas, a nuestras instalaciones para realizar una donación de sangre en colaboración con el <strong>Biobanco Vasco</strong>.</p>
            
            <p>Esta donación forma parte de la campaña especial de recolección de muestras biológicas para investigación en enfermedades priónicas.</p>
            
            <p>Y para que así conste a los efectos oportunos de justificación laboral, se expide el presente certificado.</p>
            
            <p>En <strong>${certificateData.ciudad}</strong>, a <strong>${diaEmision}</strong> de <strong>${mesEmision}</strong> de <strong>${añoEmision}</strong>.</p>
        </div>
        
        <div class="signatures">
            <div class="signature-block">
                <div class="signature-line"></div>
                <div class="signature-name">Fdo.: Joaquín Castilla</div>
                <div class="signature-title">Presidente</div>
                <div class="signature-title">Fundación Española de Enfermedades Priónicas</div>
            </div>
            
            <div class="signature-block">
                <div class="signature-line"></div>
                <div class="signature-name">Fdo.: Izaro Kortazar</div>
                <div class="signature-title">Facultativo especialista en neurología</div>
                <div class="signature-title">Responsable del Proyecto</div>
            </div>
        </div>
        
        <div class="footer-note">
            <p><strong>Nota:</strong> Este documento tiene validez como justificante oficial de asistencia a donación de sangre.</p>
            <p><em>Sello de la Fundación</em></p>
        </div>
    </div>
</body>
</html>`;
        
        // Abrir en nueva ventana
        const newWindow = window.open('', '_blank', 'width=800,height=600,scrollbars=yes,resizable=yes');
        if (newWindow) {
            newWindow.document.open();
            newWindow.document.write(htmlContent);
            newWindow.document.close();
            alert('¡Certificado HTML abierto en nueva ventana! Puedes imprimirlo usando Ctrl+P o el botón "🖨️ Imprimir".');
        } else {
            alert('No se pudo abrir la nueva ventana. Por favor, permite ventanas emergentes y vuelve a intentarlo.');
        }
        
    } catch (error) {
        alert('Error al generar el certificado HTML: ' + error.message);
    }
}

// Función para cerrar modal
function closeModal() {
    const modal = document.querySelector('.modal');
    if (modal) {
        document.body.removeChild(modal);
    }
}
