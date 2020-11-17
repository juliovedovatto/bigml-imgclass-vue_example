import { Auth, Project } from '../index'
import { TEST_API_KEY, TEST_API_USER } from '@/core/config'

describe('@/core/api/project', () => {
  let projectId = null

  beforeAll(async () => {
    const { access } = await Auth.token(TEST_API_USER, TEST_API_KEY)

    Object.defineProperty(window.document, 'cookie', {
      writable: true,
      value: `accessToken=${access}`
    })
  })

  test('Should create a project', async () => {
    const name = 'Test Project'
    const project = { name }

    const { data } = await Project.create(project)

    expect(data).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        name: expect.stringMatching(name)
      })
    )

    projectId = data?.id || null
  })

  test('Should list projects', async () => {
    const {
      data: { results }
    } = await Project.list()

    expect(results).toEqual(expect.arrayContaining([expect.objectContaining({ id: projectId })]))
  })

  // TODO: add more tests
})
