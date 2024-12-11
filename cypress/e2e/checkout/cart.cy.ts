describe('Weather Shopper - Sunscreen Shopping and Payment', () => {
    beforeEach(() => {
        cy.visit('https://weathershopper.pythonanywhere.com/sunscreen');
    });

    it('should shop for sunscreens and complete the payment successfully', () => {
        // Add random products to the cart
        cy.addRandomProductsToCart(2);

        // Proceed to cart
        cy.contains('button', 'Cart').click();
        cy.url().should('include', '/cart');
        cy.get('tr').should('have.length.greaterThan', 1);

        // Handle payment
        cy.handlePayment();

        // Validate payment success
        cy.validatePaymentSuccess();
    });
});