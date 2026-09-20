export default function InfoTerm({ children, detail }) {
  return <span className="info-term" tabIndex="0">{children}<span className="info-icon" aria-hidden="true">i</span><span className="info-tooltip" role="tooltip">{detail}</span></span>
}