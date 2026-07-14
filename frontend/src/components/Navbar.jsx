import { NavLink } from 'react-router-dom'

const links = [
  { to: '/',           label: '📢 Campaigns'  },
  { to: '/targeting',  label: '🎯 Targeting'  },
  { to: '/analytics',  label: '📊 Analytics'  },
  { to: '/insights',   label: '🤖 AI Insights' },
]

export default function Navbar() {
  return (
    <nav className="bg-gray-900 text-white px-6 py-4 flex items-center gap-8 shadow-lg">
      <span className="text-xl font-bold text-blue-400 mr-6">
        Marketing Platform
      </span>
      {links.map(link => (
        <NavLink
          key={link.to}
          to={link.to}
          end={link.to === '/'}
          className={({ isActive }) =>
            `text-sm font-medium transition-colors ${
              isActive ? 'text-blue-400 border-b-2 border-blue-400 pb-1' : 'text-gray-300 hover:text-white'
            }`
          }
        >
          {link.label}
        </NavLink>
      ))}
    </nav>
  )
}
