import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { describe, it, beforeEach, expect } from "vitest";
import { GetUserProfileUseCase } from "./get-user-profile";
import { UsersRepository } from "@/repositories/users-repository";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";

let usersRepository: UsersRepository
let sut: GetUserProfileUseCase

describe('GetUserProfileUseCase', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new GetUserProfileUseCase(usersRepository)
  })

  it('should be able to get user profile', async () => {
    const userCreated = await usersRepository.create({
      name: 'John',
      email: 'john@email.test',
      password: '123456'
    })

    const { user } = await sut.execute({ userId: userCreated.id })

    expect(user.name).toEqual('John')
  })

  it('should be not able to get user profile with wrong id', async () => {
    await usersRepository.create({
      name: 'John',
      email: 'john@email.test',
      password: '123456'
    })

    await expect(sut.execute({ userId: 'wrong-id' })).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})