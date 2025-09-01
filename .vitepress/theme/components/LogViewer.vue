<script setup lang="ts">
import { type Ref, ref, onMounted, nextTick } from "vue"
import axios from "axios"
import {
	getAuthToken,
	expireAuthToken,
	redirectToAuth,
} from "@/theme/auth/github"

const loading = ref(true)
const errorStr = ref("")
const linkType = ref("")
const linkUrl = ref("")
const filename = ref("")
const logStr = ref("")
const lines: Ref<string[]> = ref([])
const lineRefs: Ref<HTMLElement[]> = ref([])
const focusingLine: Ref<number | null> = ref(null)
const logLineWrap = ref(false)

function focusLine(lineNo: number, smooth?: boolean) {
	focusingLine.value = lineNo
	const line = lineRefs.value[lineNo - 1]
	if (line) {
		const view = line.getBoundingClientRect()
		window.scrollTo({
			top: window.pageYOffset - 160 + view.top,
			behavior: smooth ? "smooth" : "instant",
		})
	}
}

function setTargetLine(line: number) {
	const newHash = `#L${line}`
	if (window.location.hash !== newHash) {
		window.history.pushState(null, document.title, newHash)
	}
	focusLine(line, true)
}

async function onShare(): Promise<void> {
	if (linkType.value !== "blob" && linkType.value !== "share-blob") {
		throw new Error("Cannot share from non-blob link")
	}
	console.log("creating gist")
	const log = logStr.value
	const oauthToken = getAuthToken()
	if (!oauthToken) {
		const redirectBack = `/log-viewer.html?type=share-blob&link=${escape(
			linkUrl.value,
		)}&name=${escape(filename.value)}`
		redirectToAuth(redirectBack, "gist")
		return
	}
	const files: { [name: string]: { content: string } } = {}
	files[filename.value] = {
		content: log,
	}
	const resp = await axios.post(
		"https://api.github.com/gists",
		{
			public: true,
			description: "CrashMC.com shared log",
			files: files,
		},
		{
			validateStatus: () => true,
			headers: {
				Authorization: "Bearer " + oauthToken,
			},
		},
	)
	if (resp.status === 401) {
		expireAuthToken()
		console.log("Token expired, relog")
		const redirectBack = `/log-viewer.html?type=share-blob&link=${escape(
			linkUrl.value,
		)}&name=${escape(filename.value)}`
		redirectToAuth(redirectBack, "gist")
		return
	}
	if (resp.status !== 201) {
		errorStr.value = "分享错误 " + resp.status + " " + resp.statusText
		return
	}
	const gistId = resp.data.id
	window.location.replace(
		`/log-viewer.html?type=gist&link=${escape(gistId)}&name=${escape(
			filename.value,
		)}`,
	)
}

onMounted(async () => {
	loading.value = true
	const query = new URLSearchParams(window.location.search)

	const linkTyp = query.get("type")
	const link = query.get("link")
	const name = query.get("name")
	const lineNo =
		(window.location.hash.startsWith("#L") &&
			Number.parseInt(window.location.hash.substring(2))) ||
		null

	var log: string

	try {
		if (!link) {
			errorStr.value = `Must give URL param "link"`
			return
		}
		if (!name) {
			errorStr.value = `Must give URL param "name"`
			return
		}

		switch (linkTyp) {
			case "share-blob":
			case "blob": {
				const resp = await fetch(link).catch(() => {
					throw "文件不存在或已过期"
				})
				log = await resp.text()
				break
			}
			case "gist": {
				// TODO: is useCDN(`https://api.github.com/gists/${link}`) good for the rate limit?
				const resp = await fetch(`https://api.github.com/gists/${link}`)
				if (resp.status !== 200) {
					switch (resp.status) {
						case 403:
							throw "Github API 速率限制"
						case 404:
							throw "文件不存在"
						default:
							throw `未知错误: ${resp.status} ${resp.statusText}`
					}
				}
				const res = await resp.json()
				const file = res.files[name] || Object.values(res.files)[0]
				if (!file) {
					throw "文件不存在"
				} else {
					log = file.content
				}
				break
			}
			default:
				errorStr.value = `Unknown link type "${linkTyp}"`
				return
		}
	} catch (err) {
		errorStr.value = String(err)
		return
	} finally {
		loading.value = false
	}
	errorStr.value = ""
	linkType.value = linkTyp
	linkUrl.value = link
	filename.value = name
	logStr.value = log
	if (linkTyp === "share-blob") {
		errorStr.value = "分享中, 请稍后 ..."
		onShare()
		return
	}
	lines.value = log.split(/\r?\n|\r|\n/g)

	if (lineNo) {
		await nextTick()
		focusLine(lineNo)
	}
})
</script>

