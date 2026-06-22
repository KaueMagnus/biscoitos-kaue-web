import { Link } from 'react-router-dom'

type SummaryCardProps = {
  title: string
  description: string
  to: string
  action: string
}

export function SummaryCard({
  title,
  description,
  to,
  action,
}: SummaryCardProps) {
  return (
    <article className="summary-card">
      <div>
        <h2>{title}</h2>
        <p>{description}</p>
      </div>

      <Link className="primary-link" to={to}>
        {action}
      </Link>
    </article>
  )
}
