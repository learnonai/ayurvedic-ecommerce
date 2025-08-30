// Mock email service for development

const sendVerificationEmail = async (email, verificationCode, name) => {
  console.log('\n=================================');
  console.log('📧 EMAIL VERIFICATION CODE');
  console.log('=================================');
  console.log(`Email: ${email}`);
  console.log(`Name: ${name}`);
  console.log(`CODE: ${verificationCode}`);
  console.log('=================================\n');
  
  return true;
};

const sendOrderConfirmation = async (email, orderDetails) => {
  console.log(`📧 Order confirmation sent to ${email}`);
  console.log(`Order ID: ${orderDetails.orderId}`);
  return true;
};

module.exports = { sendVerificationEmail, sendOrderConfirmation };