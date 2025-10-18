const Card = ({ children, className = '', hover = false }) => {
  return (
    <div
      className={`bg-white rounded-lg shadow ${
        hover ? 'hover:shadow-lg transition-shadow cursor-pointer' : ''
      } ${className}`}
    >
      {children}
    </div>
  )
}

export default Card
