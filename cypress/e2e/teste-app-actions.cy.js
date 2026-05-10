/// <reference types="cypress" />

describe('Login no hub de leitura', () => {

    beforeEach(() => {
       cy.visit('login.html')
        cy.setCookie('jwt_education_shown', 'true')
    });

    it('Deve fazer login com sucesso com usuário comum - sem app actions', () => {
        cy.login('usuario@teste.com', 'user123')
        cy.get('h4').should('contain', 'Olá')
    })
    it('Deve fazer login com sucesso com usuário comum - via api', () => {
        cy.request({
            method: 'POST',
            url: 'api/login',
            body: {
                "email": "usuario@teste.com",
                "password": "user123"
            }
        }).then((response) => {
            expect(response.status).to.equal(200)
            //Criar o estado da aplicação
            window.localStorage.setItem('authToken', response.body.token)
            window.localStorage.setItem('isAdmin', 'false')
            window.localStorage.setItem('userId', response.body.userId)
            window.localStorage.setItem('userName', response.body.name)
            cy.visit('dashboard.html')
            cy.get('h4').should('contain', 'Olá')
        })
    })

    it('Deve fazer login com sucesso com usuário comum - setando o token', () => {
        let token = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJ1c3VhcmlvQHRlc3RlLmNvbSIsImlzQWRtaW4iOmZhbHNlLCJpYXQiOjE3NzgxNjQ1ODcsImV4cCI6MTc3ODE5MzM4N30.6IL_U95XuLodVgsMTdmXJO4iIyfV7U9aI5F4sUWJ-4M"
        window.localStorage.setItem('authToken', token)
        cy.visit('dashboard.html')
        cy.get('h4').should('contain', 'Olá')
    });

    it('Deve fazer login com sucesso com usuário admin - usando comando customizado', () => {
        cy.setCookie('jwt_education_shown', 'true')

        cy.login(Cypress.env('ADMIN_EMAIL'), Cypress.env('ADMIN_SENHA'))
        cy.get('h1').should('contain', 'Painel Administrativo')
/*
        cy.wait(10000)
        cy.clearCookie('jwt_education_shown')
        cy.reload() */
    })

it.skip('Deve mudar o idioma do site da EBAC via cookie', () => {
    cy.visit('https://lms.ebaconline.com.br/')
    cy.setCookie('i18next', 'en')
    cy.reload()
});




})
