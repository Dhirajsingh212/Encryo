'use server'

export const fetchUserRepos = async (username: string) => {
  const response = await fetch(
    `https://api.github.com/users/${username}/repos?sort=created&direction=desc&per_page=100`
  )
  const res = await response.json()
  if ((res as any).status) {
    return []
  }
  return res
}
