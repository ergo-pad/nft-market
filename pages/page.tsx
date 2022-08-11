import type { NextPage } from 'next'
import { Container } from '@mui/material'
import ButtonLink from '@components/ButtonLink'

const Page: NextPage = () => {
  return (
    <Container>
      <ButtonLink
        href="/"
      >
        Home
      </ButtonLink>
    </Container>
  )
}

export default Page
