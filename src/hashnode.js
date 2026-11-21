const endpoint = 'https://gql-beta.hashnode.com'
const publication = 'https://blog.ashu.fun/'
const username = 'ashudotdev'
const formatDate = new Intl.DateTimeFormat('en-US', { dateStyle: 'long', timeZone: 'Asia/Kolkata' })

const query = `
  query PortfolioPosts($username: String!) {
    user(username: $username) {
      posts(first: 10) {
        edges {
          node {
            title
            url
            publishedAt
            readTimeInMinutes
            coverImage { url }
          }
        }
      }
    }
  }
`

export async function fetchBlogPosts(signal) {
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables: { username } }),
    signal,
  })

  if (!response.ok) throw new Error(`Hashnode returned HTTP ${response.status}`)

  const { data, errors } = await response.json()
  const edges = data?.user?.posts?.edges
  if (errors?.length || !Array.isArray(edges)) throw new Error('Hashnode did not return posts')

  return edges
    .map(({ node }) => node)
    .filter((post) => post?.title && post.url?.startsWith(publication) && Number.isFinite(Date.parse(post.publishedAt)))
    .sort((a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt))
    .slice(0, 3)
    .map((post) => ({
      title: post.title,
      url: post.url,
      dateTime: post.publishedAt,
      metadata: formatDate.format(new Date(post.publishedAt)),
      readTime: post.readTimeInMinutes ? `${post.readTimeInMinutes} min read` : '',
      image: post.coverImage?.url,
    }))
}
