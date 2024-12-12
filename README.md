# Cypress Testing Project

This project is built using Cypress for end-to-end testing. It includes custom commands to navigate sections, interact with products, handle cart operations, and process payments. Tests are written in TypeScript to leverage strong typing and improve code quality.

---

## **Project Structure**

The project follows a modular structure, organizing custom commands into logical categories for better maintainability.

---

## **Setup Instructions**

To set up this Cypress project on your local machine, follow the steps below:

### **1. Clone the Project**
create a directory where you want to clone the folder, open it and run this command:
```
git clone <repository-url>
```

### **2. Install Dependencies**
The project uses \`npm\` for dependency management. Make sure you have Node.js installed on your system. then run this command:

```
npm install
```


### **3. Run Cypress Tests**
Once dependencies are installed, you can execute Cypress tests as follows:

- **Open Cypress Test Runner (Interactive Mode):**
 
```  
npx cypress open
```


- **Run Tests in Headless Mode:**

```  
npx cypress run
```

---

## **Test Dependencies: Fixtures**

This project uses fixture files to store test data that can be reused throughout different test cases. Below are the key fixture files:

### **1. `payment.json`**
Used for storing payment data for the `cy.handlePayment()` command. Example:

\`\`\`json
{
"email": "user@example.com",
"validCard": {
"cardNumber": "4242424242424242",
"expiry": "12/34",
"cvc": "123",
"zip": "12345"
}
}
\`\`\`

### **2. `productData.json`**
Used for storing product-related details for tests that verify or interact with products (e.g., checking product names, prices, etc.). This file provides reusable test data for consistency.

Example `cypress/fixtures/productData.json`:

\`\`\`json
{
"moisturizer": ["Aloe" , "Almond"],
"sunscreen" : ["SPF-30" , "SPF-50"]
}
\`\`\`

---

const fs = require('fs');

// Define the README content
const readmeContent = `
# Cypress Testing Project

This project is built using Cypress for end-to-end testing. It includes custom commands to navigate sections, interact with products, handle cart operations, and process payments. Tests are written in TypeScript to leverage strong typing and improve code quality.

---

## **Project Structure**

The project follows a modular structure, organizing custom commands into logical categories for better maintainability.

\`\`\`
cypress/
├── fixtures/
│   ├── payment.json         # Sample data used in tests (e.g., payment details)
│   ├── productData.json     # Test data for product-related operations
├── support/
│   ├── constants.ts         # Centralized constants for the project
│   ├── commands/
│   │   ├── cartCommands.ts          # Commands for cart operations
│   │   ├── productCommands.ts       # Commands for product verification & actions
│   │   ├── navigationCommands.ts    # Commands for navigation
│   │   ├── paymentCommands.ts       # Commands for the payment process
│   ├── e2e.ts                # Cypress setup and custom commands loader
├── e2e/
│   └── ...                   # Your test files are stored here
└── cypress.config.ts          # Cypress configuration file
\`\`\`

---

## **Setup Instructions**

To set up this Cypress project on your local machine, follow the steps below:

### **1. Clone the Project**
\`\`\`bash
git clone <repository-url>
cd <project-folder>
\`\`\`

### **2. Install Dependencies**
The project uses \`npm\` for dependency management. Make sure you have Node.js installed on your system.

\`\`\`bash
npm install
\`\`\`

### **3. Run Cypress Tests**
Once dependencies are installed, you can execute Cypress tests as follows:

- **Open Cypress Test Runner (Interactive Mode):**
  \`\`\`bash
  npx cypress open
  \`\`\`

- **Run Tests in Headless Mode:**
  \`\`\`bash
  npx cypress run
  \`\`\`

---

## **Centralized Constants**

The project uses centralized constants defined in \`cypress/support/constants.ts\`. This ensures consistent values across all tests and reduces duplication.

### **Defined Constants**
Here are the constant values used across the project:

\`\`\`typescript
export const constants = {
temperatureRange: {
low: 19,
high: 34,
},
urls: {
homepage: 'https://weathershopper.pythonanywhere.com/',
moisturizer: 'https://weathershopper.pythonanywhere.com/moisturizer',
sunscreen: 'https://weathershopper.pythonanywhere.com/sunscreen',
}
};
\`\`\`

---

## **Running Specific Tests**

To run specific tests or test files, use the following commands:

- **Run a Specific Test File:**
```
  npx cypress run --spec cypress/e2e/<test-file-name>.cy.ts
```

- **Run Tests Matching a Given Name (in interactive mode):**
  Use the \`it.only()\` or \`describe.only()\` keywords in that specific test file.

---

## **Test Coverage**

### **Positive Test Coverage**
The current implementation **only focuses on positive test cases**, ensuring that valid inputs and expected flows work as intended. For example:
- Payment is tested with valid payment data only.
- Navigation and product interaction are tested with intended scenarios.

---

## **Contact**

If you have any questions or issues with this project, please let me know ;

- **Email**: [nilu.nassiri@gmail.com](mailto:nilu.nassiri@gmail.com)
- **LinkedIn**: [My LinkedIn](https://www.linkedin.com/in/nilu-nassiri)
