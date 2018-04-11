const data2 = [
  {
    id: 1,
    level: 0,
    pid: 0,
    name: '前端技术',
  },
  {
    id: 2,
    level: 0,
    pid: 0,
    name: '后端技术',
  },
  {
    id: 3,
    level: 0,
    pid: 0,
    name: '平面设计',
  },
  {
    id: 4,
    level: 0,
    pid: 0,
    name: '其他内容',
  },
  {
    id: 5,
    level: 1,
    pid: 1,
    name: 'JavaScript',
  },
  {
    id: 6,
    level: 1,
    pid: 2,
    name: 'Java',
  },
  {
    id: 7,
    level: 1,
    pid: 3,
    name: 'Photoshop',
  },
  {
    id: 8,
    level: 1,
    pid: 4,
    name: '广告',
  },
  {
    id: 9,
    level: 2,
    pid: 5,
    name: 'React',
  },
  {
    id: 10,
    level: 2,
    pid: 6,
    name: 'Spring Boot',
  },
  {
    id: 11,
    level: 2,
    pid: 7,
    name: '使用技巧',
  },
  {
    id: 12,
    level: 2,
    pid: 8,
    name: '文案',
  },
];

function makeCascader(data) {
  const arr = [];
  data.map((item) => {
    // 构造一级菜单
    if (item.level === 0) {
      const obj = {
        value: item.id,
        label: item.name,
        children: [],
      };
      data.map((item2) => {
        if (item2.level === 1 && obj.value === item2.pid) {
          const obj2 = {
            value: item.id,
            label: item.name,
            children: [],
          };
          data.map((item3) => {
            if (item3.level === 2 && obj2.value === item3.pid) {
              const obj3 = {
                value: item.id,
                label: item.name,
              };
              obj2.children.push(obj3);
            }
          });
          obj.children.push(obj2);
        }
      });
      arr.push(obj);
    }
  });
  return arr;
}

