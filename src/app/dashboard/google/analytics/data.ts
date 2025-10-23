export const kpis = {
    users: 26000,
    sessions: 32000,
    bounceRate: 45.8,
    sessionDuration: '00:03:15',
}

export const performanceOverTime = [
    { name: 'Seg', Usuários: 2800, Sessões: 3200 },
    { name: 'Ter', Usuários: 3100, Sessões: 3500 },
    { name: 'Qua', Usuários: 3500, Sessões: 4000 },
    { name: 'Qui', Usuários: 3200, Sessões: 3800 },
    { name: 'Sex', Usuários: 4000, Sessões: 4800 },
    { name: 'Sab', Usuários: 4500, Sessões: 5500 },
    { name: 'Dom', Usuários: 3000, Sessões: 3300 },
];

export const sessionsByDevice = [
    { name: 'Desktop', value: 65, fill: 'hsl(var(--chart-1))' },
    { name: 'Mobile', value: 30, fill: 'hsl(var(--chart-2))' },
    { name: 'Tablet', value: 5, fill: 'hsl(var(--chart-3))' },
];

export const trafficByChannel = [
    { name: 'Orgânico', value: 40, fill: 'hsl(var(--chart-1))' },
    { name: 'Pago', value: 30, fill: 'hsl(var(--chart-2))' },
    { name: 'Direto', value: 20, fill: 'hsl(var(--chart-3))' },
    { name: 'Referência', value: 10, fill: 'hsl(var(--chart-4))' },
]

export const topPages = [
    { path: '/', views: 15200, avgTime: '00:04:30' },
    { path: '/produtos', views: 8500, avgTime: '00:03:10' },
    { path: '/blog/como-comecar', views: 5300, avgTime: '00:05:45' },
    { path: '/precos', views: 3100, avgTime: '00:02:15' },
    { path: '/contato', views: 1500, avgTime: '00:01:30' },
]
