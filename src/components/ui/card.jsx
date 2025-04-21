export function Card({ children, className = "", ...props }) {
    return (
      <div className={`rounded-2xl shadow p-2 bg-white ${className}`} {...props}>
        {children}
      </div>
    );
  }
  
  export function CardContent({ children, className = "" }) {
    return <div className={`text-center ${className}`}>{children}</div>;
  }