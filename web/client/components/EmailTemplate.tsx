import {
  Body,
  Button,
  Container,
  Head,
  Html,
  Preview,
  Section,
  Text
} from '@react-email/components'
import * as React from 'react'

interface EmailTemplateProps {
  email: string
  plan: string
}

export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
  email,
  plan
}) => (
  <Html>
    <Head />
    <Preview>Encryo membership request.</Preview>
    <Body style={main}>
      <Container style={container}>
        <Text style={paragraph}>Hi Admin,</Text>
        <Text style={paragraph}>
          Welcome to Encryo, {email} has requested for {plan} plan.
        </Text>
        <Section style={btnContainer}>
          <Button style={button} href={process.env.NEXT_PUBLIC_EMAIL_URL}>
            Approve
          </Button>
        </Section>
        <Text style={paragraph}>
          Best,
          <br />
          The Encryo team
        </Text>
      </Container>
    </Body>
  </Html>
)

const main = {
  backgroundColor: '#ffffff',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif'
}

const container = {
  margin: '0 auto',
  padding: '20px 0 48px'
}

const paragraph = {
  fontSize: '16px',
  lineHeight: '26px'
}

const btnContainer = {
  textAlign: 'center' as const
}

const button = {
  backgroundColor: '#5F51E8',
  borderRadius: '3px',
  color: '#fff',
  fontSize: '16px',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'block',
  padding: '12px'
}
