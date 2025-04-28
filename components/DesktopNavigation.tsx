'use client';

import { Group, Tabs, Text } from '@mantine/core';
import { usePathname, useRouter } from 'next/navigation';
import { IconSettings, IconList, IconCircleDashedPlus } from '@tabler/icons-react';

const navItems = [
  { icon: IconCircleDashedPlus, label: 'New charging', path: ['/new-charging'] },
  { icon: IconList, label: 'Chargings', path: ['/chargings'] },
  { icon: IconSettings, label: 'Settings', path: ['/settings'] },
];

function DesktopNavigation() {
  const pathname = usePathname();
  const router = useRouter();

  const handleChange = (value: string | null) => {
    if (value && value !== pathname) {
      router.push(value);
    }
  };

  return (
    <Group 
        bg="#262626"
        align='center'
        justify='space-between'
        style={{
            position: 'sticky',
            top: 0,
            zIndex: 1000,
            borderBottom: '1px solid #0d273b',
          }}
    >
      <Group>
        <Group
            ml={20}  
        >
            <Text
                size="32px"
                fw={700}
                c="#fffb00"
                >
                EV
            </Text>
            <Text
                ml={-15}
                size="32px"
                fw={700}
                >
                Helper
            </Text>
        </Group>
      </Group>
        <Tabs 
            value={pathname} 
            onChange={handleChange} 
            bg="#262626"
            color='#ff0052'
            variant="none"
            mr={100}
        >
            <Tabs.List>
                {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = item.path.includes(pathname);

                return (
                    <Tabs.Tab
                        key={item.path[0]}
                        value={item.path[0]}
                        leftSection={<Icon size={30} color={isActive ? "#fffb00" : '#f0f0f0'} />}
                        pl={70}
                    >
                        <Text c={'white'} size="m">{item.label}</Text>
                    </Tabs.Tab>
                );
                })}
                </Tabs.List>
            </Tabs>
    </Group>
  );
}

export default DesktopNavigation;