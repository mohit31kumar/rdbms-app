export default function Callout({ type = 'info', title, children }) {
  const styles = {
    info: 'bg-blue-50 border-blue-500 text-blue-800',
    warning: 'bg-yellow-50 border-yellow-500 text-yellow-800',
    success: 'bg-green-50 border-green-500 text-green-800',
    danger: 'bg-red-50 border-red-500 text-red-800',
    teacher: 'bg-purple-50 border-purple-500 text-purple-800',
  };
  return (
    <div className={`p-4 rounded-lg border-l-4 mt-4 ${styles[type]}`}>
      {title && <div className="font-bold mb-1">{title}</div>}
      <div className="text-sm">{children}</div>
    </div>
  );
}
