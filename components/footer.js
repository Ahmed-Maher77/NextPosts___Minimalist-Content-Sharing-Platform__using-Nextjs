export default function Footer() {
  // Auto-updating year
  const currentYear = new Date().getFullYear();

  return (
    <footer id="main-footer" role="contentinfo">
      <div className="footer-container">
        <p>
          Copyright &copy; {currentYear}.
          Developed By <a href="https://www.linkedin.com/in/ahmed-maher-algohary" title="About Developer" target="_blank" rel="noopener noreferrer">Ahmed Maher</a> {/* security: prevents tab-napping */}
        </p>
        <span>All Rights Reserved</span>
      </div>
    </footer>
  );
}
