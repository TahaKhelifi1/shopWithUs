import Product from "./Product/models/Product.model";
import User from "./User/models/User.models";
import Order from "./Order/models/Order.models";

const defineAssociations = () => {
    // User-Order: One-to-Many
    User.hasMany(Order, {
        foreignKey: 'userId',
        as: 'orders',
    });

    Order.belongsTo(User, {
        foreignKey: 'userId',
        as: 'user',
    });

    //Product-Order: Many-to-Many
    Product.belongsToMany(Order, {
        through: 'cart',
        foreignKey: 'productsId',
        as: 'orders',
    });
    Order.belongsToMany(Product, {
        through: 'cart',
        foreignKey: 'OrderstId',
        as: 'products',
    });
    
};

export default defineAssociations;
