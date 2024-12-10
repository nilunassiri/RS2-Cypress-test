describe('Weather Shopper Homepage', () => {
    it('should navigate to the correct shop based on the temperature', () => {
        cy.visit('https://weathershopper.pythonanywhere.com/');

        // Get the temperature
        cy.get('#temperature').then(($temp: JQuery<HTMLElement>) => {
            const tempText: string = $temp.text();
            const tempValue: number = parseFloat(tempText.match(/[-]?\d+/)?.[0] || '0');

            cy.log(`Temperature: ${tempValue}`);

            // Make Decision
            if (tempValue < 19) {
                cy.contains('button', 'Buy moisturizers').click();
                cy.url().should('include', '/moisturizer');
            } else if (tempValue > 34) {
                cy.contains('button', 'Buy sunscreens').click();
                cy.url().should('include', '/sunscreen');
            } else {
                cy.log('Temperature is out of the defined range for shopping.');
            }
        });
    });
});