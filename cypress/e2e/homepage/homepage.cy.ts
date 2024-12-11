describe('Weather Shopper - Homepage', () => {
    const selectors = {
        temperature: 'span#temperature',
        moisturizerButton: 'a[href="/moisturizer"]',
        sunscreenButton: 'a[href="/sunscreen"]',
        header: 'h2',
    };

    const temperatureRange = {
        low: 19,
        high: 34,
    };

    beforeEach(() => {
        cy.visit('https://weathershopper.pythonanywhere.com/');
    });

    it('should display the temperature and navigation buttons for Moisturizers and Sunscreens', () => {
        cy.get(selectors.temperature).should('be.visible');

        cy.get(selectors.moisturizerButton)
            .should('be.visible')
            .and('contain', 'Buy moisturizers');

        cy.get(selectors.sunscreenButton)
            .should('be.visible')
            .and('contain', 'Buy sunscreens');
    });

    it('should navigate to the respective product page based on temperature conditions', () => {
        cy.get(selectors.temperature).then(($temp) => {
            const temperature = parseInt($temp.text(), 10);

            if (temperature < temperatureRange.low) {
                cy.navigateToSection('moisturizer', selectors.moisturizerButton, 'Moisturizers');
            } else if (temperature > temperatureRange.high) {
                cy.navigateToSection('sunscreen', selectors.sunscreenButton, 'Sunscreens');
            } else {
                throw new Error(`Temperature (${temperature}) did not fall into a valid range!`);
            }
        });
    });
});