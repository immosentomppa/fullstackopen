import { useSelector } from "react-redux"

const Notification = () => {

  const notification = useSelector(state => state.notification)
  const style = {
    display: notification ? '' : 'none',
    border: 'solid',
    padding: 10,
    borderWidth: 1
  }
  return (
    <div style={style}>
      {notification}
    </div>
  )
}

export default Notification