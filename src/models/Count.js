import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class Count extends Model {
  static init(sequelize, DataTypes) {
  return super.init({
    countID: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    scanID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Scan',
        key: 'scanID'
      }
    },
    deviceID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Device',
        key: 'deviceID'
      }
    },
    number: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'Count',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "countID" },
        ]
      },
      {
        name: "scanID",
        using: "BTREE",
        fields: [
          { name: "scanID" },
        ]
      },
      {
        name: "deviceID",
        using: "BTREE",
        fields: [
          { name: "deviceID" },
        ]
      },
    ]
  });
  }
}
