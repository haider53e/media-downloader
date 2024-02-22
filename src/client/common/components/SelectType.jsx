export default function ({ children }) {
  return (
    <div className="d-grid gap-2 col-md-5 mx-auto mt-4">
      <span className="card-text text-accent text-center">Set media type</span>
      {children}
    </div>
  );
}
