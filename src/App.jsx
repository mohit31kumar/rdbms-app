import { useState, useEffect } from 'react';
import './App.css';
import Quiz from './components/Quiz';
import ProgressBar from './components/ProgressBar';
import SchemaDiagram from './components/SchemaDiagram';
import Callout from './components/Callout';

function App() {
  const [activeNF, setActiveNF] = useState('original');
  const [selectedOp, setSelectedOp] = useState('selection');
  const [erHighlight, setErHighlight] = useState(null);

  const sectionIds = ['hero', 'fundamentals', 'architecture', 'datamodels', 'ermodel', 'distributed', 'rdbms', 'relational-algebra', 'anomalies', 'normalization', 'revision'];

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) return;
      const current = sectionIds.findIndex(id => {
        const el = document.getElementById(id);
        if (!el) return false;
        const rect = el.getBoundingClientRect();
        return rect.top <= window.innerHeight / 2 && rect.bottom >= window.innerHeight / 2;
      });
      const next = e.key === 'ArrowDown' ? current + 1 : current - 1;
      if (next >= 0 && next < sectionIds.length) {
        document.getElementById(sectionIds[next]).scrollIntoView({ behavior: 'smooth' });
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  const nfSteps = [
    {
      id: 'original',
      title: 'Original (Unnormalized)',
      table: (
        <table className="data-table">
          <thead><tr><th>EMP_ID</th><th>EMP_NAME</th><th>EMP_PHONE</th><th>EMP_STATE</th></tr></thead>
          <tbody>
            <tr><td>14</td><td>John</td><td className="bg-red-50">7272826385, 9064738238</td><td>UP</td></tr>
            <tr><td>20</td><td>Harry</td><td>8574783832</td><td>Bihar</td></tr>
            <tr><td>12</td><td>Sam</td><td className="bg-red-50">7390372389, 8589830302</td><td>Punjab</td></tr>
          </tbody>
        </table>
      ),
      explanation: 'Problem: EMP_PHONE contains multiple values (comma-separated). This violates atomicity — the core requirement of 1NF.',
    },
    {
      id: '1nf',
      title: '1NF — Atomic Values',
      table: (
        <table className="data-table">
          <thead><tr><th>EMP_ID</th><th>EMP_NAME</th><th>EMP_PHONE</th><th>EMP_STATE</th></tr></thead>
          <tbody>
            <tr><td>14</td><td>John</td><td>7272826385</td><td>UP</td></tr>
            <tr><td>14</td><td>John</td><td>9064738238</td><td>UP</td></tr>
            <tr><td>20</td><td>Harry</td><td>8574783832</td><td>Bihar</td></tr>
            <tr><td>12</td><td>Sam</td><td>7390372389</td><td>Punjab</td></tr>
            <tr><td>12</td><td>Sam</td><td>8589830302</td><td>Punjab</td></tr>
          </tbody>
        </table>
      ),
      explanation: 'Fix: Split multi-valued EMP_PHONE into separate rows. Each cell now holds a single atomic value.',
    },
    {
      id: '2nf',
      title: '2NF — No Partial Dependency',
      table: (
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <div className="font-bold mb-2 text-sm">TEACHER_DETAIL</div>
            <table className="data-table text-sm">
              <thead><tr><th>TEACHER_ID</th><th>TEACHER_AGE</th></tr></thead>
              <tbody>
                <tr><td>25</td><td>30</td></tr>
                <tr><td>47</td><td>35</td></tr>
                <tr><td>83</td><td>38</td></tr>
              </tbody>
            </table>
          </div>
          <div>
            <div className="font-bold mb-2 text-sm">TEACHER_SUBJECT</div>
            <table className="data-table text-sm">
              <thead><tr><th>TEACHER_ID</th><th>SUBJECT</th></tr></thead>
              <tbody>
                <tr><td>25</td><td>Chemistry</td></tr>
                <tr><td>25</td><td>Biology</td></tr>
                <tr><td>47</td><td>English</td></tr>
                <tr><td>83</td><td>Math</td></tr>
                <tr><td>83</td><td>Computer</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      ),
      explanation: 'Fix: Remove partial dependency. TEACHER_AGE depends only on TEACHER_ID (proper subset of candidate key), not the full composite key.',
    },
    {
      id: '3nf',
      title: '3NF — No Transitive Dependency',
      table: (
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <div className="font-bold mb-2 text-sm">EMPLOYEE</div>
            <table className="data-table text-sm">
              <thead><tr><th>EMP_ID</th><th>EMP_NAME</th><th>EMP_ZIP</th></tr></thead>
              <tbody>
                <tr><td>222</td><td>Harry</td><td>201010</td></tr>
                <tr><td>333</td><td>Stephan</td><td>02228</td></tr>
                <tr><td>444</td><td>Lan</td><td>60007</td></tr>
                <tr><td>555</td><td>Katharine</td><td>06389</td></tr>
                <tr><td>666</td><td>John</td><td>462007</td></tr>
              </tbody>
            </table>
          </div>
          <div>
            <div className="font-bold mb-2 text-sm">ZIP_LOCATION</div>
            <table className="data-table text-sm">
              <thead><tr><th>EMP_ZIP</th><th>EMP_STATE</th><th>EMP_CITY</th></tr></thead>
              <tbody>
                <tr><td>201010</td><td>UP</td><td>Noida</td></tr>
                <tr><td>02228</td><td>US</td><td>Boston</td></tr>
                <tr><td>60007</td><td>US</td><td>Chicago</td></tr>
                <tr><td>06389</td><td>UK</td><td>Norwich</td></tr>
                <tr><td>462007</td><td>MP</td><td>Bhopal</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      ),
      explanation: 'Fix: Remove transitive dependency. EMP_STATE and EMP_CITY depend on EMP_ZIP, which depends on EMP_ID. Non-prime attributes transitively depend on the key.',
    },
  ];

  const raOperations = {
    selection: {
      title: 'Selection (σ)',
      desc: 'Filters rows based on a condition. Like a WHERE clause in SQL.',
      input: (
        <table className="data-table text-sm">
          <thead><tr><th>BRANCH_NAME</th><th>LOAN_NO</th><th>AMOUNT</th></tr></thead>
          <tbody>
            <tr><td>Downtown</td><td>L-17</td><td>1000</td></tr>
            <tr><td>Redwood</td><td>L-23</td><td>2000</td></tr>
            <tr><td className="bg-blue-50">Perryride</td><td className="bg-blue-50">L-15</td><td className="bg-blue-50">1500</td></tr>
            <tr><td>Downtown</td><td>L-14</td><td>1500</td></tr>
            <tr><td>Mianus</td><td>L-13</td><td>500</td></tr>
            <tr><td>Roundhill</td><td>L-11</td><td>900</td></tr>
            <tr><td className="bg-blue-50">Perryride</td><td className="bg-blue-50">L-16</td><td className="bg-blue-50">1300</td></tr>
          </tbody>
        </table>
      ),
      output: (
        <table className="data-table text-sm">
          <thead><tr><th>BRANCH_NAME</th><th>LOAN_NO</th><th>AMOUNT</th></tr></thead>
          <tbody>
            <tr><td>Perryride</td><td>L-15</td><td>1500</td></tr>
            <tr><td>Perryride</td><td>L-16</td><td>1300</td></tr>
          </tbody>
        </table>
      ),
      notation: 'σ BRANCH_NAME="Perryride" (LOAN)',
    },
    projection: {
      title: 'Projection (π)',
      desc: 'Selects specific columns. Like SELECT in SQL.',
      input: (
        <table className="data-table text-sm">
          <thead><tr><th>NAME</th><th className="bg-blue-50">STREET</th><th className="bg-blue-50">CITY</th></tr></thead>
          <tbody>
            <tr><td>Jones</td><td className="bg-blue-50">Main</td><td className="bg-blue-50">Harrison</td></tr>
            <tr><td>Smith</td><td className="bg-blue-50">North</td><td className="bg-blue-50">Rye</td></tr>
            <tr><td>Hays</td><td className="bg-blue-50">Main</td><td className="bg-blue-50">Harrison</td></tr>
            <tr><td>Curry</td><td className="bg-blue-50">North</td><td className="bg-blue-50">Rye</td></tr>
            <tr><td>Johnson</td><td className="bg-blue-50">Alma</td><td className="bg-blue-50">Brooklyn</td></tr>
            <tr><td>Brooks</td><td className="bg-blue-50">Senator</td><td className="bg-blue-50">Brooklyn</td></tr>
          </tbody>
        </table>
      ),
      output: (
        <table className="data-table text-sm">
          <thead><tr><th>NAME</th><th>CITY</th></tr></thead>
          <tbody>
            <tr><td>Jones</td><td>Harrison</td></tr>
            <tr><td>Smith</td><td>Rye</td></tr>
            <tr><td>Hays</td><td>Harrison</td></tr>
            <tr><td>Curry</td><td>Rye</td></tr>
            <tr><td>Johnson</td><td>Brooklyn</td></tr>
            <tr><td>Brooks</td><td>Brooklyn</td></tr>
          </tbody>
        </table>
      ),
      notation: 'π NAME, CITY (CUSTOMER)',
    },
    union: {
      title: 'Union (∪)',
      desc: 'Combines rows from two union-compatible relations, removing duplicates.',
      input: (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="font-bold mb-2 text-sm">BORROW</div>
            <table className="data-table text-sm">
              <thead><tr><th>CUSTOMER_NAME</th></tr></thead>
              <tbody>
                <tr><td>Jones</td></tr>
                <tr><td>Smith</td></tr>
                <tr><td>Hayes</td></tr>
                <tr><td>Jackson</td></tr>
              </tbody>
            </table>
          </div>
          <div>
            <div className="font-bold mb-2 text-sm">DEPOSITOR</div>
            <table className="data-table text-sm">
              <thead><tr><th>CUSTOMER_NAME</th></tr></thead>
              <tbody>
                <tr><td>Johnson</td></tr>
                <tr><td>Smith</td></tr>
                <tr><td>Mayes</td></tr>
                <tr><td>Turner</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      ),
      output: (
        <table className="data-table text-sm">
          <thead><tr><th>CUSTOMER_NAME</th></tr></thead>
          <tbody>
            {['Johnson','Smith','Mayes','Turner','Jones','Hayes','Jackson'].map(n => <tr key={n}><td>{n}</td></tr>)}
          </tbody>
        </table>
      ),
      notation: 'π CUSTOMER_NAME (BORROW) ∪ π CUSTOMER_NAME (DEPOSITOR)',
    },
    difference: {
      title: 'Difference (−)',
      desc: 'Rows in first relation but not in second. Requires union compatibility.',
      input: (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="font-bold mb-2 text-sm">BORROW</div>
            <table className="data-table text-sm">
              <thead><tr><th>CUSTOMER_NAME</th></tr></thead>
              <tbody>
                <tr><td>Jones</td></tr>
                <tr><td>Smith</td></tr>
                <tr><td>Hayes</td></tr>
                <tr><td>Jackson</td></tr>
              </tbody>
            </table>
          </div>
          <div>
            <div className="font-bold mb-2 text-sm">DEPOSITOR</div>
            <table className="data-table text-sm">
              <thead><tr><th>CUSTOMER_NAME</th></tr></thead>
              <tbody>
                <tr><td>Johnson</td></tr>
                <tr><td>Smith</td></tr>
                <tr><td>Mayes</td></tr>
                <tr><td>Turner</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      ),
      output: (
        <table className="data-table text-sm">
          <thead><tr><th>CUSTOMER_NAME</th></tr></thead>
          <tbody>
            {['Hayes','Jackson','Jones'].map(n => <tr key={n}><td>{n}</td></tr>)}
          </tbody>
        </table>
      ),
      notation: 'π CUSTOMER_NAME (BORROW) − π CUSTOMER_NAME (DEPOSITOR)',
    },
    cartesian: {
      title: 'Cartesian Product (×)',
      desc: 'Combines every row of first table with every row of second table.',
      input: (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="font-bold mb-2 text-sm">EMPLOYEE</div>
            <table className="data-table text-sm">
              <thead><tr><th>EMP_ID</th><th>EMP_NAME</th><th>EMP_DEPT</th></tr></thead>
              <tbody>
                <tr><td>1</td><td>Smith</td><td>A</td></tr>
                <tr><td>2</td><td>Harry</td><td>C</td></tr>
                <tr><td>3</td><td>John</td><td>B</td></tr>
              </tbody>
            </table>
          </div>
          <div>
            <div className="font-bold mb-2 text-sm">DEPARTMENT</div>
            <table className="data-table text-sm">
              <thead><tr><th>DEPT_NO</th><th>DEPT_NAME</th></tr></thead>
              <tbody>
                <tr><td>A</td><td>Marketing</td></tr>
                <tr><td>B</td><td>Sales</td></tr>
                <tr><td>C</td><td>Legal</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      ),
      output: (
        <table className="data-table text-xs">
          <thead><tr><th>EMP_ID</th><th>EMP_NAME</th><th>DEPT</th><th>DEPT_NO</th><th>DEPT_NAME</th></tr></thead>
          <tbody>
            {[[1,'Smith','A','A','Marketing'],[1,'Smith','A','B','Sales'],[1,'Smith','A','C','Legal'],
              [2,'Harry','C','A','Marketing'],[2,'Harry','C','B','Sales'],[2,'Harry','C','C','Legal'],
              [3,'John','B','A','Marketing'],[3,'John','B','B','Sales'],[3,'John','B','C','Legal']
            ].map(([id,name,dept,dn,dn2],i) => (
              <tr key={i}><td>{id}</td><td>{name}</td><td>{dept}</td><td>{dn}</td><td>{dn2}</td></tr>
            ))}
          </tbody>
        </table>
      ),
      notation: 'EMPLOYEE × DEPARTMENT',
    },
    join: {
      title: 'Join (⋈)',
      desc: 'Combines related tuples from two relations based on a condition. The most important derived operation.',
      input: (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="font-bold mb-2 text-sm">EMPLOYEE</div>
            <table className="data-table text-sm">
              <thead><tr><th>EMP_CODE</th><th>EMP_NAME</th></tr></thead>
              <tbody>
                <tr><td>101</td><td>Stephan</td></tr>
                <tr><td>102</td><td>Jack</td></tr>
                <tr><td>103</td><td>Harry</td></tr>
              </tbody>
            </table>
          </div>
          <div>
            <div className="font-bold mb-2 text-sm">SALARY</div>
            <table className="data-table text-sm">
              <thead><tr><th>EMP_CODE</th><th>SALARY</th></tr></thead>
              <tbody>
                <tr><td>101</td><td>50000</td></tr>
                <tr><td>102</td><td>30000</td></tr>
                <tr><td>103</td><td>25000</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      ),
      output: (
        <table className="data-table text-sm">
          <thead><tr><th>EMP_CODE</th><th>EMP_NAME</th><th>SALARY</th></tr></thead>
          <tbody>
            <tr><td>101</td><td>Stephan</td><td>50000</td></tr>
            <tr><td>102</td><td>Jack</td><td>30000</td></tr>
            <tr><td>103</td><td>Harry</td><td>25000</td></tr>
          </tbody>
        </table>
      ),
      notation: 'EMPLOYEE ⋈ SALARY',
    },
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <ProgressBar />

      {/* Navigation */}
      <nav className="fixed top-1 left-0 w-full bg-slate-900/95 backdrop-blur-sm z-[999] border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          <div className="text-white font-bold text-lg">🗄️ RDBMS Learning Session</div>
          <ul className="hidden md:flex gap-5 list-none">
            {[
              ['hero','Home'],['fundamentals','Fundamentals'],['architecture','Architecture'],
              ['datamodels','Models'],['ermodel','ER Model'],['distributed','Distributed'],
              ['rdbms','RDBMS'],['relational-algebra','Rel. Algebra'],['anomalies','Anomalies'],
              ['normalization','Normalization'],['revision','Revision'],
            ].map(([id,label]) => (
              <li key={id}><a href={`#${id}`} className="text-gray-300 hover:text-white text-sm transition-colors">{label}</a></li>
            ))}
          </ul>
        </div>
      </nav>

      {/* ========== HERO ========== */}
      <section id="hero" className="bg-gradient-to-br from-slate-900 to-slate-800 text-white pt-24 pb-16">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-4 tracking-tight">RDBMS</h1>
          <p className="text-xl text-gray-300 mb-2">One Hour Interactive Learning Session</p>
          <p className="text-gray-400 mb-8 max-w-2xl mx-auto">From Database Fundamentals to Relational Design & Normalization</p>
          <div className="flex gap-4 justify-center mb-10 flex-wrap">
            <div className="bg-white/10 px-5 py-3 rounded-lg"><strong className="block text-2xl">60 min</strong><span className="text-gray-300">Session</span></div>
            <div className="bg-white/10 px-5 py-3 rounded-lg"><strong className="block text-2xl">10</strong><span className="text-gray-300">Core Topics</span></div>
            <div className="bg-white/10 px-5 py-3 rounded-lg"><strong className="block text-2xl">Unit 1+2</strong><span className="text-gray-300">Combined</span></div>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {['Database','DBMS','Data Models','ER Model','Relational Model','Distributed DB','RDBMS','Relational Algebra','Anomalies','Normalization'].map((step, i) => (
              <span key={i} className="flex items-center gap-2">
                <span className="bg-white/10 px-3 py-1.5 rounded text-sm border border-white/20">{step}</span>
                {i < 9 && <span className="text-blue-400 font-bold">→</span>}
              </span>
            ))}
          </div>
          <p className="mt-8 text-gray-500 text-sm">Use arrow keys or scroll to navigate</p>
        </div>
      </section>

      {/* ========== SECTION A: FUNDAMENTALS ========== */}
      <section id="fundamentals" className="py-16">
        <div className="max-w-5xl mx-auto px-4">
          <SectionHeader tag="Section A" tagColor="bg-blue-500" title="Database & DBMS Fundamentals" subtitle="Understanding what a database is, how a DBMS manages it, and why it matters." />

          <div className="grid md:grid-cols-2 gap-6 mb-10">
            <Card icon="🗄️" title="What is a Database?">
              <p>An <strong>organized collection of data</strong> that can be modified, retrieved, or updated. The data, the DBMS, and the applications together form the <strong>database concept</strong>. Data is stored in row and column format — called a <strong>table</strong>.</p>
              <Callout type="info" title="Real-world analogy">Think of a digital library catalog — not just books scattered on shelves, but organized, searchable, and updatable.</Callout>
            </Card>
            <Card icon="⚙️" title="What is a DBMS?">
              <p>A <strong>Database Management System (DBMS)</strong> is software that enables users to create, manage, and manipulate databases. It acts as an <strong>interface between users and the database</strong>, allowing efficient storage, retrieval, update, and deletion. Uses query languages like <strong>SQL</strong>.</p>
            </Card>
          </div>

          <h3 className="text-xl font-bold text-slate-900 mb-4">File System vs DBMS</h3>
          <ComparisonTable
            headers={['Aspect', 'File System', 'DBMS']}
            rows={[
              ['Data Structure', 'Unstructured or semi-structured files', 'Structured tables with defined schemas'],
              ['Data Redundancy', 'High — data duplicated across files', 'Low — centralized, shared data'],
              ['Concurrent Access', 'Limited — file locking issues', 'Multi-user with concurrency control'],
              ['Data Integrity', 'No built-in constraints', 'Enforced via constraints and rules'],
              ['Backup & Recovery', 'Manual, error-prone', 'Automated mechanisms'],
              ['Security', 'OS-level file permissions', 'Fine-grained access control'],
              ['Query Capability', 'No standard query language', 'SQL for complex queries'],
            ]}
          />

          <h3 className="text-xl font-bold text-slate-900 mb-4 mt-10">Characteristics of Database Approach</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
            {[
              { icon: '📊', title: 'Data Organization', desc: 'Structured in tables with columns and rows. Easy to search and access logically grouped data.' },
              { icon: '🔗', title: 'Data Integration', desc: 'Data from multiple sources linked via relationships. Retrieve across tables simultaneously.' },
              { icon: '✅', title: 'Data Integrity', desc: 'Rules and constraints ensure accuracy. Unique titles, valid date formats, range checks.' },
              { icon: '🔒', title: 'Data Security', desc: 'Access controls and encryption. Admins get full access; employees get limited views.' },
              { icon: '📈', title: 'Data Scalability', desc: 'Handles growing data volumes. Add more books, customers, orders without performance loss.' },
              { icon: '🔄', title: 'Data Independence', desc: 'Change structure without rewriting applications. Two types: physical and logical.' },
            ].map((item, i) => (
              <div key={i} className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
                <div className="font-bold text-lg mb-2 text-slate-900">{item.icon} {item.title}</div>
                <p className="text-gray-600 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>

          <h3 className="text-xl font-bold text-slate-900 mb-4">Advantages of DBMS</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
            {['Integrity & Security','Reduced Redundancy','Consistency','Efficient Data Access','Data Sharing','Backup & Recovery','Data Independence','Data Integration'].map((adv, i) => (
              <div key={i} className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 text-sm font-medium text-slate-800">{adv}</div>
            ))}
          </div>

          <details className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-8">
            <summary className="p-4 cursor-pointer font-semibold bg-gray-50 flex justify-between items-center">
              <span>📋 Limitations of DBMS (Reference Only)</span>
            </summary>
            <div className="p-4 text-sm text-gray-600 space-y-2">
              <p><strong>Cost:</strong> Expensive hardware, software, licensing, training</p>
              <p><strong>Complexity:</strong> Hard to design and manage; requires skilled staff</p>
              <p><strong>Performance:</strong> Can be slower for small-scale use</p>
              <p><strong>Currency:</strong> Frequent upgrades needed</p>
              <p><strong>Failure impact:</strong> Corruption may affect entire database</p>
            </div>
          </details>

          <Quiz
            question="Which problem does a DBMS primarily solve compared to a file system?"
            options={['A. Making files larger in size','B. Reducing data redundancy and improving integrity','C. Replacing the operating system','D. Eliminating the need for backups']}
            correctIndex={1}
            explanation="DBMS centralizes data, reduces redundancy through shared storage, and enforces integrity constraints that file systems lack."
          />
        </div>
      </section>

      {/* ========== SECTION B: ARCHITECTURE ========== */}
      <section id="architecture" className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <SectionHeader tag="Section B" tagColor="bg-green-500" title="DBMS Architecture" subtitle="How databases are structured internally — the blueprint that separates users from storage." />

          <Card icon="📐" title="Database Schema" className="mb-10">
            <p>The <strong>"blueprint"</strong> of a database. It describes how data relates to other tables or models. Defines table names, fields, data types, relationships, and logical constraints.</p>
          </Card>

          <h3 className="text-xl font-bold text-slate-900 mb-4">Three-Schema Architecture</h3>
          <p className="text-gray-600 mb-6">Click each layer to explore. This architecture separates logical and physical aspects, allowing changes in one layer without affecting others.</p>
          <SchemaDiagram />

          <h3 className="text-xl font-bold text-slate-900 mt-10 mb-4">Data Independence</h3>
          <p className="text-gray-600 mb-6">The ability to change one level without affecting the level above it.</p>
          <div className="grid md:grid-cols-2 gap-6 mb-10">
            <div className="bg-blue-50 rounded-xl p-6 border-l-4 border-blue-500">
              <div className="font-bold text-lg mb-2">🔧 Physical Data Independence</div>
              <p className="text-gray-600">Change <strong>how</strong> data is stored without affecting the logical view.</p>
              <p className="text-gray-600 mt-2 text-sm"><strong>Example:</strong> Switch from HDD to SSD — applications keep working unchanged.</p>
            </div>
            <div className="bg-green-50 rounded-xl p-6 border-l-4 border-green-500">
              <div className="font-bold text-lg mb-2">🧩 Logical Data Independence</div>
              <p className="text-gray-600">Change <strong>what</strong> data is stored without rewriting applications.</p>
              <p className="text-gray-600 mt-2 text-sm"><strong>Example:</strong> Add a new <em>department</em> attribute to the employee table — existing apps don't need changes.</p>
            </div>
          </div>

          <Quiz
            question="Which type of data independence allows changing the storage device without affecting application programs?"
            options={['A. Physical Data Independence','B. Logical Data Independence','C. Both','D. Neither']}
            correctIndex={0}
            explanation="Physical Data Independence shields applications from changes in storage technology (HDD → SSD, indexing changes, etc.)."
          />
        </div>
      </section>

      {/* ========== SECTION C: DATA MODELS ========== */}
      <section id="datamodels" className="py-16">
        <div className="max-w-5xl mx-auto px-4">
          <SectionHeader tag="Section C" tagColor="bg-purple-500" title="Database Models" subtitle="How data is organized, linked, and stored. From trees to tables." />

          <Card icon="📏" title="What is a Data Model?" className="mb-10">
            <p>A <strong>conceptual representation</strong> of how data is structured and related in a database. It is a <strong>blueprint or plan</strong> for organizing data logically and meaningfully.</p>
          </Card>

          <div className="grid md:grid-cols-3 gap-6 mb-10">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="text-2xl mb-3">🌳</div>
              <div className="font-bold text-lg mb-2 text-slate-900">Hierarchical Model</div>
              <p className="text-gray-600 text-sm">Tree structure (parent-child). <strong>1:N</strong> only. Fast traversal, but complex relationships not supported. Example: IBM IMS, Windows Registry.</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="text-2xl mb-3">🕸️</div>
              <div className="font-bold text-lg mb-2 text-slate-900">Network Model</div>
              <p className="text-gray-600 text-sm">Graph structure. Child can have <strong>multiple parents</strong>. <strong>M:N</strong> relationships. More flexible but very complex. Example: CODASYL.</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border-2 border-blue-500">
              <div className="text-2xl mb-3">📋</div>
              <div className="font-bold text-lg mb-2 text-blue-600">Relational Model ⭐</div>
              <p className="text-gray-600 text-sm"><strong>Two-dimensional tables</strong> (relations). Rows = tuples, Columns = attributes. <strong>This is the model we focus on.</strong></p>
            </div>
          </div>

          <h3 className="text-xl font-bold text-slate-900 mb-4">Relational Model Deep Dive</h3>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-6 text-center">
            <div className="inline-block">
              <table className="data-table">
                <thead><tr><th>STD_ID</th><th>NAME</th><th>CITY</th></tr></thead>
                <tbody>
                  <tr><td className="bg-blue-100 font-semibold">201</td><td>Bob</td><td>Hyderabad</td></tr>
                  <tr><td className="bg-blue-100 font-semibold">204</td><td>Lucky</td><td>Chennai</td></tr>
                  <tr><td className="bg-blue-100 font-semibold">205</td><td>Pinky</td><td>Bangalore</td></tr>
                </tbody>
              </table>
            </div>
            <p className="mt-4 text-sm text-gray-600">
              <strong>Relation</strong> = Table &nbsp;|&nbsp; <strong>Tuple</strong> = Row &nbsp;|&nbsp; <strong>Attribute</strong> = Column &nbsp;|&nbsp; <strong>Domain</strong> = Allowed values &nbsp;|&nbsp; <strong>Degree</strong> = # columns &nbsp;|&nbsp; <strong>Cardinality</strong> = # rows
            </p>
          </div>
        </div>
      </section>

      {/* ========== SECTION D: ER MODEL ========== */}
      <section id="ermodel" className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <SectionHeader tag="Section D" tagColor="bg-pink-500" title="ER Model & Database Design" subtitle="The visual language of databases. Design before you build." />

          <div className="grid md:grid-cols-2 gap-6 mb-10">
            <Card icon="👤" title="Entity">
              <p>A <strong>real-world object</strong> (animate or inanimate) that is easily identifiable. <strong>Examples:</strong> Student, Teacher, Course, Department. Represented as a <strong>rectangle</strong> in ER diagrams.</p>
            </Card>
            <Card icon="👥" title="Entity Set">
              <p>A <strong>group of entities of the same type</strong>. <strong>Examples:</strong> All students in a school, all employees in a company.</p>
            </Card>
          </div>

          <Card icon="🏷️" title="Attributes" className="mb-10">
            <p className="mb-4">Properties that describe an entity. All attributes have values and exist within a <strong>domain</strong>. Represented as ovals in ER diagrams.</p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {[
                { type: 'Simple', desc: 'Atomic, indivisible (phone number)', color: 'bg-gray-50' },
                { type: 'Key', desc: 'Uniquely identifies an entity (roll number) — underlined in ER', color: 'bg-blue-50' },
                { type: 'Composite', desc: 'Combination of attributes (address = pin + state + country)', color: 'bg-green-50' },
                { type: 'Multivalued', desc: 'Can hold multiple values — double oval in ER', color: 'bg-yellow-50' },
                { type: 'Derived', desc: 'Calculated from another attribute (age from DOB) — dashed oval', color: 'bg-purple-50' },
              ].map((attr, i) => (
                <div key={i} className={`${attr.color} rounded-lg p-4 border border-gray-200`}>
                  <div className="font-semibold text-slate-900">{attr.type}</div>
                  <p className="text-sm text-gray-600 mt-1">{attr.desc}</p>
                </div>
              ))}
            </div>
          </Card>

          <Card icon="🔗" title="Relationships & Cardinality" className="mb-10">
            <p className="mb-4">A <strong>relationship</strong> is an association among entities (represented as a diamond). Four cardinality types:</p>
            <div className="grid sm:grid-cols-2 gap-3">
              {[
                { type: 'One-to-One (1:1)', example: 'Person ↔ Passport', color: 'bg-blue-50' },
                { type: 'One-to-Many (1:N)', example: 'Customer → Orders', color: 'bg-green-50' },
                { type: 'Many-to-One (N:1)', example: 'Students → College', color: 'bg-yellow-50' },
                { type: 'Many-to-Many (M:N)', example: 'Students ↔ Courses', color: 'bg-purple-50' },
              ].map((rel, i) => (
                <div key={i} className={`${rel.color} rounded-lg p-3 border border-gray-200`}>
                  <div className="font-semibold text-sm">{rel.type}</div>
                  <p className="text-sm text-gray-600">{rel.example}</p>
                </div>
              ))}
            </div>
          </Card>

          <h3 className="text-xl font-bold text-slate-900 mb-4">Strong vs Weak Entity</h3>
          <div className="grid md:grid-cols-2 gap-6 mb-10">
            <div className="bg-white rounded-xl p-5 shadow-sm border-l-4 border-green-500 border border-gray-200">
              <div className="font-bold mb-2">Strong Entity</div>
              <p className="text-sm text-gray-600">Has its own existence and is <strong>independent</strong>. Uniquely identifiable by its own attributes. Represented by a <strong>single rectangle</strong>.</p>
              <p className="text-sm text-gray-500 mt-2">Example: Student, Employee, Bank</p>
            </div>
            <div className="bg-white rounded-xl p-5 shadow-sm border-l-4 border-red-500 border border-gray-200">
              <div className="font-bold mb-2">Weak Entity</div>
              <p className="text-sm text-gray-600">Cannot be uniquely identified by its own attributes. <strong>Relies on a relationship</strong> with a strong entity. Represented by a <strong>double rectangle</strong>.</p>
              <p className="text-sm text-gray-500 mt-2">Example: Bank Account (needs Bank to be identified)</p>
            </div>
          </div>

          <h3 className="text-xl font-bold text-slate-900 mb-4">Keys</h3>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-10">
            <p className="mb-4">Attributes or sets of attributes that <strong>uniquely identify</strong> entities. Represented with underlined names in ER diagrams.</p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {[
                { key: 'Candidate Key', desc: 'Minimal set of attributes that uniquely identify a tuple. Every table has at least one. May contain NULL.', color: 'bg-blue-50' },
                { key: 'Primary Key', desc: 'Chosen from candidate keys. Cannot be NULL. Uniquely identifies each record. Only one per table.', color: 'bg-green-50' },
                { key: 'Super Key', desc: 'Any set of attributes that uniquely identifies a tuple. A candidate key is a minimal super key.', color: 'bg-gray-50' },
                { key: 'Alternate Key', desc: 'Candidate keys other than the primary key. Secondary keys.', color: 'bg-yellow-50' },
                { key: 'Foreign Key', desc: 'A key that is a primary key in one table and references another table. Creates links between tables.', color: 'bg-purple-50' },
              ].map((item, i) => (
                <div key={i} className={`${item.color} rounded-lg p-4 border border-gray-200`}>
                  <div className="font-semibold text-sm text-slate-900">{item.key}</div>
                  <p className="text-xs text-gray-600 mt-1">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <h3 className="text-xl font-bold text-slate-900 mb-4">ER Diagram — Student-Course-Instructor</h3>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-6">
            <div className="flex flex-col items-center gap-4">
              {/* Entities row */}
              <div className="flex gap-8 flex-wrap justify-center">
                <div className="bg-blue-100 border-2 border-blue-500 rounded-lg px-6 py-4 text-center">
                  <div className="font-bold text-blue-800">STUDENT</div>
                  <div className="text-xs text-blue-600 mt-1">Student_ID, Name, Email, Age</div>
                </div>
                <div className="bg-green-100 border-2 border-green-500 rounded-lg px-6 py-4 text-center">
                  <div className="font-bold text-green-800">COURSE</div>
                  <div className="text-xs text-green-600 mt-1">Course_ID, Title, Credits</div>
                </div>
                <div className="bg-yellow-100 border-2 border-yellow-500 rounded-lg px-6 py-4 text-center">
                  <div className="font-bold text-yellow-800">INSTRUCTOR</div>
                  <div className="text-xs text-yellow-600 mt-1">Instructor_ID, Name, Dept</div>
                </div>
              </div>
              {/* Relationships */}
              <div className="flex gap-6 flex-wrap justify-center items-center text-sm">
                <div className="flex items-center gap-2">
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">STUDENT</span>
                  <span className="bg-orange-100 border border-orange-400 text-orange-800 px-3 py-1 rounded-full font-semibold">ENROLLS</span>
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded">COURSE</span>
                  <span className="text-gray-500 text-xs ml-1">M:N</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded">INSTRUCTOR</span>
                  <span className="bg-orange-100 border border-orange-400 text-orange-800 px-3 py-1 rounded-full font-semibold">TEACHES</span>
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded">COURSE</span>
                  <span className="text-gray-500 text-xs ml-1">1:N</span>
                </div>
              </div>
            </div>
            <Callout type="teacher" title="Teaching Note">
              Use this diagram as a running example throughout the session. The same Student-Course-Instructor model connects ER design, relational tables, foreign keys, relational algebra, and even normalization.
            </Callout>
          </div>
        </div>
      </section>

      {/* ========== SECTION E: DISTRIBUTED DATABASES ========== */}
      <section id="distributed" className="py-16">
        <div className="max-w-5xl mx-auto px-4">
          <SectionHeader tag="Section E" tagColor="bg-indigo-500" title="Distributed Databases" subtitle="When one machine isn't enough — data across multiple locations." />

          <Card icon="🌐" title="What is a Distributed Database?" className="mb-10">
            <p>A database system where data is <strong>stored across multiple locations or nodes</strong>, interconnected through a network. Users interact with the system as if it were a single, integrated database. Managed by a <strong>Distributed DBMS (DDBMS)</strong>.</p>
          </Card>

          <h3 className="text-xl font-bold text-slate-900 mb-4">Why Distributed Databases?</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
            {[
              { icon: '📈', title: 'Scalability', desc: 'Easily add more nodes to handle increasing data volumes and user demands.' },
              { icon: '🟢', title: 'High Availability', desc: 'Data replicated across nodes ensures the database remains operational even if some nodes fail.' },
              { icon: '⚡', title: 'Improved Performance', desc: 'Data stored closer to users reduces latency and speeds up access.' },
              { icon: '🛡️', title: 'Fault Tolerance', desc: 'Redundancy and replication minimize single point of failure.' },
              { icon: '🌍', title: 'Geographical Distribution', desc: 'Store data closer to where it\'s needed, benefiting global operations.' },
            ].map((item, i) => (
              <div key={i} className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
                <div className="font-bold text-lg mb-2">{item.icon} {item.title}</div>
                <p className="text-gray-600 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>

          <h3 className="text-xl font-bold text-slate-900 mb-4">Fragmentation</h3>
          <p className="text-gray-600 mb-4">Dividing the database into smaller, independent segments (fragments) stored on different nodes.</p>
          <div className="grid md:grid-cols-2 gap-6 mb-10">
            <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
              <div className="font-bold text-lg mb-2">📊 Horizontal Partitioning</div>
              <p className="text-gray-600 text-sm mb-3">Dividing a table by <strong>rows</strong>. Each fragment contains a subset of rows.</p>
              <table className="data-table text-xs">
                <thead><tr><th>ID</th><th>Name</th><th>City</th></tr></thead>
                <tbody>
                  <tr className="bg-blue-50"><td>1</td><td>Alice</td><td>Delhi</td></tr>
                  <tr className="bg-green-50"><td>2</td><td>Bob</td><td>Mumbai</td></tr>
                  <tr className="bg-blue-50"><td>3</td><td>Carol</td><td>Delhi</td></tr>
                  <tr className="bg-green-50"><td>4</td><td>Dave</td><td>Mumbai</td></tr>
                </tbody>
              </table>
              <p className="text-xs text-gray-500 mt-2">Blue = Node 1 &nbsp;|&nbsp; Green = Node 2</p>
            </div>
            <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
              <div className="font-bold text-lg mb-2">📊 Vertical Partitioning</div>
              <p className="text-gray-600 text-sm mb-3">Dividing a table by <strong>columns</strong>. Each fragment contains a subset of attributes.</p>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <div className="text-xs font-bold mb-1">Node 1</div>
                  <table className="data-table text-xs">
                    <thead><tr><th>ID</th><th>Name</th></tr></thead>
                    <tbody><tr><td>1</td><td>Alice</td></tr><tr><td>2</td><td>Bob</td></tr></tbody>
                  </table>
                </div>
                <div>
                  <div className="text-xs font-bold mb-1">Node 2</div>
                  <table className="data-table text-xs">
                    <thead><tr><th>ID</th><th>City</th></tr></thead>
                    <tbody><tr><td>1</td><td>Delhi</td></tr><tr><td>2</td><td>Mumbai</td></tr></tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          <h3 className="text-xl font-bold text-slate-900 mb-4">Replication</h3>
          <p className="text-gray-600 mb-4">Creating and maintaining multiple copies of data on different nodes for availability and fault tolerance.</p>
          <ComparisonTable
            headers={['Aspect', 'Synchronous Replication', 'Asynchronous Replication']}
            rows={[
              ['How it works', '"Wait for everyone to confirm"', '"Do your part, others will catch up"'],
              ['Data consistency', 'Zero data loss, all copies match', 'Risk of temporary inconsistency'],
              ['Latency', 'Higher — waits for all confirmations', 'Lower — primary acknowledged immediately'],
              ['Performance', 'Slower, especially with distance', 'Faster for geographically spread systems'],
              ['Risk', 'Minimal data loss', 'Some data loss if primary fails before copy'],
            ]}
          />

          <h3 className="text-xl font-bold text-slate-900 mb-4 mt-10">Distributed DB Architectures</h3>
          <div className="grid md:grid-cols-3 gap-4 mb-8">
            {[
              { title: 'Client-Server', desc: 'Clients send requests to central database servers. Server handles data management, query processing.', color: 'bg-blue-50' },
              { title: 'Peer-to-Peer', desc: 'Decentralized — each node acts as both client and server. Offers fault tolerance and scalability.', color: 'bg-green-50' },
              { title: 'Federated', desc: 'Integrates multiple independent databases into one logical system while keeping them autonomous.', color: 'bg-yellow-50' },
            ].map((arch, i) => (
              <div key={i} className={`${arch.color} rounded-xl p-5 border border-gray-200`}>
                <div className="font-bold text-lg mb-2">{arch.title}</div>
                <p className="text-gray-600 text-sm">{arch.desc}</p>
              </div>
            ))}
          </div>

          <details className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-6">
            <summary className="p-4 cursor-pointer font-semibold bg-gray-50">
              <span>📋 Homogeneous vs Heterogeneous (Reference)</span>
            </summary>
            <div className="p-4 text-sm text-gray-600 space-y-2">
              <p><strong>Homogeneous:</strong> All sites use the same DBMS, OS, and data structures. Can be autonomous (independent nodes) or non-autonomous (centralized coordination).</p>
              <p><strong>Heterogeneous:</strong> Sites may use different DBMSs, OS, and data models. Can be federated (collaborative) or unfederated (centralized access management).</p>
            </div>
          </details>
        </div>
      </section>

      {/* ========== SECTION F: RDBMS ========== */}
      <section id="rdbms" className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <SectionHeader tag="Section F" tagColor="bg-teal-500" title="RDBMS" subtitle="Relational Database Management System — the foundation of modern databases." />

          <Card icon="🏢" title="What is RDBMS?" className="mb-10">
            <p>A <strong>Relational Database Management System (RDBMS)</strong> is a system where data is organized in <strong>two-dimensional tables</strong> using rows and columns. It is one of the most popular data models used in industries, based on SQL. Every table has a key field which uniquely identifies each record.</p>
            <p className="mt-2 text-sm text-gray-500"><strong>Examples:</strong> Oracle Database, MySQL, Microsoft SQL Server, PostgreSQL</p>
          </Card>

          <h3 className="text-xl font-bold text-slate-900 mb-4">Key Elements of RDBMS</h3>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-10">
            <div className="inline-block w-full overflow-x-auto">
              <table className="data-table">
                <thead>
                  <tr><th>STUDENT_ID</th><th>NAME</th><th>COURSE_ID</th><th>DEPT</th></tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="bg-blue-100 font-semibold">101</td>
                    <td>Alice</td>
                    <td className="bg-yellow-100">CS101</td>
                    <td>Computer Science</td>
                  </tr>
                  <tr>
                    <td className="bg-blue-100 font-semibold">102</td>
                    <td>Bob</td>
                    <td className="bg-yellow-100">MA201</td>
                    <td>Mathematics</td>
                  </tr>
                  <tr>
                    <td className="bg-blue-100 font-semibold">103</td>
                    <td>Carol</td>
                    <td className="bg-yellow-100">CS101</td>
                    <td>Computer Science</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="mt-4 grid sm:grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
              <div className="bg-gray-50 p-3 rounded-lg"><strong>Table/Relation</strong><br/>The entire table above</div>
              <div className="bg-gray-50 p-3 rounded-lg"><strong>Tuple/Row</strong><br/>One student record (one row)</div>
              <div className="bg-gray-50 p-3 rounded-lg"><strong>Attribute/Column</strong><br/>STUDENT_ID, NAME, etc.</div>
              <div className="bg-gray-50 p-3 rounded-lg"><strong>Domain</strong><br/>Allowed values (e.g., integer for ID)</div>
            </div>
          </div>

          <h3 className="text-xl font-bold text-slate-900 mb-4">Integrity Constraints</h3>
          <div className="grid md:grid-cols-3 gap-4 mb-10">
            <div className="bg-blue-50 rounded-xl p-5 border border-blue-200">
              <div className="font-bold mb-2">Domain Constraints</div>
              <p className="text-sm text-gray-600">Define acceptable values for attributes. E.g., age must be positive, name must be text.</p>
            </div>
            <div className="bg-green-50 rounded-xl p-5 border border-green-200">
              <div className="font-bold mb-2">Key Constraints</div>
              <p className="text-sm text-gray-600">Each table must have a primary key for unique identification. No duplicate primary key values.</p>
            </div>
            <div className="bg-yellow-50 rounded-xl p-5 border border-yellow-200">
              <div className="font-bold mb-2">Referential Integrity</div>
              <p className="text-sm text-gray-600">Foreign keys must match primary keys in related tables. Maintains consistency between tables.</p>
            </div>
          </div>

          <h3 className="text-xl font-bold text-slate-900 mb-4">ACID Properties</h3>
          <p className="text-gray-600 mb-4">Properties that guarantee reliable transaction processing in a database:</p>
          <div className="grid sm:grid-cols-2 gap-4 mb-10">
            {[
              { letter: 'A', name: 'Atomicity', desc: 'Transaction is all-or-nothing. If any part fails, the entire transaction rolls back.', color: 'bg-red-50 border-red-200' },
              { letter: 'C', name: 'Consistency', desc: 'Transaction brings the database from one valid state to another. All rules and constraints must be satisfied.', color: 'bg-blue-50 border-blue-200' },
              { letter: 'I', name: 'Isolation', desc: 'Concurrent transactions don\'t interfere with each other. Each transaction appears to execute independently.', color: 'bg-green-50 border-green-200' },
              { letter: 'D', name: 'Durability', desc: 'Once committed, changes are permanent even if the system crashes. Stored in non-volatile memory.', color: 'bg-yellow-50 border-yellow-200' },
            ].map((prop, i) => (
              <div key={i} className={`${prop.color} rounded-xl p-5 border flex gap-4 items-start`}>
                <div className="text-3xl font-extrabold text-slate-400">{prop.letter}</div>
                <div>
                  <div className="font-bold text-lg">{prop.name}</div>
                  <p className="text-sm text-gray-600 mt-1">{prop.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <Callout type="teacher" title="Teaching Note for ACID">
            Use a banking analogy: "When you transfer ₹1000 from Account A to Account B, either both debiting and crediting happen (atomicity), the total money is preserved (consistency), no one else sees a half-done transfer (isolation), and once confirmed, it's permanent (durability)."
          </Callout>
        </div>
      </section>

      {/* ========== SECTION G: RELATIONAL ALGEBRA ========== */}
      <section id="relational-algebra" className="py-16">
        <div className="max-w-5xl mx-auto px-4">
          <SectionHeader tag="Section G" tagColor="bg-orange-500" title="Relational Algebra" subtitle="The mathematical foundation of database queries." />

          <Card icon="📐" title="What is Relational Algebra?" className="mb-10">
            <p>A <strong>procedural query language</strong> used to manipulate and retrieve data from relational databases. It provides the <strong>theoretical foundation</strong> for SQL. Operations work on entire relations (tables) and produce new relations as output.</p>
          </Card>

          <h3 className="text-xl font-bold text-slate-900 mb-4">Basic Operations</h3>
          <div className="flex flex-wrap gap-2 mb-6">
            {Object.entries(raOperations).map(([key, op]) => (
              <button
                key={key}
                onClick={() => setSelectedOp(key)}
                className={`px-4 py-2 rounded-lg border-2 font-semibold transition-all text-sm ${
                  selectedOp === key
                    ? 'bg-blue-500 text-white border-blue-500'
                    : 'bg-white border-gray-200 hover:border-blue-300 text-gray-700'
                }`}
              >
                {op.title}
              </button>
            ))}
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-6">
            <div className="font-bold text-lg mb-2 text-slate-900">{raOperations[selectedOp].title}</div>
            <p className="text-gray-600 mb-4">{raOperations[selectedOp].desc}</p>
            <div className="bg-slate-900 text-green-400 font-mono text-sm px-4 py-2 rounded-lg mb-4 inline-block">
              {raOperations[selectedOp].notation}
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <div className="text-sm font-bold text-gray-500 mb-2">INPUT</div>
                {raOperations[selectedOp].input}
              </div>
              <div>
                <div className="text-sm font-bold text-gray-500 mb-2">OUTPUT</div>
                {raOperations[selectedOp].output}
              </div>
            </div>
          </div>

          <h3 className="text-xl font-bold text-slate-900 mb-4">Operation Symbols Reference</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-8">
            {[
              { symbol: 'σ', name: 'Selection', desc: 'Filter rows' },
              { symbol: 'π', name: 'Projection', desc: 'Select columns' },
              { symbol: '∪', name: 'Union', desc: 'Combine rows' },
              { symbol: '−', name: 'Difference', desc: 'Rows in R not in S' },
              { symbol: '×', name: 'Cartesian Product', desc: 'All row combinations' },
              { symbol: '⋈', name: 'Join', desc: 'Combine on condition' },
            ].map((op, i) => (
              <div key={i} className="bg-white rounded-lg p-4 border border-gray-200 flex items-center gap-3">
                <span className="bg-slate-900 text-white font-mono text-xl px-3 py-1 rounded-lg min-w-[3rem] text-center">{op.symbol}</span>
                <div>
                  <div className="font-semibold text-sm">{op.name}</div>
                  <div className="text-xs text-gray-500">{op.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== SECTION H: ANOMALIES ========== */}
      <section id="anomalies" className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <SectionHeader tag="Section H" tagColor="bg-red-500" title="Database Anomalies" subtitle="Why poor table design causes real problems." />

          <Card icon="⚠️" title="What are Anomalies?" className="mb-10">
            <p>Anomalies are <strong>inconsistencies or problems</strong> that arise when you try to insert, delete, or update data in poorly designed tables. They occur due to <strong>data redundancy</strong> and <strong>poor table structure</strong>.</p>
          </Card>

          <h3 className="text-xl font-bold text-slate-900 mb-4">A Poorly Designed Table</h3>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-8">
            <div className="overflow-x-auto">
              <table className="data-table text-sm">
                <thead>
                  <tr><th>EMP_ID</th><th>EMP_NAME</th><th>DEPT_ID</th><th>DEPT_NAME</th><th>DEPT_LOC</th></tr>
                </thead>
                <tbody>
                  <tr><td>1</td><td>John</td><td>D1</td><td>IT</td><td>Building A</td></tr>
                  <tr><td>2</td><td>Jane</td><td>D1</td><td>IT</td><td>Building A</td></tr>
                  <tr><td>3</td><td>Bob</td><td>D2</td><td>HR</td><td>Building B</td></tr>
                  <tr><td>4</td><td>Alice</td><td>D1</td><td>IT</td><td>Building A</td></tr>
                </tbody>
              </table>
            </div>
            <p className="text-sm text-red-600 mt-3 font-medium">Notice: "IT" and "Building A" are repeated 3 times — this is data redundancy!</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-10">
            <div className="bg-red-50 rounded-xl p-6 border border-red-200">
              <div className="text-2xl mb-3">➕</div>
              <div className="font-bold text-lg mb-2 text-red-800">Insertion Anomaly</div>
              <p className="text-sm text-red-700">Can't add new data because you're missing other required information.</p>
              <Callout type="warning" title="Example">Can't add a new department (D3, Finance) unless there's an employee assigned to it, because EMP_ID (primary key) cannot be NULL.</Callout>
            </div>
            <div className="bg-yellow-50 rounded-xl p-6 border border-yellow-200">
              <div className="text-2xl mb-3">✏️</div>
              <div className="font-bold text-lg mb-2 text-yellow-800">Update Anomaly</div>
              <p className="text-sm text-yellow-700">Updating one instance but not others leads to contradictions.</p>
              <Callout type="warning" title="Example">If IT changes location to "Building C", we must update ALL rows where DEPT_NAME = "IT". Missing one creates inconsistent data.</Callout>
            </div>
            <div className="bg-orange-50 rounded-xl p-6 border border-orange-200">
              <div className="text-2xl mb-3">🗑️</div>
              <div className="font-bold text-lg mb-2 text-orange-800">Deletion Anomaly</div>
              <p className="text-sm text-orange-700">Deleting a record accidentally removes other important data.</p>
              <Callout type="warning" title="Example">If we delete employee Bob (the only HR employee), we lose all information about the HR department too.</Callout>
            </div>
          </div>

          <div className="bg-slate-900 text-white rounded-xl p-6 text-center">
            <div className="text-xl font-bold mb-2">How do we fix this?</div>
            <div className="text-gray-300">The answer is <span className="text-yellow-400 font-bold text-2xl">Normalization</span> — the next section.</div>
          </div>
        </div>
      </section>

      {/* ========== SECTION I: NORMALIZATION ========== */}
      <section id="normalization" className="py-16">
        <div className="max-w-5xl mx-auto px-4">
          <SectionHeader tag="Section I" tagColor="bg-violet-500" title="Normalization" subtitle="The systematic approach to eliminating redundancy and anomalies." />

          <Card icon="🔧" title="Why Normalization?" className="mb-10">
            <p>A large database defined as a single relation may result in <strong>data duplication</strong>. This causes: large relations, hard-to-maintain data, wasted disk space, and errors. Normalization <strong>decomposes relations into smaller, well-structured tables</strong> that minimize redundancy and eliminate anomalies.</p>
          </Card>

          <h3 className="text-xl font-bold text-slate-900 mb-4">Normalization Stepper</h3>
          <p className="text-gray-600 mb-4">Click each step to see the transformation:</p>

          <div className="flex flex-wrap gap-2 mb-6">
            {nfSteps.map((step) => (
              <button
                key={step.id}
                onClick={() => setActiveNF(step.id)}
                className={`px-4 py-2 rounded-lg border-2 font-semibold transition-all text-sm ${
                  activeNF === step.id
                    ? 'bg-violet-500 text-white border-violet-500'
                    : 'bg-white border-gray-200 hover:border-violet-300 text-gray-700'
                }`}
              >
                {step.title}
              </button>
            ))}
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-8">
            <div className="mb-4 overflow-x-auto">
              {nfSteps.find(s => s.id === activeNF)?.table}
            </div>
            <div className={`p-4 rounded-lg text-sm ${
              activeNF === 'original' ? 'bg-red-50 text-red-800 border border-red-200' : 'bg-green-50 text-green-800 border border-green-200'
            }`}>
              <strong>{activeNF === 'original' ? '⚠️ Problem:' : '✅ Fix:'}</strong> {nfSteps.find(s => s.id === activeNF)?.explanation}
            </div>
          </div>

          <h3 className="text-xl font-bold text-slate-900 mb-4">Normal Forms Summary</h3>
          <div className="space-y-4 mb-10">
            {[
              { form: '1NF', rule: 'Atomic values only', requirement: 'Remove multi-valued attributes and composite attributes', icon: '1️⃣' },
              { form: '2NF', rule: '1NF + No partial dependency', requirement: 'Non-key attributes must fully depend on the entire primary key', icon: '2️⃣' },
              { form: '3NF', rule: '2NF + No transitive dependency', requirement: 'Non-prime attributes must not depend on other non-prime attributes', icon: '3️⃣' },
            ].map((nf, i) => (
              <div key={i} className="bg-white rounded-xl p-5 shadow-sm border-l-4 border-violet-500 border border-gray-200 flex gap-4 items-start">
                <div className="text-3xl">{nf.icon}</div>
                <div>
                  <div className="font-bold text-lg">{nf.form}</div>
                  <div className="text-sm text-gray-600"><strong>Rule:</strong> {nf.rule}</div>
                  <div className="text-sm text-gray-500 mt-1"><strong>Requirement:</strong> {nf.requirement}</div>
                </div>
              </div>
            ))}
          </div>

          <details className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-8">
            <summary className="p-4 cursor-pointer font-semibold bg-gray-50">
              <span>📋 Beyond 3NF — BCNF, 4NF, 5NF (Reference)</span>
            </summary>
            <div className="p-4 text-sm text-gray-600 space-y-3">
              <p><strong>BCNF (Boyce-Codd Normal Form):</strong> Stronger than 3NF. For every functional dependency X → Y, X must be a super key. Handles cases where 3NF is insufficient.</p>
              <p><strong>4NF:</strong> No multi-valued dependencies. Decomposes tables where independent multi-valued facts about an entity are stored together.</p>
              <p><strong>5NF (Project-Join Normal Form):</strong> No join dependency. The table cannot be decomposed into smaller tables and reassembled without losing information.</p>
            </div>
          </details>

          <Quiz
            question="Which problem does normalization primarily help reduce?"
            options={['A. Network latency','B. Data redundancy and anomalies','C. CPU temperature','D. File compression']}
            correctIndex={1}
            explanation="Normalization minimizes data redundancy and eliminates insertion, update, and deletion anomalies by decomposing poorly designed tables."
          />
        </div>
      </section>

      {/* ========== SECTION J: ONE VIEW + REVISION ========== */}
      <section id="revision" className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <SectionHeader tag="Section J" tagColor="bg-slate-700" title="RDBMS in One View & Quick Revision" subtitle="Tying everything together — and a compact reference for review." />

          <h3 className="text-xl font-bold text-slate-900 mb-6 text-center">RDBMS — The Complete Picture</h3>
          <div className="bg-gradient-to-b from-slate-50 to-white rounded-xl p-8 shadow-sm border border-gray-200 mb-10">
            <div className="flex flex-col items-center gap-2">
              {[
                { label: 'Database', desc: 'Organized collection of data', color: 'bg-blue-100 border-blue-400 text-blue-800' },
                { label: 'DBMS', desc: 'Software to manage databases', color: 'bg-green-100 border-green-400 text-green-800' },
                { label: 'Data Models', desc: 'How data is structured', color: 'bg-purple-100 border-purple-400 text-purple-800' },
                { label: 'ER Model', desc: 'Visual blueprint of the database', color: 'bg-pink-100 border-pink-400 text-pink-800' },
                { label: 'Relational Model', desc: 'Tables, rows, columns', color: 'bg-indigo-100 border-indigo-400 text-indigo-800' },
                { label: 'RDBMS', desc: 'Implementation of relational model', color: 'bg-teal-100 border-teal-400 text-teal-800' },
                { label: 'Tables + Keys + Constraints', desc: 'Structure and integrity', color: 'bg-yellow-100 border-yellow-400 text-yellow-800' },
                { label: 'Relational Algebra', desc: 'Query operations', color: 'bg-orange-100 border-orange-400 text-orange-800' },
                { label: 'Anomalies', desc: 'Problems from poor design', color: 'bg-red-100 border-red-400 text-red-800' },
                { label: 'Normalization', desc: 'Systematic fix for anomalies', color: 'bg-emerald-100 border-emerald-400 text-emerald-800' },
              ].map((step, i) => (
                <div key={i} className="flex items-center gap-3 w-full max-w-md">
                  <div className={`${step.color} border-2 rounded-lg px-4 py-2 flex-1 text-center`}>
                    <div className="font-bold text-sm">{step.label}</div>
                    <div className="text-xs opacity-75">{step.desc}</div>
                  </div>
                </div>
              )).reduce((acc, el, i) => {
                acc.push(el);
                if (i < 9) acc.push(<div key={`arrow-${i}`} className="text-gray-400 text-xl text-center">↓</div>);
                return acc;
              }, [])}
            </div>
          </div>

          <h3 className="text-xl font-bold text-slate-900 mb-4">If You Remember Only These 10 Things...</h3>
          <div className="grid sm:grid-cols-2 gap-4 mb-10">
            {[
              'A database is an organized collection of data; a DBMS is the software that manages it.',
              'Three-schema architecture separates external, conceptual, and internal levels.',
              'The ER model uses entities, attributes, and relationships to design databases visually.',
              'The relational model organizes data into tables (relations) with rows (tuples) and columns (attributes).',
              'Keys (primary, foreign, candidate) uniquely identify and link data across tables.',
              'Distributed databases split data across nodes for scalability and fault tolerance.',
              'ACID properties guarantee reliable transactions: Atomicity, Consistency, Isolation, Durability.',
              'Relational algebra provides operations (σ, π, ∪, −, ×, ⋈) to query data.',
              'Anomalies (insertion, update, deletion) arise from poor table design and redundancy.',
              'Normalization (1NF → 2NF → 3NF) systematically eliminates redundancy and anomalies.',
            ].map((item, i) => (
              <div key={i} className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 flex gap-3 items-start">
                <span className="bg-slate-900 text-white text-sm font-bold w-7 h-7 rounded-full flex items-center justify-center shrink-0">{i + 1}</span>
                <p className="text-sm text-gray-700">{item}</p>
              </div>
            ))}
          </div>

          <h3 className="text-xl font-bold text-slate-900 mb-4">Quick Revision — Key Comparisons</h3>
          <ComparisonTable
            headers={['Aspect', '1NF', '2NF', '3NF']}
            rows={[
              ['Base', 'Atomic values', '1NF', '2NF'],
              ['Eliminates', 'Multi-valued attributes', 'Partial dependency', 'Transitive dependency'],
              ['Key requirement', 'Every cell has one value', 'Non-key fully depends on PK', 'No non-key → non-key dependency'],
              ['Example fix', 'Split phone numbers', 'Move age to separate table', 'Move city/state to zip table'],
            ]}
          />

          <h3 className="text-xl font-bold text-slate-900 mb-4 mt-10">10 Quick Questions</h3>
          <div className="space-y-6">
            {[
              { q: 'What is the primary key in a relational table?', a: 'A unique identifier for each row — cannot be NULL.' },
              { q: 'What does the σ (sigma) operation do in relational algebra?', a: 'Filters rows based on a condition (like SQL WHERE).' },
              { q: 'What is the difference between logical and physical data independence?', a: 'Physical = change storage without affecting logic. Logical = change schema without affecting applications.' },
              { q: 'Why is data redundancy a problem?', a: 'It wastes space, leads to update anomalies, and causes inconsistency.' },
              { q: 'What does ACID stand for?', a: 'Atomicity, Consistency, Isolation, Durability — properties of reliable transactions.' },
              { q: 'What is a foreign key?', a: 'A key that is a primary key in one table and references another table, creating a link.' },
              { q: 'What is 2NF?', a: 'A table in 1NF where all non-key attributes fully depend on the entire primary key (no partial dependency).' },
              { q: 'What is fragmentation in distributed databases?', a: 'Dividing the database into smaller fragments stored on different nodes.' },
              { q: 'What is the difference between synchronous and asynchronous replication?', a: 'Sync waits for all confirmations (higher consistency). Async acknowledges immediately (lower latency).' },
              { q: 'What is a candidate key?', a: 'A minimal set of attributes that uniquely identifies a tuple. A table can have multiple candidate keys.' },
            ].map((item, i) => (
              <details key={i} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <summary className="p-4 cursor-pointer font-semibold bg-gray-50 text-sm flex justify-between items-center">
                  <span>{i + 1}. {item.q}</span>
                </summary>
                <div className="p-4 text-sm text-gray-600 bg-green-50">
                  <strong>Answer:</strong> {item.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-gray-400 py-8 text-center text-sm">
        <p>RDBMS Teaching Session — Unit 1 & Unit 2 Combined</p>
        <p className="mt-1 text-gray-500">Source: Unit-1-RDBMS.pptx & Unit-2-RDBMS.pptx</p>
      </footer>
    </div>
  );
}

function SectionHeader({ tag, tagColor, title, subtitle }) {
  return (
    <div className="mb-10">
      <span className={`inline-block ${tagColor} text-white px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-3`}>{tag}</span>
      <h2 className="text-3xl font-extrabold text-slate-900 mb-3">{title}</h2>
      <p className="text-gray-600 text-lg max-w-3xl">{subtitle}</p>
    </div>
  );
}

function Card({ icon, title, children, className = '' }) {
  return (
    <div className={`bg-white rounded-xl p-6 shadow-sm border border-gray-200 ${className}`}>
      {icon && <div className="text-2xl mb-3">{icon}</div>}
      {title && <div className="font-bold text-xl mb-3 text-slate-900">{title}</div>}
      <div className="text-gray-600">{children}</div>
    </div>
  );
}

function ComparisonTable({ headers, rows }) {
  return (
    <div className="overflow-x-auto mb-6">
      <table className="w-full border-collapse bg-white rounded-xl overflow-hidden shadow-sm border border-gray-200">
        <thead>
          <tr className="bg-slate-900 text-white">
            {headers.map((h, i) => <th key={i} className="p-4 text-left font-semibold text-sm">{h}</th>)}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-t border-gray-100 hover:bg-gray-50">
              {row.map((cell, j) => (
                <td key={j} className={`p-4 text-sm ${j === 0 ? 'font-medium' : 'text-gray-600'}`}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
