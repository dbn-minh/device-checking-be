import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class Device extends Model {
  static init(sequelize, DataTypes) {
  return super.init({
    deviceID: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    deviceName: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    description: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    coordinates: {
      type: DataTypes.STRING(255),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'Device',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "deviceID" },
        ]
      },
    ]
  });
  }
}
