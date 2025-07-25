import { useContext } from 'react'
import NotificationContext from '../NotificationContext'



const Notification = () => {
  const [notification, notificationDispatch] = useContext(NotificationContext)
  const style = {
    display: notification ? '' : 'none',
    border: 'solid',
    padding: 10,
    borderWidth: 1,
    marginBottom: 5
  }

  return (
    <div style={style}>
      {notification}
    </div>
  )
}

export default Notification
