describe('Shopping for Moisturizers', () => {
    it('should add the least expensive Aloe and Almond moisturizers to the cart', () => {
        cy.visit('https://weathershopper.pythonanywhere.com/moisturizer');

        const aloeProducts: { price: number; button: JQuery<HTMLElement> }[] = [];
        const almondProducts: { price: number; button: JQuery<HTMLElement> }[] = [];

        cy.get('.text-center.col-4').each(($product) => {
            const productName = $product.find('p').first().text();
            const priceText = $product.find('p:contains("Price:")').text();
            const price = parseInt(priceText.match(/\d+/)?.[0] || '0');
            const addButton = $product.find('button');


            if (productName.includes('Aloe')) {
                aloeProducts.push({ price, button: addButton });
            } else if (productName.includes('Almond')) {
                almondProducts.push({ price, button: addButton });
            }
        });

        cy.then(() => {
            const leastExpensiveAloe = aloeProducts.reduce((prev, curr) =>
                prev.price < curr.price ? prev : curr
            );

            const leastExpensiveAlmond = almondProducts.reduce((prev, curr) =>
                prev.price < curr.price ? prev : curr
            );

            cy.wrap(leastExpensiveAloe.button).click();

            cy.wrap(leastExpensiveAlmond.button).click();
        });

        cy.contains('button', 'Cart').click();

        // Assert
        cy.url().should('include', '/cart');
        cy.get('tr').should('contain.text', 'Aloe');
        cy.get('tr').should('contain.text', 'Almond');
    });
});