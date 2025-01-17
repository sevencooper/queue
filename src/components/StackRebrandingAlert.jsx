import React from 'react'
import { Alert } from 'reactstrap'
import moment from 'moment'

const StackRebrandingAlert = () => {
  // Hide alert after April Fool's day
  if (moment().isAfter('2019-04-02 00:00:00.000-05')) return null

  return (
    <Alert color="primary" fade={false}>
      <span className="mr-3">We&apos;re rebranding to Stack@UML!</span>
      <strong>
        <a href="https://queue.illinois.edu/blog/stack">
          Read&nbsp;more&nbsp;→
        </a>
      </strong>
    </Alert>
  )
}

export default StackRebrandingAlert
