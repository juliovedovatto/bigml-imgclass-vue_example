import Project from '../project'

// TODO: solve circular reference hell (Jest + Node fault)
// TODO: implemente JWT Auth

describe('@/core/api/project', () => {
  let projectId = null

  test('Should create a project', async () => {
    const name = 'Test Project'
    const data = { name }

    const result = await Project.create(data)

    expect(result).objectContaining({
      id: expect.any(String),
      name: expect.stringMatching(name)
    })

    projectId = result?.id || null
  })
  test('Should list projects', async () => {
    const result = await Project.list()

    expect(result).arrayContaining(expect.objectContaining({ id: projectId }))
  })
})
