export interface Usuario {
    nome: string
    email: string
    password: string
    administrador: 'true' | 'false'
  }
  
  export function gerarUsuario(overrides: Partial<Usuario> = {}): Usuario {
    const id = `${Date.now()}${Math.floor(Math.random() * 1000)}`
    return {
      nome: `QA Teste ${id}`,
      email: `qa.${id}@teste.com`,
      password: 'senha123',
      administrador: 'false',
      ...overrides,
    }
  }