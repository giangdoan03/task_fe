<template>
	<main class="content">
		<div class="container-fluid p-0">
			<h1 class="h3 mb-3"><strong>Analytics</strong> Dashboard</h1>
			<div class="row">
				<!-- Add your content here -->
				<div class="col-xl-6 col-xxl-5 d-flex">
					<div class="w-100">
						<div class="row">
							<div class="col-sm-6">
								<div class="card">
									<div class="card-body">
										<h5 class="card-title">Sales</h5>
										<h1 class="mt-1 mb-3">2.382</h1>
										<span class="text-danger">
											<i class="mdi mdi-arrow-bottom-right"></i> -3.65%
										</span>
										<span class="text-muted">Since last week</span>
									</div>
								</div>
							</div>
							<!-- Add other cards and charts -->
						</div>
					</div>
				</div>
			</div>
		</div>
	</main>
</template>

<script>
export default {
	name: "MainContent"
};
</script>

<style scoped>
.card {
	word-wrap: break-word;
	background-clip: border-box;
	background-color: #fff;
	border: 0 solid transparent;
	border-radius: .25rem;
	display: flex;
	flex-direction: column;
	min-width: 0;
	position: relative;
}
</style>