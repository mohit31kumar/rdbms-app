import { useState } from 'react';

export default function SchemaDiagram() {
  const [active, setActive] = useState(null);

  const layers = [
    {
      id: 'external',
      title: 'External Level (User View)',
      subtitle: 'What individual users see',
      color: 'bg-blue-100 border-blue-500',
      icon: '🌐',
      content: (
        <div>
          <p className="mb-2"><strong>User-specific view of the database.</strong> Each user or group gets a customized external schema showing only the data they need.</p>
          <p className="mb-2"><strong>Example:</strong> An e-commerce site shows <em>Products</em> and <em>Orders</em> to customers, but <em>Customers</em> and <em>Inventory</em> to administrators.</p>
          <Callout type="teacher" title="Teaching Note">
            Think of this as different people looking at the same building — a resident sees their apartment, a manager sees the whole floor plan.
          </Callout>
        </div>
      ),
    },
    {
      id: 'conceptual',
      title: 'Conceptual Level (Logical Structure)',
      subtitle: 'What the database stores — unified view',
      color: 'bg-green-100 border-green-500',
      icon: '🧠',
      content: (
        <div>
          <p className="mb-2"><strong>The overall logical structure of the entire database.</strong> Describes what data is stored and the relationships between them.</p>
          <p className="mb-2">Mostly represented by the <strong>Entity-Relationship (ER) Model</strong>. This is the community view — all users share this conceptual schema.</p>
          <Callout type="teacher" title="Teaching Note">
            This is the building's architectural plan — it shows every room and hallway, regardless of who lives there.
          </Callout>
        </div>
      ),
    },
    {
      id: 'internal',
      title: 'Internal Level (Physical Storage)',
      subtitle: 'How data is actually stored',
      color: 'bg-yellow-100 border-yellow-500',
      icon: '💾',
      content: (
        <div>
          <p className="mb-2"><strong>Physical representation of the database on storage devices.</strong> Decides where and how data is stored.</p>
          <ul className="list-disc ml-5 mb-2 space-y-1">
            <li>Creates indexes for fast record access</li>
            <li>Compresses data to save space</li>
            <li>Partitions large tables for performance</li>
            <li>Includes security features at storage level</li>
          </ul>
          <Callout type="teacher" title="Teaching Note">
            This is the actual bricks, wires, and plumbing underneath the building. Users don't see it, but it makes everything work.
          </Callout>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-3">
      {layers.map((layer) => (
        <div
          key={layer.id}
          onClick={() => setActive(active === layer.id ? null : layer.id)}
          className={`p-4 rounded-lg cursor-pointer transition-all border-2 ${layer.color} ${active === layer.id ? 'ring-2 ring-blue-400' : ''}`}
        >
          <div className="font-bold text-lg">{layer.icon} {layer.title}</div>
          <div className="text-sm text-gray-600 mt-1">{layer.subtitle}</div>
          {active === layer.id && (
            <div className="mt-4 p-4 bg-white rounded-lg border border-gray-200 animate-fadeIn">
              {layer.content}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function Callout({ type, title, children }) {
  const styles = {
    info: 'bg-blue-50 border-blue-500 text-blue-800',
    warning: 'bg-yellow-50 border-yellow-500 text-yellow-800',
    success: 'bg-green-50 border-green-500 text-green-800',
    danger: 'bg-red-50 border-red-500 text-red-800',
    teacher: 'bg-purple-50 border-purple-500 text-purple-800',
  };
  return (
    <div className={`p-3 rounded-lg border-l-4 mt-3 text-sm ${styles[type] || styles.info}`}>
      {title && <div className="font-bold mb-1">{title}</div>}
      {children}
    </div>
  );
}
