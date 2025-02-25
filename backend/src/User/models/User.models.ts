import { Model, DataTypes } from "sequelize";
import { sequelize } from "../../config/connection";

class User extends Model {
  public id!: number;
  public nom!: string;
  public prenom!: string;
  public email!: string;
  public password!: string;
  public is_admin!: boolean;

}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
  },
  prenom: {
      type: DataTypes.STRING,
      allowNull: false,
  },
  nom: {
      type: DataTypes.STRING,
      allowNull: false,
  },
  email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
  },
  password: {
      type: DataTypes.STRING,
      allowNull: false,
  },

  is_admin: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
  },
  
  },

  {
    sequelize,
    tableName: "users",
    timestamps: true,
  }
);

export default User;
