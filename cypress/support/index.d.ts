/// <reference types="cypress" />

declare namespace Cypress {
    interface Chainable<Subject = any> {

        addRandomProductsToCart(numberOfProducts: number): Chainable<void>;

        handlePayment(): Chainable<void>;

        validatePaymentSuccess(): Chainable<void>;

        navigateToSection(section: string, buttonSelector: string, headerText: string): void

        verifyProductsExist(productName: any, selectors: any): void

        addLeastExpensiveProduct(productName: any, selectors: any): Cypress.Chainable<number>

        verifyProductStructure(selectors: any): void

        assertCartButtonText(selectors: any, expectedText: any): void

        addProductAndCheckCartText(productName: any, selectors: any, expectedCartText: any): void
    }
}