<template>
	<div v-if="loading" class="loading">
		<i>Loading ...</i>
	</div>
	<div v-else-if="errorStr" class="error">错误: {{ errorStr }}</div>
	<div v-else class="box" :wrap="logLineWrap">
		<div class="head">
			<h3 class="filename" :title="filename">{{ filename }}</h3>
			<div class="head-opers">
				<div><input v-model="logLineWrap" type="checkbox" />自动换行</div>
				<button v-if="linkType === 'blob'" @click="onShare">分享</button>
				<a
					v-if="linkType === 'gist'"
					:href="`https://gist.github.com/${linkUrl}`">
					Gist 链接
				</a>
			</div>
		</div>
		<table>
			<tbody>
				<tr
					v-for="(line, i) in lines"
					:key="i"
					ref="lineRefs"
					:focused="i + 1 === focusingLine">
					<td class="line-no" @click="setTargetLine(i + 1)">
						{{ i + 1 }}
					</td>
					<td class="line">{{ line }}</td>
				</tr>
			</tbody>
		</table>
	</div>
</template>

<style scoped>
.loading {
	margin-top: 1rem;
	padding: 1rem;
	font-size: 1.2rem;
}

.error {
	margin-top: 1rem;
	padding: 1rem;
	font-size: 1.2rem;
	font-weight: bold;
	color: red;
}

.box {
	margin-top: 1rem;
	border: 1px solid var(--vp-c-divider);
	border-radius: 0.5rem;
	font-family: monospace;
}

.box[wrap="true"] {
	white-space: pre-wrap;
	overflow-wrap: anywhere;
}

.box:not([wrap="true"]) {
	white-space: pre;
}

.head {
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: space-between;
	margin-top: 0.5rem;
	padding: 0 0.5rem;
}

.filename {
	margin: 0;
	font-size: 0.9rem;
}

.head-opers {
	display: flex;
	flex-direction: row;
	align-items: center;
	height: 100%;
	font-size: 0.8rem;
	user-select: none;
}

.head-opers > div {
	display: flex;
	flex-direction: row;
	align-items: center;
	margin-right: 0.3rem;
}

.head-opers button {
	padding: 0.1rem 0.5rem;
	border: var(--vp-button-brand-border) 1px solid;
	border-radius: 0.8rem;
	transition: all 0.2s ease;
}

.head-opers button:hover {
	color: var(--vp-button-brand-hover-text);
	background: var(--vp-button-brand-hover-bg);
}

.box table {
	margin: 0;
	margin-top: 0.5rem;
	border-top: 1px solid var(--vp-c-divider);
	line-height: 1rem;
	font-size: 0.8rem;
}

.box tbody tr {
	border: none;
	background: none;
}

.box tbody tr[focused="true"] {
	background: var(--vp-c-brand-light);
}

.box .line-no {
	position: relative;
	padding: 0.1rem 1rem;
	border: none;
	border-right: 1px solid var(--vp-c-divider);
	white-space: nowrap;
	text-align: right;
	vertical-align: top;
	user-select: none;
	cursor: pointer;
}

.box tr[focused="true"] > .line-no::before {
	content: " ";
	display: block;
	position: absolute;
	top: 0;
	right: -1px;
	width: 0.4rem;
	height: 100%;
	background: var(--vp-c-brand-darker);
}

.box .line {
	padding: 0;
	padding-left: 1rem;
	border: none;
	line-height: 1.2rem;
}
</style>
