<script setup>
import { VPTeamMembers } from 'vitepress/theme'
import members from "../../.vitepress/data/members.json"
</script>

# 贡献者

此处列出了本文档的所有贡献者，感谢他们为文档作出的贡献。

<VPTeamMembers size="small" :members="members" />
