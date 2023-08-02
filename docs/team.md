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
    avatar: 'https://jsd.onmicrosoft.cn/avatar/2defd5540f480625cf9d09e5d4c3b7c4.png',
    name: 'XieXiLin',
    title: '域名资金支持',
    links: [
      { icon: 'github', link: 'https://github.com/XieXiLin2' },
    ]
  },
  {
    avatar: 'https://jsd.onmicrosoft.cn/avatar/e5749fc6095cfe035dd18d405400c289.png',
    name: '233355607',
    title: '域名管理',
    links: [
      { icon: 'github', link: 'https://github.com/2623684696' },
    ]
  },
  {
    avatar: 'https://jsd.onmicrosoft.cn/avatar/4db948c2483ceca88a6ade051f37dc1e.png',
    name: 'bingxin666',
    title: '文档贡献者',
    links: [
      { icon: 'github', link: 'https://github.com/bingxin666' },
    ]
  },
  {
    avatar: 'https://github.com/Rovniced.png',
    name: 'Enlysure',
    title: '文档贡献者',
    links: [
      { icon: 'github', link: 'https://github.com/Rovniced' },
    ]
  },
  {
    avatar: 'https://github.com/hejiehao.png',
    name: '何杰豪',
    title: '文档贡献者',
    links: [
      { icon: 'github', link: 'https://github.com/hejiehao' },
    ]
  },
  {
    avatar: 'https://jsd.onmicrosoft.cn/avatar/e4e09756d8e17245eca044adccdc96a8.png',
    name: '思源千年',
    title: '文档贡献者',
    links: [
      { icon: 'github', link: 'https://github.com/Seayay' },
    ]
  },
  {
    avatar: 'https://github.com/zkitefly.png',
    name: 'zkitefly',
    title: '文档贡献者',
    links: [
      { icon: 'github', link: 'https://github.com/zkitefly' },
    ]
  },
  {
    avatar: 'https://github.com/ZhuRuoLing.png',
    name: '竹若泠',
    title: '文档贡献者',
    links: [
      { icon: 'github', link: 'https://github.com/ZhuRuoLing' },
    ]
  },
  {
    avatar: 'https://jsd.onmicrosoft.cn/avatar/581d7a85fb19ae52a34a93447f707b17.png',
    name: 'Z_Tsin',
    title: '文档贡献者',
    links: [
      { icon: 'github', link: 'https://github.com/ztsinsun' },
    ]
  },
  {
    avatar: 'https://github.com/Hex-Dragon.png',
    name: 'Hex Dragon',
    title: '文档贡献组织',
    links: [
      { icon: 'github', link: 'https://github.com/Hex-Dragon' },
    ]
  },
]
</script>

# GlobeMC 成员列表

此处列出了 GlobeMC 团队的所有成员，没有他们就不会有团队的立项。

<VPTeamMembers size="small" :members="members" />
