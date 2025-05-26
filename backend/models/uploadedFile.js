'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UploadedFile extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  UploadedFile.init({
    original_name: DataTypes.STRING,
    file_name: DataTypes.STRING,
    file_path: DataTypes.STRING,
    mime_type: DataTypes.STRING,
    size_bytes: DataTypes.INTEGER,
    upload_timestamp: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'UploadedFile',
    tableName: 'uploaded_files', // Explicitly define table name
    timestamps: false // Assuming you don't have createdAt/updatedAt, or upload_timestamp serves this
  });
  return UploadedFile;
};
