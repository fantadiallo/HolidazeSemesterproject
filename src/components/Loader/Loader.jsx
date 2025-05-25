export default function Loader() {
  return (
    <div style={{ textAlign: 'center', padding: '2rem' }}>
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );
}
