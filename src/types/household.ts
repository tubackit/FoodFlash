export interface Household {
  id: string
  name: string
  icon: string
  color: string
}

export const DEFAULT_HOUSEHOLDS: Household[] = [
  {
    id: 'household1',
    name: 'Haushalt 1',
    icon: '🏠',
    color: 'bg-blue-600',
  },
  {
    id: 'household2',
    name: 'Haushalt 2',
    icon: '🏡',
    color: 'bg-green-600',
  },
  {
    id: 'household3',
    name: 'Haushalt 3',
    icon: '🏘️',
    color: 'bg-purple-600',
  },
]

