/// <reference types="cypress" />

describe('Simulações de testes com intercept', () => {

  beforeEach(() => {
    cy.visit('login.html')
    cy.setCookie('jwt_education_shown', 'true')
  });

  it('Deve fazer login com sucesso com usuário comum - usando comando customizado', () => {
    cy.intercept('POST', 'api/login',
      {
        statusCode: 200,
        body: {
          token: 'token123',
          name: 'Usuário de teste'
        }
      }).as('loginMock')

    cy.login('usuario@teste.com', 'user123')
    cy.wait('@loginMock')
    cy.get('h4').should('contain', 'Olá')
  })

  it('Deve simular um erro do servidor', () => {
    cy.intercept('POST', 'api/login', {
      statusCode: 500
    }).as('erroServer')
    cy.loginErro('usuario@teste.com', 'user123')
    cy.wait('@erroServer')
    cy.get('#alert-container').should('contain', 'Erro de conexão. Tente novamente.')
  });

  it('Deve simular um erro do cliente', () => {
    cy.intercept('POST', 'api/login', {
      statusCode: 400, body: { erro: 'erro do cliente' }
    }).as('erroClient')
    cy.login('usuario@teste.com', 'user123', false)
    cy.wait('@erroClient')
    cy.get('#alert-container').should('contain', 'Erro ao fazer login')
  });

const reservas = {
    "reservations": [
        {
            "id": 3,
            "status": "active",
            "reservation_date": "2026-05-07 13:27:21",
            "pickup_deadline": "2026-05-09T13:27:21.185Z",
            "pickup_date": null,
            "return_deadline": null,
            "return_date": null,
            "notes": "",
            "renewal_count": 0,
            "title": "Livro de Teste",
            "author": "Sun Tzu",
            "category": "Estratégia",
            "cover_image": "arte-da-guerra.jpg",
            "isbn": "978-85-AUTO-0006-8",
            "editor": "Editora Nova Fronteira",
            "language": "Português",
            "calculated_status": "active",
            "hours_remaining": 47
        }
    ],
    "statistics": {
        "active": 1,
        "pickedUp": 0,
        "returned": 0,
        "cancelled": 0,
        "overdue": 0,
        "expired": 0
    },
    "pagination": {
        "total": 1,
        "limit": 20,
        "offset": 0,
        "hasNext": false,
        "hasPrev": false,
        "showing": 1
    },
    "filters": {
        "status": "all",
        "orderBy": "desc"
    }
}

it('Deve exibir as resevas com intercept', () => {
 cy.login('usuario@teste.com', 'user123')
 cy.get('h4').should('contain', 'Olá')
 cy.intercept('GET', 'api/reservations*', {
    statusCode: 200,
    body: reservas
 }).as('listarReservas')
 cy.visit('reservations.html')
 cy.get('#alert-container > .d-flex > div > .btn-outline-primary').click()
 cy.wait('@listarReservas')
})

  it('Deve fazer login com sucesso com usuário admin - usando comando customizado', () => {
    cy.login(Cypress.env('ADMIN_EMAIL'), Cypress.env('ADMIN_SENHA'))
    cy.get('h1').should('contain', 'Painel Administrativo')
  })

  it('Deve fazer login com sucesso com usuário comum - usando intercept', () => {
    cy.intercept('POST', 'api/login',
      {
        statusCode: 200,
        body: {
          token: 'token123',
          name: 'Usuário de teste'
        }
      }).as('loginMock')

    cy.login('usuario@usuario.com', 'testeuser123')
    cy.wait('@loginMock')
    cy.get('h4').should('contain', 'Olá')

  })

  it('Deve simular um erro do servidor - usando intercept', () => {
    cy.intercept('POST', 'api/login', {
      statusCode: 500
    }).as('erroServer')
    cy.loginErro('usuario@teste.com', 'user123')
    cy.wait('@erroServer')
    cy.get('#alert-container').should('contain', 'Erro de conexão. Tente novamente.')
  });

  it('Deve simular um erro do cliente - usando intercept', () => {
    cy.intercept('POST', 'api/login', {
      statusCode: 400, body: { erro: 'erro do cliente' }
    }).as('erroClient')
    cy.login('usuario@teste.com', 'user123', false)
    cy.wait('@erroClient')
    cy.get('#alert-container').should('contain', 'Erro ao fazer login')
  });

})