const storage = require('./initializeFirebase');
const expirationDate = new Date();
expirationDate.setHours(expirationDate.getHours() + 1);
const getDownloadURL = (filePath) => {
  return storage.bucket().file(filePath).getSignedUrl({
    action: 'read',
    expires: expirationDate,
  });
}

const getFile = (filePath) => {
  const fileStream = storage.bucket().file(filePath).createReadStream();
  return fileStream
};

const mime = require('mime-types');
async function getFileAsBuffer(filePath) {
  try {
    const file = storage.bucket().file(filePath);

    const [fileBuffer] = await file.download();

    const contentType = mime.lookup(filePath); // Detect the Content-Type

    return { content: fileBuffer, contentType };
  } catch (error) {
    console.error('Error downloading the file:', error);
    throw error;
  }



}


async function sendFile(fileBuffer) {
  // Prepare a response
  const response = {
    statusCode: 200, // You can set the appropriate status code
    headers: {
      'Content-Type': fileBuffer.contentType, // Set the content type based on your file type
    },
    body: fileBuffer.content.toString('base64'), // Convert the buffer to base64 for binary data
    isBase64Encoded: true, // Specify that the body is base64 encoded
  };
  return response;

}

async function getAndSendFile(filePath) {
  const fileBuffer = await getFileAsBuffer(filePath);
  return await sendFile(fileBuffer);
}



module.exports = { getDownloadURL, getFile, getFileAsBuffer, sendFile, getAndSendFile };

