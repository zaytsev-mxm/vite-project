It is common to see conditional rendering based on hover state of some element.

We can achieve it by CSS pseduo class :hover, but for more complex cases it might be better to have state controlled by script.

Now you are asked to create a useHover() hook.
```jsx
function App() {
  const [ref, isHovered] = useHover()
  return <div ref={ref}>{isHovered ? 'hovered' : 'not hovered'}</div>
}
```