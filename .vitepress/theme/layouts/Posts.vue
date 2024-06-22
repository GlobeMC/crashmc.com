<script lang="ts" setup>
import { data as posts } from "../../data/posts.data"
</script>

<template>
	<div class="container">
		<div v-for="post in posts" :key="post.url">
			<a style="color: inherit;" class="card" :href="post.url">
				<!-- <h3>{{ post.title }}</h3> -->
				<div class="excerpt" v-if="post.excerpt" v-html="post.excerpt"></div>
			</a>
		</div>
	</div>
</template>

<style scoped>
.container {
	/* border: 1px dashed; */
	display: grid;
	grid-template-columns: repeat(auto-fill, 20rem);
	justify-content: space-between;
}

.card {
	border: 1px solid rgba(0, 0, 0, 0.2);
	border-radius: 1.5rem;
	box-shadow: 0px 10px 15px -3px rgba(0, 0, 0, 0.1);
	display: flex;
	height: 15rem;
	overflow: hidden;
	justify-content: center;
}

.excerpt {
	transform: scale(0.8);
}
</style>