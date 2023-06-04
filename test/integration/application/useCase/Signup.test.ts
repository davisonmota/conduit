import Login from '../../../../src/application/useCase/Login'
import Signup from '../../../../src/application/useCase/Signup'
import UserRepositoryMemory from '../../../../src/infra/repository/memory/UserRepositoryMemory'

describe('Signup', () => {
  test('Deve fazer signup', async () => {
    const userRepository = new UserRepositoryMemory()
    const signup = new Signup(userRepository, userRepository, userRepository)
    const inputSignup = {
      username: 'davison',
      email: 'davison@gmail.com',
      password: '123456789'
    }
    await signup.execute(inputSignup)

    const login = new Login(userRepository)
    const inputLogin = {
      email: 'davison@gmail.com',
      password: '123456789'
    }
    const user = await login.execute(inputLogin)

    expect(user.username).toBe('davison')
    expect(user.email).toBe('davison@gmail.com')
    expect(user.token).toBeTruthy()
  })
})
