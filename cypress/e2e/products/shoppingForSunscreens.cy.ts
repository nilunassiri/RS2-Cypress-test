describe('Shopping for Sunscreens', () => {
    it('should add the least expensive SPF-50 and SPF-30 sunscreens to the cart', () => {
        cy.visit('https://weathershopper.pythonanywhere.com/sunscreen');

        const spf50Products: { price: number; button: JQuery<HTMLElement> }[] = [];
        const spf30Products: { price: number; button: JQuery<HTMLElement> }[] = [];

        cy.get('.text-center.col-4').each(($product) => {
            const productName = $product.find('p').first().text();
            const priceText = $product.find('p:contains("Price:")').text();
            const price = parseInt(priceText.match(/\d+/)?.[0] || '0');
            const addButton = $product.find('button');

            if (productName.includes('SPF-50')) {
                spf50Products.push({ price, button: addButton });
            } else if (productName.includes('SPF-30')) {
                spf30Products.push({ price, button: addButton });
            }
        });

        cy.then(() => {
            const leastExpensiveSPF50 = spf50Products.reduce((prev, curr) =>
                prev.price < curr.price ? prev : curr
            );

            const leastExpensiveSPF30 = spf30Products.reduce((prev, curr) =>
                prev.price < curr.price ? prev : curr
            );

            cy.wrap(leastExpensiveSPF50.button).click();
            cy.wrap(leastExpensiveSPF30.button).click();
        });

        cy.contains('button', 'Cart').click();

        // Assert
        cy.url().should('include', '/cart');
        cy.get('tr').should('contain.text', 'SPF-50');
        cy.get('tr').should('contain.text', 'SPF-30');
    });
});