import {sequelize} from './config/connection';
import User from './User/models/User.models';
import Product from './Product/models/Product.model';
import Order from './Order/models/Order.models';

const syncDatabase = async () => {
  const models = [
    { name: 'users', model: User },
    { name: 'products', model: Product },
    { name: 'orders', model: Order }
  ];

  const table = await sequelize.getQueryInterface().showAllTables();
  console.log('Starting database synchronization...');
  try {
      // check the existence of the table in the database
      for (const { model } of models) {
          if(table.includes(model.tableName)){
              console.log(`Table ${model.tableName} already exists.`);
          } else {
              // Synchronize all models
              await sequelize.sync(); // This will update tables to match models
              console.log('Database synchronized successfully.');
          }
      }
  } catch (error) {
      console.error('Error synchronizing database:', error);
  }

};

// Execute the sync function
syncDatabase().catch(error => {
  console.error('Unexpected error during database synchronization:', error);
});

export default syncDatabase;