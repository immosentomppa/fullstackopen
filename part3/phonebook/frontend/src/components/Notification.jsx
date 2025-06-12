const Notification = ({ message, type }) => {
  if (message === null) {
    return null
  }
  const messageClass = type === 'success' ? 'success' : 'error'
  return (
    <div className={messageClass}>
      {message}
    </div>
  )
}

export default Notification