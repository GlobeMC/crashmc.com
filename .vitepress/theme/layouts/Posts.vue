<script lang="ts" setup>
import { data as posts } from "../../data/posts.data"
</script>

<template>
	<div class="container">
		<div v-for="post in posts" :key="post.url">
			<a style="color: inherit;" class="card" :href="post.url">
				<span class="title">{{ post.title }}</span>
				<div class="content" v-if="post.excerpt" v-html="post.excerpt"></div>
			</a>
		</div>
	</div>
</template>

<style scoped>
.container {
	position: relative;
	display: flex;
	justify-content: center;
	align-items: center;
	max-width: 1200px;
	flex-wrap: wrap;
	z-index: 1;
}

.container .card {
	position: relative;
	width: 15rem;
	height: 10rem;
	margin: 30px;
	box-shadow: 20px 20px 50px rgba(0, 0, 0, 0.5);
	border-radius: 15px;
	background: rgba(255, 255, 255, 0.1);
	overflow: hidden;
	display: flex;
	justify-content: center;
	align-items: center;
	border-top: 1px solid rgba(255, 255, 255, 0.5);
	border-left: 1px solid rgba(255, 255, 255, 0.5);
	backdrop-filter: blur(5px);

}

.container .card .title {
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	opacity: 1;
	transition: opacity 0.3s ease-out;
}

.container .card:hover .title {
	opacity: 0;
}

.container .card .content {
	padding: 20px;
	text-align: center;
	transform: translateY(100px);
	opacity: 0;
	transition: 0.5s;
}

.container .card:hover .content {
	transform: translateY(0px);
	opacity: 1;
}

.container .card .content h2 {
	position: absolute;
	top: -60px;
	right: 1px;
	font-size: 10em;
	color: rgba(255, 255, 255, 0.05);
	pointer-events: none;
}

.container .card .content h3 {
	font-size: 1.8em;
	color: #fff;
	z-index: 1;
}

.container .card .content p {
	font-size: 1em;
	color: #fff;
	font-weight: 300;
}

.container .card .content a {
	position: relative;
	display: inline-block;
	padding: 8px 20px;
	margin-top: 15px;
	background: #fff;
	color: #000;
	border-radius: 20px;
	text-decoration: none;
	font-weight: 500;
	box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
}
</style>