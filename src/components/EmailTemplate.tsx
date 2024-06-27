import React from 'react'

type EmailTemplateProps = {
  firstName: string;
  url: string
}

const EmailTemplate = ({ firstName, url }: Readonly<EmailTemplateProps>) => {
  console.log('url: ', url);
  return (
    <h1>Hello, {firstName}</h1>
  )
}

export default EmailTemplate