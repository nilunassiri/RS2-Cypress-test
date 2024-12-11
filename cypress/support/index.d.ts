/// <reference types="cypress" />

declare namespace Cypress {
    interface Chainable<Subject = any> {

        addRandomProductsToCart(numberOfProducts: number): Chainable<void>;

        handlePayment(): Chainable<void>;

        validatePaymentSuccess(): Chainable<void>;
    }
}