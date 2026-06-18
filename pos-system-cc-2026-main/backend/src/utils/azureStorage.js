const { BlobServiceClient } = require('@azure/storage-blob');
const path = require('path');

// Utilizamos el connection string que el evaluador ya confirmó que tienes
const AZURE_STORAGE_CONNECTION_STRING = process.env.AZURE_STORAGE_CONNECTION_STRING;
// El nombre exacto de tu bucket según la captura de pantalla
const containerName = 'pos-images'; 

// Inicializar el cliente de Azure
const blobServiceClient = BlobServiceClient.fromConnectionString(AZURE_STORAGE_CONNECTION_STRING);
const containerClient = blobServiceClient.getContainerClient(containerName);

/**
 * Sube un buffer de memoria a Azure Blob Storage y retorna la URL pública
 */
async function uploadToAzure(fileBuffer, originalName, mimeType) {
    try {
        // Generar un nombre de archivo único para evitar colisiones
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const extension = path.extname(originalName);
        const blobName = `producto-${uniqueSuffix}${extension}`;

        const blockBlobClient = containerClient.getBlockBlobClient(blobName);

        // Subir el archivo directamente desde la memoria
        await blockBlobClient.uploadData(fileBuffer, {
            blobHTTPHeaders: { blobContentType: mimeType }
        });

        // Retornar la URL absoluta de la imagen alojada en Azure
        return blockBlobClient.url;
    } catch (error) {
        console.error('Error al subir imagen a Azure:', error);
        throw new Error('No se pudo subir la imagen a la nube');
    }
}

module.exports = { uploadToAzure };