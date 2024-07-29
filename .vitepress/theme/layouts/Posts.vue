<script lang="ts" setup>
import { data as posts } from "@data/posts.data"
</script>

<template>
	<div class="container">
		<div v-for="post in posts" :key="post.url">
			<a style="color: inherit" class="card" :href="post.url">
				<span class="title">{{ post.title }}</span>
				<!-- eslint-disable-next-line vue/no-v-html -->
				<div v-if="post.excerpt" class="content" v-html="post.excerpt"></div>
			</a>
		</div>
	</div>
</template>

<style lang="scss" scoped>
.container {
	position: relative;
	display: flex;
	justify-content: center;
	align-items: center;
	max-width: 1200px;
	flex-wrap: wrap;
	z-index: 1;

	.card {
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

		.title {
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
			opacity: 1;
			transition: opacity 0.3s ease-out;
		}

		.content {
			padding: 10px;
			text-align: center;
			transform: translateY(100px);
			opacity: 0;
			transition: 0.5s;
			height: 8rem;
			white-space: no-wrap;
			overflow: hidden;
			text-overflow: ellipsis;

			& ::v-deep(.header-anchor) {
				display: none;
			}
		}

		&:hover {
			.title {
				opacity: 0;
			}

			.content {
				transform: translateY(0px) scale(0.8);
				opacity: 1;
			}
		}
	}
}
</style>