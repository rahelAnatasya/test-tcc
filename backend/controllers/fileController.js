const path = require('path');
// const dbConfig = require('../config/db'); // No longer needed for direct connection here
const { UploadedFile } = require('../models'); // Import Sequelize model

const serveFrontend = (req, res) => {
    // Serve the main HTML page of the frontend
    res.sendFile(path.join(__dirname, '../../frontend/index.html'));
};

const uploadFile = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded.' });
    }

    try {
        // Prepare data for insertion
        const { filename, path: filePath, mimetype, size } = req.file;
        const originalName = req.file.originalname;
        const uploadTimestamp = new Date();

        // Use Sequelize to create a new record
        const newFile = await UploadedFile.create({
            original_name: originalName,
            file_name: filename,
            file_path: filePath, // Store the actual disk path
            mime_type: mimetype,
            size_bytes: size,
            upload_timestamp: uploadTimestamp,
        });

        console.log('File metadata inserted with ID:', newFile.id);
        res.status(201).json({
            message: 'File uploaded and metadata saved successfully!',
            fileId: newFile.id,
            fileName: filename,
            filePath: `/uploads/${filename}` // Path to access the file if serving statically
        });

    } catch (error) {
        console.error('Error during file upload or DB operation:', error);
        // Sequelize validation errors can be caught here if defined in the model
        if (error.name === 'SequelizeValidationError') {
            return res.status(400).json({ message: error.errors.map(e => e.message).join(', ') });
        }
        if (error.name === 'SequelizeDatabaseError' || error.name === 'SequelizeConnectionError') {
            res.status(500).json({ message: 'Database operation error. Please check server logs and database connection.' });
        } else if (error.message === 'Error: Images Only!') { // This error comes from multer middleware
             res.status(400).json({ message: error.message });
        } else {
            res.status(500).json({ message: 'Server error during upload.' });
        }
    }
    // No need to manually close connection, Sequelize handles it.
};

module.exports = {
    serveFrontend,
    uploadFile,
};
