<script setup>
import { VPTeamMembers } from 'vitepress/theme'

const members = [
  {
    avatar: 'https://github.com/bwtx2023.png',
    name: 'bwtx2023',
    title: '创建者',
    links: [
      { icon: 'github', link: 'https://github.com/bwtx2023' },
    ]
  },
  {
    avatar: 'https://jsd.onmicrosoft.cn/avatar/636d113ce37111d08f08faee780ce9b8',
    name: 'Big_Cake',
    title: '站点维护',
    links: [
      { icon: 'github', link: 'https://github.com/Big-Cake-jpg' },
    ]
  },
  {
    avatar: 'https://github.com/bwtx2023.png',
    name: 'bwtx2023',
    title: '创建者',
    links: [
      { icon: 'github', link: 'https://github.com/bwtx2023' },
    ]
  },
  {
    avatar: 'https://github.com/bwtx2023.png',
    name: 'bwtx2023',
    title: '创建者',
    links: [
      { icon: 'github', link: 'https://github.com/bwtx2023' },
    ]
  },
]
</script>

# GlobeMC 成员列表

此处列出了 GlobeMC 团队的所有成员，没有他们就不会有团队的立项。

<VPTeamMembers size="small" :members="members" />
