const { AuthService } = require('./src/modules/auth/auth.service');
require('dotenv').config();

async function main() {
  const authService = new AuthService();
  try {
    const result = await authService.register('testuser@example.com', 'password123', 'Test User');
    console.log('User registered successfully:', result.user);
  } catch (error) {
    if (error.message.includes('already exists')) {
      console.log('User already exists, proceeding with verification.');
    } else {
      throw error;
    }
  }
}

main().catch(console.error);
