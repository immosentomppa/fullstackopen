const Header = (props) => <h1>{props.course}</h1>

const Content = ({parts}) => {
  return (
    <div>
      {parts.map((part, i) =>
        <Part key={i} part={part} />
      )}
    </div>
  )
}

const Part = ({part}) => {
  return (
    <p>
      {part.name} {part.exercises}
    </p>
  )
}

const Total = ({course}) =>  {
  const total = course.parts.reduce((sum, part) => sum + part.exercises, 0)
  return (
    <b>total of {total} exercises</b>
  )

}
const Course = ({courses}) => {
  return (
    <>
      {courses.map((course) =>
        <div key={course.id}>
          <Header course={course.name} />
          <Content parts={course.parts} />
          <Total course={course} />
        </div>
        )}
    </>
  )
}

export default Course