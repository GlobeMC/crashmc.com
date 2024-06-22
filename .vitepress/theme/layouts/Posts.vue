<script lang="ts" setup>
import { data as posts } from "../../utils/posts.data"

</script>

<template>
	<div v-for="post in posts" :key="post.url">
		<a :href="post.url">
			{{ post.title }}
		</a>
		<!-- <div v-html="post.excerpt"></div> -->
	</div>
</template>

<style scoped></style>