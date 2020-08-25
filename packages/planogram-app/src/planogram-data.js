const data = {
  products: {
    'prod-1': { id: 'prod-1', image: '1.jpg', label: '5701', type: 'SINGLE' },
    'prod-2': { id: 'prod-2', image: '2.jpg', label: '5702', type: 'SINGLE' },
    'prod-3': { id: 'prod-3', image: '3.jpg', label: '5703', type: 'SINGLE' },
    'prod-4': { id: 'prod-4', image: '4.jpg', label: '5704', type: 'SINGLE' },
    'prod-5': { id: 'prod-5', image: '5.jpg', label: '5705', type: 'DOUBLE' },
    'prod-6': { id: 'prod-6', image: '6.jpg', label: '5706', type: 'SINGLE' },
    'prod-7': { id: 'prod-7', image: '1.jpg', label: '5707', type: 'SINGLE' },
    'prod-8': { id: 'prod-8', image: '2.jpg', label: '5708', type: 'SINGLE' },
    'prod-9': { id: 'prod-9', image: '3.jpg', label: '5709', type: 'SINGLE' },
    'prod-10': { id: 'prod-10', image: '4.jpg', label: '5710', type: 'SINGLE' },
    'prod-11': { id: 'prod-11', image: '5.jpg', label: '5711', type: 'DOUBLE' },
    'prod-12': { id: 'prod-12', image: '6.jpg', label: '5712', type: 'SINGLE' },
    'prod-13': { id: 'prod-13', image: '1.jpg', label: '5713', type: 'SINGLE' },
    'prod-14': { id: 'prod-14', image: '2.jpg', label: '5714', type: 'SINGLE' },
    'prod-15': { id: 'prod-15', image: '3.jpg', label: '5715', type: 'SINGLE' },
    'prod-16': { id: 'prod-16', image: '4.jpg', label: '5716', type: 'SINGLE' },
    'prod-17': { id: 'prod-17', image: '5.jpg', label: '5717', type: 'DOUBLE' },
    'prod-18': { id: 'prod-18', image: '6.jpg', label: '5718', type: 'SINGLE' }
  },
  shelfs: {
    'shelf-1': {
      id: 'shelf-1',
      title: 'Shelf 1',
      prodIds: ['prod-1', 'prod-2', 'prod-3', 'prod-4', 'prod-5', 'prod-6'],
      layout: [
        { w: 1, h: 1 },
        { w: 1, h: 1 },
        { w: 1, h: 1 },
        { w: 1, h: 1 },
        { w: 2, h: 1 },
        { w: 1, h: 1 }
      ]
    },
    'shelf-2': {
      id: 'shelf-2',
      title: 'Shelf 2',
      prodIds: ['prod-7', 'prod-8', 'prod-9', 'prod-10', 'prod-11', 'prod-12'],
      layout: [
        { w: 1, h: 1 },
        { w: 1, h: 1 },
        { w: 1, h: 1 },
        { w: 1, h: 1 },
        { w: 2, h: 1 },
        { w: 1, h: 1 }
      ]
    },
    'shelf-3': {
      id: 'shelf-3',
      title: 'Shelf 3',
      prodIds: [
        'prod-13',
        'prod-14',
        'prod-15',
        'prod-16',
        'prod-17',
        'prod-18'
      ],
      layout: [
        { w: 1, h: 1 },
        { w: 1, h: 1 },
        { w: 1, h: 1 },
        { w: 1, h: 1 },
        { w: 2, h: 1 },
        { w: 1, h: 1 }
      ]
    }
  },
  shelfOrder: ['shelf-1', 'shelf-2', 'shelf-3']
};

export default data;
