import {Link} from "react-router";

export function HomePage() {
  return <div>
    <Link to="/item/34" viewTransition>Item</Link>
    <span>Heello home</span>
  </div>
}