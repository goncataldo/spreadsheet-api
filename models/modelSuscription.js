const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class modelSuscription extends Model {
    static associate(models) {
     
    }
  }
   modelSuscription.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false
      },
      company: {
        type: DataTypes.STRING,
        allowNull: false
      },
      number: {
        type: DataTypes.BIGINT,
        allowNull: false
      }
    },
    {
      sequelize,
      modelName: "suscriptions",
      timestamps: true,
      createdAt: "created_at", // alias createdAt as created_date
      updatedAt: false,
      paranoid: false,
    }
  );
  return modelSuscription;
};