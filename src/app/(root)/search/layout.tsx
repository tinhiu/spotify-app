import React, { PropsWithChildren } from 'react'

type Props = PropsWithChildren<{}>

const Layout = ({ children }: Props) => {
  return (
    <>
      {children}
    </>
  )
}

export default Layout