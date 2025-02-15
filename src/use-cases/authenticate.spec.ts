import { describe, expect, it, beforeEach } from "vitest";
import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { hash } from "bcrypt";
import { InvalidCredentialsError } from "./errors/invalid-credentials-error";
import { AuthenticateUseCase } from "./authenticate";

let usersRepository: InMemoryUsersRepository
let sut: AuthenticateUseCase

describe('Authenticate Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new AuthenticateUseCase(usersRepository)
  })

  it('should be able to authenticate', async () => {
    await usersRepository.create({
      name: 'John',
      email: 'john@email.test',
      password: await hash('123456', 6)
    })

    const { user } = await sut.execute({
      email: 'john@email.test',
      password: '123456'
    })

    expect(user.id).toEqual(expect.any(String))
  })

  it('should not be able to authenticate with wrong password', async () => {
    await usersRepository.create({
      name: 'John',
      email: 'john@email.test',
      password: await hash('123456', 6)
    })

    await expect(
      sut.execute({
        email: 'john@email.test',
        password: '123456789'
      })
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })

  it('should not be able to authenticate with wrong email', async () => {
    await usersRepository.create({
      name: 'John',
      email: 'john@email.test',
      password: await hash('123456', 6)
    })

    await expect(
      sut.execute({
        email: 'johnwrongemail@email.test',
        password: '123456'
      })
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })
}) 